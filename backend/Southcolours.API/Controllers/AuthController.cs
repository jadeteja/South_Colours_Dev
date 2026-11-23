using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Southcolours.Application.DTOs;
using Southcolours.Application.Interfaces;
using Southcolours.Domain.Entities;
using Southcolours.Persistence.Context;

namespace Southcolours.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _dbContext;
    private readonly IEmailService _emailService;

    public AuthController(
        UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        IConfiguration configuration,
        ApplicationDbContext dbContext,
        IEmailService emailService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _dbContext = dbContext;
        _emailService = emailService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            return BadRequest(new { Message = "Email address already registered." });

        var user = new IdentityUser
        {
            UserName = request.Email,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, "Customer");

        // Create CustomerProfile record
        var profile = new CustomerProfile
        {
            UserId = user.Id,
            FullName = request.FullName,
            PhoneNumber = request.PhoneNumber
        };
        _dbContext.CustomerProfiles.Add(profile);
        await _dbContext.SaveChangesAsync();

        // Send welcome email asynchronously
        _ = Task.Run(async () =>
        {
            try
            {
                await _emailService.SendWelcomeEmailAsync(request.Email, request.FullName);
                await _emailService.SendAdminNotificationAsync("New Customer Registered", $"A new user '{request.FullName}' ({request.Email}) just registered.");
            }
            catch { }
        });

        var token = await GenerateJwtTokenAsync(user);
        return Ok(new AuthResponse(
            Token: token,
            Email: user.Email!,
            FullName: request.FullName,
            Roles: ["Customer"],
            ExpiresAt: DateTime.UtcNow.AddMinutes(120)
        ));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            return Unauthorized(new { Message = "Invalid email or password." });

        var roles = await _userManager.GetRolesAsync(user);
        var token = await GenerateJwtTokenAsync(user);

        return Ok(new AuthResponse(
            Token: token,
            Email: user.Email!,
            FullName: user.UserName ?? user.Email!,
            Roles: roles.ToArray(),
            ExpiresAt: DateTime.UtcNow.AddMinutes(120)
        ));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var email = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
            return Unauthorized();

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return NotFound();

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(new
        {
            Id = user.Id,
            Email = user.Email,
            Roles = roles
        });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { Message = "Email is required." });

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            // Do not reveal whether user exists for security
            return Ok(new { Message = "If an account with that email exists, a reset code has been sent." });
        }

        // Generate a 6-digit OTP token
        var random = new Random();
        var otp = random.Next(100000, 999999).ToString();

        // In Identity, GenerateUserTokenAsync with DataProtectorTokenProvider or custom provider
        await _userManager.SetAuthenticationTokenAsync(user, "Default", "PasswordResetOtp", otp);

        _ = Task.Run(async () =>
        {
            try
            {
                await _emailService.SendPasswordResetOtpAsync(user.Email!, otp);
            }
            catch { }
        });

        return Ok(new { Message = "If an account with that email exists, a reset code has been sent." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordOtpRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Otp) || string.IsNullOrWhiteSpace(request.NewPassword))
            return BadRequest(new { Message = "Email, OTP, and New Password are required." });

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return BadRequest(new { Message = "Invalid request or token." });

        var storedOtp = await _userManager.GetAuthenticationTokenAsync(user, "Default", "PasswordResetOtp");
        if (string.IsNullOrEmpty(storedOtp) || storedOtp != request.Otp)
        {
            return BadRequest(new { Message = "Invalid or expired verification code." });
        }

        var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, resetToken, request.NewPassword);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        // Clear used token
        await _userManager.RemoveAuthenticationTokenAsync(user, "Default", "PasswordResetOtp");

        return Ok(new { Message = "Password has been reset successfully. You can now log in." });
    }

    private async Task<string> GenerateJwtTokenAsync(IdentityUser user)
    {
        var secret = _configuration["JwtSettings:Secret"] ?? "SouthColours_SuperSecure_SecretKey_2026_KidsFashionApp!";
        var issuer = _configuration["JwtSettings:Issuer"] ?? "SouthColoursAPI";
        var audience = _configuration["JwtSettings:Audience"] ?? "SouthColoursFrontend";

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var roles = await _userManager.GetRolesAsync(user);
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(120),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

