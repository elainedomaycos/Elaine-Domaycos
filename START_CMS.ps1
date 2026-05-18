# Start local web server for CMS
# Navigate to Portfolio directory and start Python HTTP server

$portfolioPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check if Python is available
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Starting web server with Python..." -ForegroundColor Green
    Write-Host "Python found: $pythonVersion" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "CMS Server Starting..." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Open your browser and go to:" -ForegroundColor Cyan
    Write-Host "http://localhost:8000/cms.html" -ForegroundColor Green
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    Set-Location $portfolioPath
    python -m http.server 8000
} catch {
    Write-Host "Python not found. Trying Node.js..." -ForegroundColor Yellow
    try {
        $nodeVersion = node --version 2>&1
        Write-Host "Node.js found: $nodeVersion" -ForegroundColor Cyan
        
        # Check if http-server is installed globally
        $httpServer = npm list -g http-server 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Starting with http-server..." -ForegroundColor Green
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Yellow
            Write-Host "CMS Server Starting..." -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Open your browser and go to:" -ForegroundColor Cyan
            Write-Host "http://localhost:8080/cms.html" -ForegroundColor Green
            Write-Host ""
            Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
            Write-Host ""
            
            Set-Location $portfolioPath
            npx http-server -p 8080
        } else {
            Write-Host "http-server not found. Installing..." -ForegroundColor Yellow
            npm install -g http-server
            Set-Location $portfolioPath
            npx http-server -p 8080
        }
    } catch {
        Write-Host "Neither Python nor Node.js found!" -ForegroundColor Red
        Write-Host "Please install one of the following:" -ForegroundColor Yellow
        Write-Host "1. Python: https://www.python.org/downloads/" -ForegroundColor Cyan
        Write-Host "2. Node.js: https://nodejs.org/" -ForegroundColor Cyan
        Read-Host "Press Enter to exit"
    }
}
