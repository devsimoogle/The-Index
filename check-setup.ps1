# LIS Journal - Startup Script
# This script checks prerequisites and starts both backend and frontend servers

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LIS Journal - Startup Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$hasErrors = $false

# Check 1: Node.js installed
Write-Host "[1/5] Checking Node.js..." -NoNewline
try {
    $nodeVersion = node --version
    Write-Host " ✓ Found $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host " ✗ Node.js not found!" -ForegroundColor Red
    $hasErrors = $true
}

# Check 2: PostgreSQL running
Write-Host "[2/5] Checking PostgreSQL..." -NoNewline
try {
    $pgProcess = Get-Process -Name postgres -ErrorAction SilentlyContinue
    if ($pgProcess) {
        Write-Host " ✓ PostgreSQL is running" -ForegroundColor Green
    } else {
        Write-Host " ✗ PostgreSQL not running!" -ForegroundColor Yellow
        Write-Host "      Please start PostgreSQL service" -ForegroundColor Yellow
        $hasErrors = $true
    }
} catch {
    Write-Host " ✗ Cannot check PostgreSQL status" -ForegroundColor Yellow
}

# Check 3: Server .env file
Write-Host "[3/5] Checking server/.env..." -NoNewline
$serverEnvPath = Join-Path $PSScriptRoot "server\.env"
if (Test-Path $serverEnvPath) {
    $envContent = Get-Content $serverEnvPath -Raw
    
    $hasDbUrl = $envContent -match "DATABASE_URL="
    $hasApiKey = $envContent -match "GEMINI_API_KEY="
    
    if ($hasDbUrl -and $hasApiKey) {
        Write-Host " ✓ Configuration found" -ForegroundColor Green
    } else {
        Write-Host " ⚠ Missing required variables!" -ForegroundColor Yellow
        if (-not $hasDbUrl) {
            Write-Host "      Missing: DATABASE_URL" -ForegroundColor Yellow
        }
        if (-not $hasApiKey) {
            Write-Host "      Missing: GEMINI_API_KEY" -ForegroundColor Yellow
        }
        $hasErrors = $true
    }
} else {
    Write-Host " ✗ File not found!" -ForegroundColor Red
    Write-Host "      Copy server\.env.example to server\.env and configure it" -ForegroundColor Yellow
    $hasErrors = $true
}

# Check 4: Dependencies installed
Write-Host "[4/5] Checking dependencies..." -NoNewline
$serverNodeModules = Join-Path $PSScriptRoot "server\node_modules"
$frontendNodeModules = Join-Path $PSScriptRoot "node_modules"

if ((Test-Path $serverNodeModules) -and (Test-Path $frontendNodeModules)) {
    Write-Host " ✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host " ⚠ Some dependencies missing" -ForegroundColor Yellow
    if (-not (Test-Path $serverNodeModules)) {
        Write-Host "      Run: cd server && npm install" -ForegroundColor Yellow
    }
    if (-not (Test-Path $frontendNodeModules)) {
        Write-Host "      Run: npm install" -ForegroundColor Yellow
    }
    $hasErrors = $true
}

# Check 5: Port availability
Write-Host "[5/5] Checking port 3001..." -NoNewline
$portInUse = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host " ⚠ Port already in use" -ForegroundColor Yellow
    Write-Host "      Server might already be running" -ForegroundColor Yellow
} else {
    Write-Host " ✓ Port available" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($hasErrors) {
    Write-Host ""
    Write-Host "⚠ Please fix the errors above before starting the servers" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Quick Setup Guide:" -ForegroundColor Cyan
    Write-Host "1. Copy server\.env.example to server\.env" -ForegroundColor White
    Write-Host "2. Edit server\.env and add your DATABASE_URL and GEMINI_API_KEY" -ForegroundColor White
    Write-Host "3. Install dependencies: npm install && cd server && npm install" -ForegroundColor White
    Write-Host "4. Start PostgreSQL service" -ForegroundColor White
    Write-Host "5. Run this script again" -ForegroundColor White
    Write-Host ""
    exit 1
} else {
    Write-Host ""
    Write-Host "✓ All checks passed! Ready to start servers" -ForegroundColor Green
    Write-Host ""
    
    $response = Read-Host "Start servers now? (Y/n)"
    if ($response -eq "" -or $response -eq "Y" -or $response -eq "y") {
        Write-Host ""
        Write-Host "Starting backend server..." -ForegroundColor Cyan
        Write-Host "Open a new terminal and run: cd server && npm run dev" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Starting frontend server..." -ForegroundColor Cyan
        Write-Host "Open another terminal and run: npm run dev" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Or use the start-dev.ps1 script to start both automatically" -ForegroundColor Green
    }
}
