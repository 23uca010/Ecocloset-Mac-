@echo off
echo ========================================
echo Starting EcoCloset Applications
echo ========================================
echo.

echo Starting Backend Server...
cd /d "%~dp0..\backend"
start "Backend Server" cmd /k "npm start && pause"

echo.
echo Starting Frontend Server...
cd /d "%~dp0..\frontend"
start "Frontend Server" cmd /k "npm start && pause"

echo.
echo ========================================
echo Both servers starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit...
pause >nul
