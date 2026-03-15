@echo off
echo ========================================
echo Starting Figma-Style EcoCloset Website
echo ========================================
echo.

echo Step 1: Starting Backend Server...
cd /d "c:\Users\Stergio Eugin\Desktop\ecocloset-project\backend"
echo Current directory: %CD%
if exist server-working.js (
    echo Found server-working.js, starting backend...
    start "Backend Server" cmd /k "node server-working.js"
    echo Backend started on port 5000
) else (
    echo server-working.js not found, please check backend setup
    pause
    exit /b
)

echo.
echo Step 2: Starting Frontend Server...
cd /d "c:\Users\Stergio Eugin\Desktop\ecocloset-project\frontend"
echo Current directory: %CD%
if exist package.json (
    echo Found package.json, starting frontend...
    echo Installing dependencies...
    call npm install
    echo Dependencies installed, starting frontend server...
    start "Frontend Server" cmd /k "npm start"
    echo Frontend starting on port 3000
) else (
    echo package.json not found, frontend not available
    pause
    exit /b
)

echo.
echo ========================================
echo Both servers starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo Design: Figma-Style Modern UI
echo Features: Clothing Swap & Sell Platform
echo ========================================
echo.
echo Please wait 15 seconds for servers to start...
timeout /t 15 >nul

echo.
echo Opening browser to main website...
start http://localhost:3000

echo.
echo Opening Figma reference...
start https://www.figma.com/make/H0sm7duQOevyKhzfTPy0kY/Clothing-Swap-and-Sell-Platform

echo.
echo ========================================
echo EcoCloset Figma-Style Website Started!
echo ========================================
echo.
echo Press any key to exit...
pause >nul
