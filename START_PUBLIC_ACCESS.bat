@echo off
echo 🌍 EcoCloset Public Access Setup
echo =================================
echo.
echo This script will help you set up public access for your EcoCloset website.
echo.
echo 🔧 Step 1: Extract ngrok.zip
echo 📁 ngrok.zip has been downloaded to your project folder
echo 💡 Please extract it to a folder (e.g., ngrok-folder)
echo.
echo 🔧 Step 2: Run ngrok
echo 💡 Open Command Prompt and navigate to your ngrok folder
echo 💡 Then run: ngrok.exe http 3000
echo.
echo 🔧 Step 3: Copy your ngrok URL
echo 💡 ngrok will show you a URL like: https://abc123.ngrok.io
echo 💡 Copy this URL
echo.
echo 🔧 Step 4: Update QR Code
echo 💡 Open ecocloset-public-access.html
echo 💡 Click "Update QR Code" and paste your ngrok URL
echo.
echo 🌍 Your website will be accessible from anywhere!
echo.
echo 📱 Website Links:
echo    • Local: http://localhost:3000
echo    • Public: [Your ngrok URL]
echo    • API: http://localhost:5000/api
echo.
echo 🌐 Opening setup instructions...
start ecocloset-public-access.html
echo.
echo ✅ Setup complete! Follow the instructions in the browser.
pause
