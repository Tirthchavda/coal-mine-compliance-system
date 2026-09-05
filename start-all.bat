@echo off
title Coal Mine Governance System Starter
echo ====================================================================
echo Starting Coal Mine Statutory Compliance & Governance Monitoring System
echo ====================================================================
echo.

echo [1/2] Starting Backend API Server on Port 5000...
start "Coal Compliance - Backend API (Port 5000)" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend UI Server on Port 5173...
start "Coal Compliance - Frontend UI (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ====================================================================
echo Both servers have been launched in separate dedicated windows!
echo Backend API:  http://localhost:5000/api/health
echo Swagger Docs: http://localhost:5000/api/docs
echo Web Portal:   http://localhost:5173
echo ====================================================================
echo.
pause

