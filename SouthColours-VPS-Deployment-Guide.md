# SouthColours — Complete Contabo Ubuntu VPS Deployment Implementation Guide

> **Author**: SouthColours Engineering Team  
> **Target OS**: Ubuntu 22.04 LTS / Ubuntu 24.04 LTS (Contabo Cloud VPS)  
> **Stack**: Angular 19 (Frontend), .NET 10 Web API (Backend), Microsoft SQL Server 2022 (Database), Nginx (Reverse Proxy & Web Server), Jenkins (CI/CD Pipeline), Let's Encrypt (SSL/TLS)  
> **Repository**: [https://github.com/jadeteja/South_Colours_Dev.git](https://github.com/jadeteja/South_Colours_Dev.git)

---

## Table of Contents
1. [Project Overview & Key Decisions](#1-project-overview--key-decisions)
2. [VPS Selection, Hardware Sizing & Cost Analysis](#2-vps-selection-hardware-sizing--cost-analysis)
3. [Initial VPS Setup & Server Hardening](#3-initial-vps-setup--server-hardening)
4. [Software Installation Checklist](#4-software-installation-checklist)
5. [End-to-End Application Architecture](#5-end-to-end-application-architecture)
6. [Domain Name, DNS & Port Mapping](#6-domain-name-dns--port-mapping)
7. [Database Deployment (SQL Server on Linux)](#7-database-deployment-sql-server-on-linux)
8. [Backend Deployment (.NET 10 API)](#8-backend-deployment-net-10-api)
9. [Angular 19 Frontend Deployment](#9-angular-19-frontend-deployment)
10. [Nginx Reverse Proxy & Let's Encrypt SSL](#10-nginx-reverse-proxy--lets-encrypt-ssl)
11. [Jenkins Automated CI/CD Pipeline](#11-jenkins-automated-cicd-pipeline)
12. [Production Security Hardening](#12-production-security-hardening)
13. [Automated Backups & Disaster Recovery](#13-automated-backups--disaster-recovery)
14. [Server Monitoring, Logging & Maintenance](#14-server-monitoring-logging--maintenance)
15. [Troubleshooting Guide](#15-troubleshooting-guide)
16. [Production Go-Live Checklist](#16-production-go-live-checklist)
17. [Advanced Operations & Future Scaling](#17-advanced-operations--future-scaling)

---

## 1. Project Overview & Key Decisions

The SouthColours e-commerce platform is structured as a monorepo containing:
- **Backend**: ASP.NET Core 10 Web API (`backend/Southcolours.API`) utilizing Entity Framework Core 10, JWT Authentication, and Razorpay integration.
- **Frontend**: Angular 19 Single Page Application (`frontend/southcolours-angular`) built with standalone components, reactive signals, and Lucide icons.
- **Database**: Microsoft SQL Server 2022 (with full built-in support for PostgreSQL if cloud-hosted).
- **Media Uploads**: Physical file uploads saved outside the code release directory to ensure persistent storage across continuous deployments.

### Native Installation vs. Docker: Which is Better for this VPS?

| Comparison Factor | Native Host Installation (Recommended for this setup) | Docker Containerization |
| :--- | :--- | :--- |
| **RAM Overhead** | **Lowest**. Systemd and Kestrel run bare-metal without container daemon abstraction. | Requires 300MB–800MB extra baseline RAM for Docker daemon, containerd, and overlayfs. |
| **Microsoft SQL Server Compatibility** | Runs natively via `mssql-server` debian package on Ubuntu 20.04/22.04 with fine-grained memory limits (`memorylimitmb`). | Runs as `mcr.microsoft.com/mssql/server:2022-latest`, but requires strict container memory flags (`-m 3500m`). |
| **CI/CD Build Performance** | Jenkins builds directly on the host using pre-installed .NET 10 SDK & Node 20, taking advantage of persistent local cache (`~/.nuget` and `~/.npm`). | Needs Docker-in-Docker (DinD) or multi-stage Docker builds, resulting in longer build times and high disk usage on smaller SSDs. |
| **Simplicity for Beginners** | Direct inspection of services via `systemctl status`, log inspection via `journalctl -u`, and simple file edits in `/etc/nginx`. | Requires Docker CLI knowledge, volume mounting paths, container networks, and debugging container networking. |

> **Verdict for Contabo VPS**: Native installation is chosen for maximum performance, minimal RAM overhead, and straightforward maintenance. However, this guide also provides a safe container alternative for developers who prefer Docker.

---

## 2. VPS Selection, Hardware Sizing & Cost Analysis

### Recommended Hardware Tier for Contabo VPS
Running **Angular + .NET 10 API + Microsoft SQL Server 2022 + Jenkins CI/CD** on a single server requires careful RAM planning:
- **Microsoft SQL Server 2022**: Minimum **2.5 GB RAM** (hard minimum is 2 GB; Microsoft officially recommends 3.25 GB+).
- **Jenkins CI/CD (Java OpenJDK 17/21)**: Minimum **1.0 GB RAM** baseline, peaking at 2.5 GB during `npm run build` and `dotnet publish`.
- **.NET 10 Kestrel Web API**: ~ **200 MB – 500 MB RAM**.
- **Nginx Web Server**: ~ **50 MB RAM**.
- **Ubuntu OS Baseline**: ~ **300 MB RAM**.

**Total RAM Requirement**: **6 GB to 8 GB RAM minimum**.

| Contabo Plan | vCPU | RAM | Storage | Suitability |
| :--- | :--- | :--- | :--- | :--- |
| **Cloud VPS 1** | 4 vCPU | 6 GB RAM | 100 GB NVMe | ⚠️ Minimum (Requires 4 GB Swap memory). Build peak could slow down. |
| **Cloud VPS 2 (Recommended)** | 6 vCPU | 12 GB RAM | 250 GB NVMe | ✅ **Optimal for Production**. Runs all services + Jenkins builds smoothly without memory pressure. |
| **Cloud VPS 3** | 8 vCPU | 24 GB RAM | 500 GB NVMe | 🚀 High traffic scaling (50,000+ daily visitors). |

### Estimated Running Costs

| Component | Provider | Billing Frequency | Estimated Cost |
| :--- | :--- | :--- | :--- |
| **Contabo Cloud VPS 2** (6 vCPU, 12GB RAM) | Contabo | Monthly | ~\$11.50 / month (~₹950/mo) |
| **Custom Domain (`.com` / `.in`)** | Namecheap / GoDaddy / Cloudflare | Annual | ~\$10 – \$14 / year (~₹850 – ₹1,200/yr) |
| **SSL / TLS Certificate** | Let's Encrypt | Indefinite | **\$0.00 (Free forever)** |
| **CI/CD Server (Jenkins)** | Self-hosted on VPS | Monthly | **\$0.00 (Included in VPS)** |
| **Email Gateway (SMTP)** | Brevo / SendGrid (Free tier) | Monthly | **\$0.00 (300 emails/day free)** |
| **Total Annual Estimated Cost** | — | **Annual** | **~\$150 USD (~₹12,500 INR / year)** |

---

## 3. Initial VPS Setup & Server Hardening

Run these commands step-by-step. Unless stated otherwise, execute commands marked `[Ubuntu VPS]` inside your VPS terminal, and commands marked `[Windows CMD/PowerShell]` on your local PC.

### Step 3.1: Connect to VPS from Windows
Open Windows PowerShell or Command Prompt:

```powershell
# [Windows CMD/PowerShell]
# Replace YOUR_VPS_IP with the IPv4 address assigned by Contabo
ssh root@YOUR_VPS_IP
```
*Enter the initial root password provided in your Contabo registration email.*

---

### Step 3.2: Update System Packages
```bash
# [Ubuntu VPS]
# Update repository catalog and upgrade all existing system packages
sudo apt update && sudo apt upgrade -y
```

---

### Step 3.3: Set the System Timezone
Set to Indian Standard Time (IST) or UTC:
```bash
# [Ubuntu VPS]
# For Indian Standard Time (IST):
sudo timedatectl set-timezone Asia/Kolkata

# Verify the updated clock
timedatectl
```

---

### Step 3.4: Create a Dedicated Non-Root Deployer User
Never run production applications or Jenkins directly as `root`. We create a dedicated user named `deployer`:

```bash
# [Ubuntu VPS]
# Create user with a home directory
sudo adduser deployer

# Add deployer to the sudo group for administrative tasks
sudo usermod -aG sudo deployer
```

---

### Step 3.5: Configure SSH Key-Based Authentication
On your **Windows development machine**, generate an Ed25519 SSH key (skip if you already have one):

```powershell
# [Windows CMD/PowerShell]
ssh-keygen -t ed25519 -C "admin@southcolours.com"
# Press Enter to accept the default file path (C:\Users\<YourUser>\.ssh\id_ed25519)
```

Copy your public key to the VPS:
```powershell
# [Windows CMD/PowerShell]
# Read the public key
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```

Now, switch to the `deployer` user on the **Ubuntu VPS** and paste the key:
```bash
# [Ubuntu VPS]
su - deployer
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
```
*Paste your public key into this file, save with `Ctrl + O`, `Enter`, and exit with `Ctrl + X`.*

Secure the permissions:
```bash
# [Ubuntu VPS]
chmod 600 ~/.ssh/authorized_keys
exit
```

Test logging in from Windows without a password:
```powershell
# [Windows CMD/PowerShell]
ssh deployer@YOUR_VPS_IP
```

---

### Step 3.6: Hardening SSH Daemon Configuration
Disable password logins and root SSH access:

```bash
# [Ubuntu VPS]
sudo nano /etc/ssh/sshd_config
```
Verify or update the following directives:
```text
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
X11Forwarding no
MaxAuthTries 4
```
Save and restart the SSH service:
```bash
# [Ubuntu VPS]
sudo systemctl restart ssh
```
> **Warning**: Keep your current SSH terminal window open while opening a second terminal window to verify you can still connect with `ssh deployer@YOUR_VPS_IP`.

---

### Step 3.7: Configure 4 GB Swap Memory
Swap prevents out-of-memory kernel panics when SQL Server and Jenkins compile code concurrently:

```bash
# [Ubuntu VPS]
# Allocate 4GB file
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Optimize swap aggressiveness (10 is ideal for servers with >= 8GB RAM)
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf

# Verify swap
free -h
```

---

### Step 3.8: Configure UFW Firewall
```bash
# [Ubuntu VPS]
# Default policies: deny incoming, allow outgoing
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (Port 22), HTTP (Port 80), and HTTPS (Port 443)
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```
> **Notice**: We do **not** open port 1433 (SQL Server) or port 8080 (Jenkins) to the public internet. They will be bound locally or protected behind Nginx with authentication.

---

### Step 3.9: Configure Fail2Ban (Intrusion Prevention)
Fail2ban scans system logs and automatically bans IP addresses that show malicious signs like brute-force password guessing:

```bash
# [Ubuntu VPS]
sudo apt install fail2ban -y
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

### Step 3.10: Enable Unattended Security Upgrades
```bash
# [Ubuntu VPS]
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

## 4. Software Installation Checklist

| Software Component | Where Installed | Purpose | Official Documentation Link |
| :--- | :--- | :--- | :--- |
| **Git** | Ubuntu VPS & Windows | Version control & source code synchronization | [git-scm.com](https://git-scm.com/) |
| **Nginx** | Ubuntu VPS | Reverse proxy, static frontend server, SSL termination | [nginx.org](https://nginx.org/en/docs/) |
| **.NET 10 SDK & Runtime** | Ubuntu VPS & Windows | Compiles and executes ASP.NET Core 10 Web API | [learn.microsoft.com/dotnet](https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu) |
| **Microsoft SQL Server 2022** | Ubuntu VPS | Relational Database Engine storing e-commerce data | [learn.microsoft.com/sql-linux](https://learn.microsoft.com/en-us/sql/linux/sql-server-linux-setup) |
| **Node.js (v20 or v22 LTS)** | Ubuntu VPS & Windows | JavaScript runtime for compiling Angular 19 | [nodejs.org](https://nodejs.org/) |
| **Angular CLI 19** | Ubuntu VPS & Windows | Builds client single page application bundle | [angular.dev](https://angular.dev/tools/cli) |
| **OpenJDK 17 / 21** | Ubuntu VPS | Java runtime required to execute the Jenkins engine | [openjdk.org](https://openjdk.org/) |
| **Jenkins LTS** | Ubuntu VPS | Continuous Integration & Automated Deployment server | [jenkins.io](https://www.jenkins.io/doc/) |
| **Certbot (Let's Encrypt)** | Ubuntu VPS | Automated SSL/TLS certificate issuing and 90-day renewal | [certbot.eff.org](https://certbot.eff.org/) |

---

### Step-by-Step Software Installation Commands

#### 1. Install Essential Linux Utilities & Git
```bash
# [Ubuntu VPS]
sudo apt install -y curl wget gnupg2 ca-certificates lsb-release ubuntu-keyring git unzip htop jq net-tools
git --version
```

#### 2. Install Microsoft .NET 10 SDK & ASP.NET Core Runtime
The SouthColours API specifies `<TargetFramework>net10.0</TargetFramework>`:

```bash
# [Ubuntu VPS]
# Register Microsoft package repository
wget https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# Update package index and install .NET 10 SDK
sudo apt update
sudo apt install -y dotnet-sdk-10.0 aspnetcore-runtime-10.0

# Verification
dotnet --info
```

#### 3. Install Node.js 20.x LTS & Angular CLI 19
```bash
# [Ubuntu VPS]
# Use official NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify versions
node -v   # Should be v20.x
npm -v    # Should be v10.x

# Install Angular CLI globally
sudo npm install -g @angular/cli@19
ng version
```

#### 4. Install OpenJDK 21 & Jenkins LTS
```bash
# [Ubuntu VPS]
# Install OpenJDK 21
sudo apt install -y openjdk-21-jdk
java -version

# Add official Jenkins repository key and source
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /etc/apt/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins
sudo apt update
sudo apt install -y jenkins

# Enable and start Jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins

# Verify Jenkins status
sudo systemctl status jenkins --no-pager
```

#### 5. Install Nginx and Certbot
```bash
# [Ubuntu VPS]
sudo apt install -y nginx certbot python3-certbot-nginx
sudo systemctl enable nginx
sudo systemctl start nginx
nginx -v
```

---

## 5. End-to-End Application Architecture

The diagram below details the communication and security flow from customer browsers to database storage:

```mermaid
flowchart TD
    subgraph Public Internet
        Client["Customer Browser & Admin UI"]
        GitHub["GitHub Repository (main branch)"]
    end

    subgraph Contabo Ubuntu VPS (Firewalled)
        DNS["DNS: southcolours.com -> VPS IP"]
        
        subgraph Edge & Security
            UFW["UFW Firewall (Allows 22, 80, 443)"]
            Nginx["Nginx Reverse Proxy & Static Server (Port 80/443 + SSL)"]
        end

        subgraph Applications
            AngularDist["Angular 19 Dist Files (/var/www/southcolours-frontend)"]
            DotNetAPI["ASP.NET Core 10 Web API (Kestrel listening on 127.0.0.1:5000)"]
            UploadsFolder["Persistent Media Storage (/var/southcolours/uploads)"]
        end

        subgraph Database Engine
            MSSQL["Microsoft SQL Server 2022 (Port 1433 - Localhost only)"]
        end

        subgraph CI / CD Automation
            Jenkins["Jenkins CI/CD (Listening on 127.0.0.1:8080 via VPN/Subdomain)"]
        end
    end

    Client -->|HTTPS :443| DNS
    DNS --> UFW
    UFW --> Nginx

    Nginx -->|Serves Static UI| AngularDist
    Nginx -->|Reverse Proxy /api/*| DotNetAPI
    Nginx -->|Serves Uploaded Media /uploads/*| UploadsFolder

    DotNetAPI -->|Reads / Writes Media| UploadsFolder
    DotNetAPI -->|TCP Encrypted Query| MSSQL

    GitHub -->|Webhook on Git Push| Jenkins
    Jenkins -->|Builds Angular & Copies to| AngularDist
    Jenkins -->|Publishes .NET API & Restarts| DotNetAPI
```

---

## 6. Domain Name, DNS & Port Mapping

### Step 6.1: Configure DNS Records at Domain Registrar
In your DNS provider dashboard (Cloudflare, GoDaddy, Namecheap), add these records pointing to your Contabo VPS Public IPv4 address:

| Type | Host / Name | Value / Target | TTL | Description |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `YOUR_VPS_IP` | Automatic / 300s | Maps root domain (`southcolours.com`) to VPS |
| **A** | `www` | `YOUR_VPS_IP` | Automatic / 300s | Maps `www.southcolours.com` to VPS |
| **A** | `api` | `YOUR_VPS_IP` | Automatic / 300s | (Optional) Maps dedicated API endpoint |
| **A** | `ci` | `YOUR_VPS_IP` | Automatic / 300s | (Optional) Subdomain for Jenkins access |

### Step 6.2: Verify DNS Propagation
Run this from Windows PowerShell:
```powershell
# [Windows CMD/PowerShell]
Resolve-DnsName southcolours.com
ping southcolours.com
```

### Complete Port Mapping Reference

| Port | Protocol | Bound Interface | Exposed to Internet? | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **22** | TCP | `0.0.0.0` | **Yes** (Firewalled) | Secure Shell (SSH) access |
| **80** | TCP | `0.0.0.0` | **Yes** | HTTP (Redirects to HTTPS via Nginx) |
| **443** | TCP | `0.0.0.0` | **Yes** | HTTPS SSL (Nginx main entry point) |
| **5000** | TCP | `127.0.0.1` | **NO (Localhost Only)** | Kestrel ASP.NET Core API internal port |
| **1433** | TCP | `127.0.0.1` | **NO (Localhost Only)** | Microsoft SQL Server internal connection |
| **8080** | TCP | `127.0.0.1` | **NO (Localhost Only)** | Jenkins internal web dashboard |

---

## 7. Database Deployment (SQL Server on Linux)

### SQL Server Sizing on Ubuntu
Microsoft officially supports SQL Server 2022 on Ubuntu 20.04 and 22.04. It requires at least **2 GB of RAM** to start. On a VPS with 6GB–12GB RAM, we cap SQL Server to use a maximum of **3500 MB RAM** so it never starves .NET or Jenkins.

### Step 7.1: Install Microsoft SQL Server 2022 on Ubuntu
```bash
# [Ubuntu VPS]
# Import public repository GPG keys
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg

# Register the SQL Server Ubuntu repository
curl -fsSL https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list | sudo tee /etc/apt/sources.list.d/mssql-server-2022.list

# Install SQL Server package
sudo apt update
sudo apt install -y mssql-server

# Run initial configuration
sudo /opt/mssql/bin/mssql-conf setup
```
During configuration:
1. Choose edition: **2) Developer (free)** or **3) Express (free)**. (Choose **Express** for standard production or **Developer** if you need full enterprise testing).
2. Accept the EULA license terms: **Yes**.
3. Set the SQL Server **SA (System Administrator) password**. Choose a strong password containing capital letters, numbers, and symbols (e.g., `SouthColours@Db2026!Prod`).

Verify the service is running:
```bash
# [Ubuntu VPS]
systemctl status mssql-server --no-pager
```

---

### Step 7.2: Install SQL Server Command-Line Tools (`sqlcmd`)
```bash
# [Ubuntu VPS]
curl -fsSL https://packages.microsoft.com/config/ubuntu/22.04/prod.list | sudo tee /etc/apt/sources.list.d/msprod.list
sudo apt update
sudo ACCEPT_EULA=Y apt install -y mssql-tools18 unixodbc-dev

# Add sqlcmd to PATH for all users
echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' >> ~/.bashrc
source ~/.bashrc
```

---

### Step 7.3: Set Memory Limit for SQL Server
Cap SQL Server RAM so it cannot consume all server resources:
```bash
# [Ubuntu VPS]
# Cap memory usage at 3500 MB
sudo /opt/mssql/bin/mssql-conf set memory.memorylimitmb 3500
sudo systemctl restart mssql-server
```

---

### Step 7.4: Create SouthColours Production Database and Dedicated App User
Never connect your web API using the `SA` superuser account. Create a dedicated application user:

```bash
# [Ubuntu VPS]
# Connect using sqlcmd (-C trusts the local self-signed server certificate)
sqlcmd -S localhost -U sa -P 'YourStrongSaPassword!' -C
```

Execute these T-SQL statements:
```sql
-- 1. Create the database
CREATE DATABASE SouthColoursDb;
GO

-- 2. Create the dedicated web application login
CREATE LOGIN SouthColoursAppUser WITH PASSWORD = 'AppUserSecret2026#Secure!';
GO

-- 3. Map user to SouthColoursDb with db_owner role
USE SouthColoursDb;
GO
CREATE USER SouthColoursAppUser FOR LOGIN SouthColoursAppUser;
GO
ALTER ROLE db_owner ADD MEMBER SouthColoursAppUser;
GO

-- 4. Verify database creation
SELECT name, state_desc FROM sys.databases WHERE name = 'SouthColoursDb';
GO
QUIT
```

---

### Alternative: What if your VPS has only 2GB or 4GB RAM?
If you select a smaller VPS, SQL Server 2022 will be too heavy. You can easily switch to **PostgreSQL 16** (which uses only 80MB RAM). Your application code already contains full native PostgreSQL support in `Program.cs` and `Southcolours.Persistence.csproj` (`Npgsql.EntityFrameworkCore.PostgreSQL`). To switch, install PostgreSQL:
```bash
sudo apt install -y postgresql postgresql-contrib
```
And provide a `Host=localhost;Database=SouthColoursDb;Username=...;Password=...` connection string.

---

## 8. Backend Deployment (.NET 10 API)

### Step 8.1: Directory Structure Creation
Create the dedicated deployment and upload directories:

```bash
# [Ubuntu VPS]
# Code directory (owned by deployer)
sudo mkdir -p /var/www/southcolours-backend
sudo chown -R deployer:deployer /var/www/southcolours-backend

# Persistent Media Uploads directory (kept completely separate from code)
sudo mkdir -p /var/southcolours/uploads
sudo chown -R deployer:deployer /var/southcolours/uploads
sudo chmod 755 /var/southcolours/uploads
```

---

### Step 8.2: Production Configuration (`appsettings.Production.json`)
Create the production configuration on the server:

```bash
# [Ubuntu VPS]
sudo nano /var/www/southcolours-backend/appsettings.Production.json
```
Paste this configuration:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SouthColoursDb;User Id=SouthColoursAppUser;Password=AppUserSecret2026#Secure!;TrustServerCertificate=True;MultipleActiveResultSets=true;Connect Timeout=60;"
  },
  "JwtSettings": {
    "Secret": "SouthColours_SuperSecure_Production_SecretKey_2026_LiveLongKidsWearPlatform!",
    "Issuer": "SouthColoursAPI",
    "Audience": "SouthColoursFrontend",
    "ExpiryMinutes": 720
  },
  "Razorpay": {
    "KeyId": "rzp_live_YOUR_ACTUAL_RAZORPAY_KEY",
    "KeySecret": "YOUR_ACTUAL_RAZORPAY_SECRET",
    "WebhookSecret": "YOUR_WEBHOOK_SECRET"
  },
  "GoogleAuth": {
    "ClientId": "YOUR_PRODUCTION_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
  },
  "Uploads": {
    "StoragePath": "/var/southcolours/uploads"
  }
}
```
Secure file permissions:
```bash
# [Ubuntu VPS]
chmod 600 /var/www/southcolours-backend/appsettings.Production.json
```

---

### Step 8.3: Configure ASP.NET Core as a Systemd Service
Create the service configuration file:

```bash
# [Ubuntu VPS]
sudo nano /etc/systemd/system/southcolours-api.service
```
Paste the following complete service definition:
```ini
[Unit]
Description=SouthColours ASP.NET Core 10 Web API
After=network.target mssql-server.service

[Service]
WorkingDirectory=/var/www/southcolours-backend
ExecStart=/usr/bin/dotnet /var/www/southcolours-backend/Southcolours.API.dll
Restart=always
# Restart delay if service crashes
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=southcolours-api
User=deployer
Group=deployer
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false
Environment=DOTNET_CLI_TELEMETRY_OPTOUT=1
Environment=PORT=5000
Environment=UPLOADS_PATH=/var/southcolours/uploads

# Security sandbox directives
ProtectSystem=full
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

Reload systemd daemon:
```bash
# [Ubuntu VPS]
sudo systemctl daemon-reload
```

---

### Step 8.4: Manual Backend Publishing Test (From Local or Server)
To verify everything compiles and runs manually before configuring Jenkins:

On the **Ubuntu VPS**:
```bash
# [Ubuntu VPS]
cd ~
git clone https://github.com/jadeteja/South_Colours_Dev.git test-build
cd test-build/backend
dotnet publish Southcolours.API/Southcolours.API.csproj -c Release -o /var/www/southcolours-backend

# Start service
sudo systemctl restart southcolours-api
sudo systemctl status southcolours-api --no-pager
```

Test API health endpoint:
```bash
# [Ubuntu VPS]
curl http://localhost:5000/api/health
# Expected Output: {"status":"healthy","service":"Southcolours API","version":"1.0"}
```

---

## 9. Angular 19 Frontend Deployment

### Step 9.1: Create Frontend Web Directory
```bash
# [Ubuntu VPS]
sudo mkdir -p /var/www/southcolours-frontend
sudo chown -R deployer:deployer /var/www/southcolours-frontend
```

---

### Step 9.2: Production Environment Configuration in Angular
The Angular production environment file is located at `frontend/southcolours-angular/src/environments/environment.prod.ts`.

It should point to the domain root (since Nginx proxies `/api` requests directly to backend):
```typescript
export const environment = {
  production: true,
  apiUrl: '' // Empty string allows relative calls: /api/products, /api/auth
};
```
*Note: Using a relative URL `''` ensures there are zero CORS issues and no hardcoded IPs.*

---

### Step 9.3: Build Angular Application for Production
Run the production build:
```bash
# [Ubuntu VPS]
cd ~/test-build/frontend/southcolours-angular
npm ci
npm run build -- --configuration production

# Copy build artifacts to web root
cp -r dist/southcolours-angular/browser/* /var/www/southcolours-frontend/
```

Verify `index.html` exists in `/var/www/southcolours-frontend/`:
```bash
# [Ubuntu VPS]
ls -la /var/www/southcolours-frontend/index.html
```

---

## 10. Nginx Reverse Proxy & Let's Encrypt SSL

### Step 10.1: Configure Nginx Virtual Host
Remove the default site configuration and create a new server block:

```bash
# [Ubuntu VPS]
sudo rm -f /etc/nginx/sites-enabled/default
sudo nano /etc/nginx/sites-available/southcolours.conf
```

Paste the following production configuration:
```nginx
# Upstream for ASP.NET Core API
upstream southcolours_api {
    server 127.0.0.1:5000;
    keepalive 32;
}

# Upstream for Jenkins CI/CD Dashboard
upstream jenkins_service {
    server 127.0.0.1:8080;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name southcolours.com www.southcolours.com;

    # Maximum file upload size (Allows 25MB product image uploads)
    client_max_body_size 25M;

    # Gzip compression for high-speed UI delivery
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # 1. Physical Media Uploads Folder (Persistent files)
    location /uploads/ {
        alias /var/southcolours/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
        try_files $uri =404;
    }

    # 2. ASP.NET Core Backend API Reverse Proxy
    location /api/ {
        proxy_pass http://southcolours_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 3. Angular 19 SPA Frontend (Handles HTML5 Client-Side Routing)
    location / {
        root /var/www/southcolours-frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache static browser bundles
        location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg)$ {
            expires 6M;
            access_log off;
            add_header Cache-Control "public, max-age=15552000, immutable";
        }
    }
}
```

Enable the configuration:
```bash
# [Ubuntu VPS]
sudo ln -s /etc/nginx/sites-available/southcolours.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Step 10.2: Obtain Free SSL Certificate with Let's Encrypt (Certbot)
Run Certbot to automatically configure HTTPS and redirect HTTP to HTTPS:

```bash
# [Ubuntu VPS]
sudo certbot --nginx -d southcolours.com -d www.southcolours.com
```
*Enter your administrative email address and agree to the Terms of Service. Certbot will automatically rewrite the Nginx configuration with TLS 1.3, SSL certificates, and 301 redirects.*

Verify auto-renewal:
```bash
# [Ubuntu VPS]
sudo certbot renew --dry-run
```

---

## 11. Jenkins Automated CI/CD Pipeline

### Step 11.1: Secure Jenkins Dashboard via Nginx Reverse Proxy
To access Jenkins over HTTPS without opening port 8080 to the public, create a virtual host for `ci.southcolours.com` (or access via SSH tunnel):

```bash
# [Ubuntu VPS]
sudo nano /etc/nginx/sites-available/jenkins.conf
```
```nginx
server {
    listen 80;
    server_name ci.southcolours.com;

    location / {
        proxy_pass http://jenkins_service;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_max_temp_file_size 0;
        client_max_body_size 10m;
    }
}
```
Enable and secure with SSL:
```bash
# [Ubuntu VPS]
sudo ln -s /etc/nginx/sites-available/jenkins.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d ci.southcolours.com
```

---

### Step 11.2: Jenkins Initial Unlock
Retrieve the initial admin password:
```bash
# [Ubuntu VPS]
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```
1. Open `https://ci.southcolours.com` (or `http://YOUR_VPS_IP:8080` if using SSH tunnel `ssh -L 8080:localhost:8080 deployer@YOUR_VPS_IP`).
2. Paste the administrator password.
3. Select **Install Suggested Plugins**.
4. Create your primary Admin account (username, password, email).

---

### Step 11.3: Grant Jenkins Sudo Permissions for Deployment
Jenkins must be able to restart `southcolours-api` and reload `nginx` without prompting for a password:

```bash
# [Ubuntu VPS]
sudo visudo /etc/sudoers.d/jenkins
```
Add the following lines:
```text
jenkins ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart southcolours-api
jenkins ALL=(ALL) NOPASSWD: /usr/bin/systemctl status southcolours-api
jenkins ALL=(ALL) NOPASSWD: /usr/bin/systemctl reload nginx
```
Give Jenkins ownership permissions for web directories:
```bash
# [Ubuntu VPS]
sudo usermod -aG deployer jenkins
sudo chmod -R 775 /var/www/southcolours-frontend
sudo chmod -R 775 /var/www/southcolours-backend
```

---

### Step 11.4: The Production `Jenkinsfile`
Place this `Jenkinsfile` in the root of your GitHub repository:

```groovy
pipeline {
    agent any

    environment {
        DOTNET_CLI_TELEMETRY_OPTOUT = '1'
        BACKEND_DIR = '/var/www/southcolours-backend'
        FRONTEND_DIR = '/var/www/southcolours-frontend'
    }

    stages {
        stage('Checkout Source') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Build & Test Backend') {
            steps {
                echo 'Compiling ASP.NET Core 10 Web API...'
                dir('backend') {
                    sh 'dotnet restore Southcolours.API/Southcolours.API.csproj'
                    sh 'dotnet build Southcolours.API/Southcolours.API.csproj -c Release --no-restore'
                }
            }
        }

        stage('Publish Backend') {
            steps {
                echo 'Publishing backend binaries...'
                dir('backend') {
                    sh "dotnet publish Southcolours.API/Southcolours.API.csproj -c Release -o ${BACKEND_DIR} --no-build"
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Installing Node dependencies and building Angular 19...'
                dir('frontend/southcolours-angular') {
                    sh 'npm ci'
                    sh 'npm run build -- --configuration production'
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                echo 'Deploying static files to Nginx web root...'
                dir('frontend/southcolours-angular') {
                    sh "cp -r dist/southcolours-angular/browser/* ${FRONTEND_DIR}/"
                }
            }
        }

        stage('Restart Backend Service & Health Check') {
            steps {
                echo 'Restarting systemd service and verifying health...'
                sh 'sudo systemctl restart southcolours-api'
                sleep 5
                sh 'curl -f http://127.0.0.1:5000/api/health || exit 1'
            }
        }
    }

    post {
        success {
            echo '============================================'
            echo ' SouthColours CI/CD Pipeline Completed Successfully!'
            echo '============================================'
        }
        failure {
            echo 'ERROR: Pipeline failed. Check build console logs.'
        }
    }
}
```

---

### Step 11.5: Configure GitHub Webhook for Automatic Deployment
1. Go to your GitHub repository: **Settings > Webhooks > Add webhook**.
2. **Payload URL**: `https://ci.southcolours.com/github-webhook/`
3. **Content type**: `application/json`
4. **Which events?**: Select **Just the push event**.
5. Save Webhook.

*Every time you push to the `main` branch, GitHub notifies Jenkins, which tests, builds, and deploys both backend and frontend within 60 to 90 seconds!*

---

## 12. Production Security Hardening

### Summary of Security Enforcements

1. **Database Access Restriction**:
   SQL Server listens on port 1433, but UFW blocks external connections. Only localhost applications can query it.
2. **Zero Plaintext Secrets in Git**:
   Production connection strings and Razorpay keys live strictly in `/var/www/southcolours-backend/appsettings.Production.json` (permission `600`), which is excluded from Git via `.gitignore`.
3. **Safe File Uploads**:
   - File extensions are validated (`.jpg`, `.png`, `.webp`, `.svg`).
   - File names are hashed with UUIDs to prevent directory traversal attacks (`../../evil.sh`).
   - Upload directory is mapped statically without script execution permissions.
4. **HTTPS Everywhere**:
   Let's Encrypt enforces SSL certificates with TLS 1.2 and TLS 1.3 only, complete with HSTS (HTTP Strict Transport Security) headers.

---

## 13. Automated Backups & Disaster Recovery

### Step 13.1: Automated Database Backup Script
Create an automated script that backs up SQL Server daily, compresses the archive, and removes backups older than 14 days:

```bash
# [Ubuntu VPS]
sudo mkdir -p /var/backups/southcolours
sudo nano /usr/local/bin/backup-southcolours.sh
```

Paste this backup script:
```bash
#!/bin/bash
set -e

BACKUP_DIR="/var/backups/southcolours"
DATE=$(date +'%Y%m%d_%H%M%S')
SQL_BACKUP_FILE="${BACKUP_DIR}/SouthColoursDb_${DATE}.bak"
ARCHIVE_FILE="${BACKUP_DIR}/southcolours_backup_${DATE}.tar.gz"

echo "[$(date)] Starting SouthColours Automated Backup..."

# 1. Take native SQL Server backup
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrongSaPassword!' -C -Q \
"BACKUP DATABASE [SouthColoursDb] TO DISK = N'${SQL_BACKUP_FILE}' WITH NOFORMAT, NOINIT, SKIP, NOREWIND, NOUNLOAD, STATS = 10"

# 2. Archive database backup, uploaded media, and Nginx configurations
tar -czf "${ARCHIVE_FILE}" \
    -C "${BACKUP_DIR}" "SouthColoursDb_${DATE}.bak" \
    -C /var/southcolours "uploads" \
    -C /etc/nginx/sites-available "southcolours.conf"

# 3. Remove raw SQL .bak file after archiving
rm -f "${SQL_BACKUP_FILE}"

# 4. Remove backups older than 14 days
find "${BACKUP_DIR}" -type f -name "southcolours_backup_*.tar.gz" -mtime +14 -exec rm {} \;

echo "[$(date)] Backup completed successfully: ${ARCHIVE_FILE}"
```

Make the script executable:
```bash
# [Ubuntu VPS]
sudo chmod +x /usr/local/bin/backup-southcolours.sh
```

---

### Step 13.2: Schedule Nightly Cron Job
```bash
# [Ubuntu VPS]
sudo crontab -e
```
Add this entry to run every night at 2:30 AM:
```text
30 2 * * * /usr/local/bin/backup-southcolours.sh >> /var/log/southcolours-backup.log 2>&1
```

---

## 14. Server Monitoring, Logging & Maintenance

### Real-Time Monitoring Commands
- **CPU & RAM**: `htop`
- **Disk Usage**: `df -h`
- **Memory Free / Swap Usage**: `free -m`
- **Backend Service Logs**: `journalctl -u southcolours-api -f`
- **Nginx Access & Error Logs**: `tail -f /var/log/nginx/access.log /var/log/nginx/error.log`
- **SQL Server Error Logs**: `sudo tail -f /var/opt/mssql/log/errorlog`

---

## 15. Troubleshooting Guide

| Issue / Error | Root Cause | Exact Fix Command |
| :--- | :--- | :--- |
| **502 Bad Gateway** | ASP.NET Core service is stopped or crashed. | Check service: `sudo systemctl status southcolours-api`<br>View logs: `sudo journalctl -u southcolours-api -n 50 --no-pager` |
| **Cannot connect to SQL Server (`0x80070003` / Login Failed)** | Password incorrect or SA user disabled. | Test connection via `sqlcmd -S localhost -U sa -P 'Pass' -C`. Check memory: `free -m`. |
| **Angular 404 on Browser Page Refresh** | Nginx is trying to find route as directory instead of falling back to `index.html`. | Verify `try_files $uri $uri/ /index.html;` exists in `/etc/nginx/sites-available/southcolours.conf`. |
| **Out of Memory (OOM Killer terminates process)** | SQL Server + Jenkins consumed all physical RAM. | Ensure 4GB swap is active (`swapon --show`). Cap SQL memory via `mssql-conf set memory.memorylimitmb 3500`. |
| **Permission Denied uploading images** | `/var/southcolours/uploads` owned by root. | Fix ownership: `sudo chown -R deployer:deployer /var/southcolours/uploads && sudo chmod 755 /var/southcolours/uploads`. |
| **Certbot Renewal Failure** | Port 80 blocked by firewall or Nginx configuration error. | Run `sudo ufw allow 80/tcp` and test with `sudo certbot renew --dry-run`. |

---

## 16. Production Go-Live Checklist

- [ ] Contabo VPS provisioned with Ubuntu 22.04 LTS (minimum 6GB RAM).
- [ ] Non-root `deployer` user created and SSH key authentication enforced.
- [ ] SSH password login disabled and Port 22 secured.
- [ ] 4 GB swap file created and active (`free -h`).
- [ ] UFW firewall enabled (only ports 22, 80, 443 open).
- [ ] Fail2ban installed and running.
- [ ] .NET 10 SDK and ASP.NET Core Runtime installed (`dotnet --info`).
- [ ] Microsoft SQL Server 2022 installed, memory capped at 3500MB.
- [ ] `SouthColoursDb` created with dedicated application login (`SouthColoursAppUser`).
- [ ] Code repository cloned and backend published to `/var/www/southcolours-backend`.
- [ ] `appsettings.Production.json` configured with production database password & Razorpay keys.
- [ ] Persistent uploads directory created at `/var/southcolours/uploads`.
- [ ] Systemd service `southcolours-api` enabled and running on port 5000.
- [ ] Angular 19 frontend built and copied to `/var/www/southcolours-frontend`.
- [ ] Nginx configured with reverse proxy for `/api/`, alias for `/uploads/`, and SPA fallback.
- [ ] Domain DNS A records pointing to VPS IP.
- [ ] Let's Encrypt SSL certificate installed via Certbot.
- [ ] Jenkins installed and pipeline configured with GitHub webhook.
- [ ] Automated daily backup script tested and scheduled in crontab.
- [ ] Live end-to-end user checkout tested in production.

---

## 17. Advanced Operations & Future Scaling

### How to Add Another Application to the Same VPS
To host a second website (e.g. `blog.southcolours.com` or another client application) on this same server:
1. Assign the new domain's DNS A record to your Contabo VPS IP.
2. Publish the new backend to a separate port (e.g., Kestrel on `127.0.0.1:5001`).
3. Create a second Nginx configuration in `/etc/nginx/sites-available/newapp.conf`.
4. Run `certbot --nginx -d newapp.com` to provision a dedicated SSL certificate. Nginx will automatically route traffic by domain name using SNI (Server Name Indication).

### What Happens When the VPS Crashes or Restarts?
Because all services are configured as **systemd services** with `WantedBy=multi-user.target`:
- `mssql-server` starts automatically.
- `southcolours-api` starts automatically once the network is ready.
- `nginx` starts automatically.
- `jenkins` starts automatically.
- Swap memory automatically mounts via `/etc/fstab`.

The entire SouthColours application recovers cleanly with zero human intervention within 45 seconds of a server reboot!
