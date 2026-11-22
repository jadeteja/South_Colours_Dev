import { test, expect } from '../../fixtures/testFixtures';
import { generateTestUser } from '../../utils/testData';

test.describe('Authentication Suite - Login & Registration', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.openLoginPage();
  });

  test('TC-AUTH-01: Login Form UI and initial states', async ({ loginPage, page }) => {
    await expect(page).toHaveURL(/.*auth\/login/);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitBtn).toBeDisabled();
  });

  test('TC-AUTH-02: Submit button disabled on partial credentials', async ({ loginPage }) => {
    await loginPage.emailInput.fill('user@example.com');
    await expect(loginPage.submitBtn).toBeDisabled();

    await loginPage.emailInput.fill('');
    await loginPage.passwordInput.fill('Secret123#');
    await expect(loginPage.submitBtn).toBeDisabled();
  });

  test('TC-AUTH-03: Quick Demo credentials pre-fill works', async ({ loginPage }) => {
    await loginPage.quickAdminChip.click();
    await expect(loginPage.emailInput).toHaveValue('admin@southcolours.com');
    await expect(loginPage.passwordInput).toHaveValue('Admin@South123#');
    await expect(loginPage.submitBtn).toBeEnabled();
  });

  test('TC-AUTH-04: Invalid credentials displays error alert', async ({ loginPage }) => {
    await loginPage.login('invalid_qa_user@nonexistent.com', 'WrongPassword123#');
    const errMsg = await loginPage.getErrorMessage();
    expect(errMsg).toBeTruthy();
  });

  test('TC-AUTH-05: Navigation from Login to Registration page', async ({ loginPage, page }) => {
    await loginPage.goToRegister();
    await expect(page).toHaveURL(/.*auth\/register/);
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
  });

  test('TC-AUTH-06: Registration form validation on required fields', async ({ registerPage, page }) => {
    await registerPage.openRegisterPage();
    await expect(registerPage.submitBtn).toBeDisabled();
    
    // Fill required fields
    const testUser = generateTestUser();
    await registerPage.fullNameInput.fill(testUser.fullName);
    await registerPage.emailInput.fill(testUser.email);
    await registerPage.passwordInput.fill(testUser.password);
    await expect(registerPage.submitBtn).toBeEnabled();
  });
});
