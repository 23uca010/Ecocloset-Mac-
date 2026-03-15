@echo off
echo ========================================
echo EcoCloset Localhost Connection Fix
echo ========================================
echo.

echo Step 1: Diagnosing project structure...
cd /d "c:\Users\Stergio Eugin\Desktop\ecocloset-project"
echo Current directory: %CD%
echo.

echo Step 2: Checking backend...
if exist backend\server-working.js (
    echo ✅ Backend server found
) else (
    echo ❌ Backend server not found
    echo Creating backend server...
    pause
    exit /b
)

echo.
echo Step 3: Checking frontend...
cd frontend
if exist package.json (
    echo ✅ Frontend package.json found
) else (
    echo ❌ Frontend package.json not found
    echo Frontend directory structure incorrect
    pause
    exit /b
)

echo.
echo Step 4: Cleaning frontend dependencies...
echo Removing node_modules and package-lock.json...
if exist node_modules (
    rmdir /s /q node_modules
)
if exist package-lock.json (
    del package-lock.json
)

echo.
echo Step 5: Installing frontend dependencies...
echo Running npm install...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm install failed
    pause
    exit /b
)

echo.
echo Step 6: Starting backend server...
cd ..\backend
echo Starting backend on port 5000...
start "Backend Server" cmd /k "node server-working.js"

echo.
echo Step 7: Starting frontend server...
cd ..\frontend
echo Checking if port 3000 is available...
netstat -ano | findstr :3000 >nul
if %ERRORLEVEL% EQU 0 (
    echo ⚠️ Port 3000 is busy, using port 3001...
    set PORT=3001
    echo Starting frontend on port 3001...
    start "Frontend Server" cmd /k "npm start"
    set FRONTEND_URL=http://localhost:3001
) else (
    echo ✅ Port 3000 is available
    echo Starting frontend on port 3000...
    start "Frontend Server" cmd /k "npm start"
    set FRONTEND_URL=http://localhost:3000
)

echo.
echo ========================================
echo EcoCloset Servers Starting...
echo Backend: http://localhost:5000
echo Frontend: %FRONTEND_URL%
echo ========================================
echo.

echo Step 8: Waiting for servers to start...
timeout /t 15 >nul

echo.
echo Step 9: Opening browser...
start %FRONTEND_URL%

echo.
echo Step 10: Opening Figma reference...
start https://www.figma.com/make/H0sm7duQOevyKhzfTPy0kY/Clothing-Swap-and-Sell-Platform

echo.
echo ========================================
echo EcoCloset Localhost Connection Fix Complete!
echo Website should be running at: %FRONTEND_URL%
echo Backend API should be running at: http://localhost:5000
echo ========================================
echo.
echo Press any key to exit...
pause >nul
