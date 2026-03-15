@echo off
echo ========================================
echo Starting EcoCloset Application
echo ========================================
echo.

echo Step 1: Starting Backend...
cd /d "c:\Users\Stergio Eugin\Desktop\ecocloset-project\backend"
echo Current directory: %CD%
echo Checking if server-working.js exists...
if exist server-working.js (
    echo Found server-working.js, starting backend...
    start "Backend Server" cmd /k "node server-working.js"
    echo Backend started on port 5000
) else (
    echo server-working.js not found, creating it...
    echo Backend not available
    pause
    exit /b
)

echo.
echo Step 2: Starting Frontend...
cd /d "c:\Users\Stergio Eugin\Desktop\ecocloset-project\frontend"
echo Current directory: %CD%
echo Checking if package.json exists...
if exist package.json (
    echo Found package.json, installing dependencies...
    call npm install
    echo Dependencies installed, starting frontend...
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
echo ========================================
echo.
echo Please wait 10 seconds for servers to start...
timeout /t 10 >nul

echo.
echo Opening browser to main website...
start http://localhost:3000

echo.
echo Opening browser to API health check...
start http://localhost:5000/api

echo.
echo ========================================
echo EcoCloset Application Started!
echo ========================================
echo.
echo Press any key to exit...
pause >nul
