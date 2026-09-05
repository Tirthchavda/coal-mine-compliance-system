Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "Starting Coal Mine Statutory Compliance & Governance Monitoring System" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n[1/2] Launching Backend API Server on Port 5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "[2/2] Launching Frontend UI Server on Port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Write-Host "`n====================================================================" -ForegroundColor Cyan
Write-Host "Backend API:  http://localhost:5000/api/health" -ForegroundColor White
Write-Host "Swagger Docs: http://localhost:5000/api/docs" -ForegroundColor White
Write-Host "Web Portal:   http://localhost:5173" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan

