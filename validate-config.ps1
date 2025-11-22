$separator = "=" * 60

Write-Host $separator -ForegroundColor Cyan
Write-Host "  LIS Journal - Configuration Validator" -ForegroundColor Cyan
Write-Host $separator -ForegroundColor Cyan
Write-Host ""

# Check server .env
Write-Host "[1] Checking server/.env configuration..." -ForegroundColor Yellow
Write-Host ""

$serverEnvPath = "server\.env"

if (Test-Path $serverEnvPath) {
    Write-Host "    ✓ File exists" -ForegroundColor Green
    
    $envContent = Get-Content $serverEnvPath -Raw
    
    # Check for required variables
    $hasDbUrl = $envContent.Contains("DATABASE_URL=") -and $envContent.Contains("postgresql")
    $hasApiKey = $envContent.Contains("GEMINI_API_KEY=") -and -not $envContent.Contains("your_gemini_api_key_here")
    $hasPort = $envContent.Contains("PORT=")
    
    Write-Host ""
    Write-Host "    Configuration Status:" -ForegroundColor White
    
    if ($hasDbUrl) {
        Write-Host "    ✓ DATABASE_URL: Configured" -ForegroundColor Green
    } else {
        Write-Host "    ✗ DATABASE_URL: Missing or invalid" -ForegroundColor Red
        Write-Host "      Format: postgresql://username:password@localhost:5432/lis_journal" -ForegroundColor Gray
    }
    
    if ($hasApiKey) {
        Write-Host "    ✓ GEMINI_API_KEY: Configured" -ForegroundColor Green
    } else {
        Write-Host "    ✗ GEMINI_API_KEY: Missing or invalid" -ForegroundColor Red
        Write-Host "      Get your key from: https://aistudio.google.com/app/apikey" -ForegroundColor Gray
    }
    
    if ($hasPort) {
        Write-Host "    ✓ PORT: Configured" -ForegroundColor Green
    } else {
        Write-Host "    ⚠ PORT: Using default (3001)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    
    if (-not $hasDbUrl -or -not $hasApiKey) {
        Write-Host "    ⚠ ACTION REQUIRED:" -ForegroundColor Yellow
        Write-Host "    Please edit server\.env and configure the missing variables" -ForegroundColor White
        Write-Host ""
    }
    
} else {
    Write-Host "    ✗ File not found!" -ForegroundColor Red
    Write-Host "    Please copy server\.env.example to server\.env" -ForegroundColor Yellow
    Write-Host ""
}

# Check frontend .env
Write-Host "[2] Checking frontend .env configuration..." -ForegroundColor Yellow
Write-Host ""

$frontendEnvPath = ".env"

if (Test-Path $frontendEnvPath) {
    $envContent = Get-Content $frontendEnvPath -Raw
    
    if ($envContent -match "VITE_API_URL=(.+)") {
        $apiUrl = $matches[1].Trim()
        Write-Host "    ✓ API URL: $apiUrl" -ForegroundColor Green
        
        if ($apiUrl.Contains(":3001")) {
            Write-Host "    ✓ Port matches server default (3001)" -ForegroundColor Green
        } else {
            Write-Host "    ⚠ Port mismatch! Server uses 3001 by default" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "    ✗ File not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host $separator -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Fix any issues shown above" -ForegroundColor White
Write-Host "2. Ensure PostgreSQL is running" -ForegroundColor White
Write-Host "3. Start backend:  cd server && npm run dev" -ForegroundColor White
Write-Host "4. Start frontend: npm run dev" -ForegroundColor White
Write-Host "5. Test publishing from admin panel" -ForegroundColor White
Write-Host ""

# Check if PostgreSQL is running
Write-Host "Bonus Check - PostgreSQL Status:" -ForegroundColor Yellow
try {
    $pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue | Where-Object {$_.Status -eq "Running"}
    if ($pgService) {
        Write-Host "✓ PostgreSQL service is running" -ForegroundColor Green
    } else {
        Write-Host "⚠ PostgreSQL service not found or not running" -ForegroundColor Yellow
        Write-Host "  Start it using pgAdmin or: Start-Service postgresql-x64-XX" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠ Could not check PostgreSQL status" -ForegroundColor Yellow
}

Write-Host ""
