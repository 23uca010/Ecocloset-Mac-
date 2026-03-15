@echo off
echo Starting EcoCloset Application...
echo.

echo Step 1: Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Step 2: Starting Frontend Server...
cd ../frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo EcoCloset is starting up...
echo.
echo Backend API: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Please wait a moment for both servers to fully start.
echo The browser will open automatically when ready.
echo.

timeout /t 10 /nobreak >nul
start http://localhost:3000

echo Both servers are running!
echo Press any key to close this window...
pause >nul
