@echo off
echo 🌍 EcoCloset ngrok Helper
echo ========================
echo.
echo This script will guide you through ngrok setup
echo.
echo 🔧 Step 1: Extract ngrok.zip
echo 📁 ngrok.zip is in your project folder
echo 💡 Please extract it to a folder called 'ngrok'
echo 💡 Right-click ngrok.zip -> Extract to ngrok/
echo.
echo 🔧 Step 2: Open Command Prompt
echo 💡 Press Windows Key + R, type 'cmd', press Enter
echo.
echo 🔧 Step 3: Navigate to ngrok folder
echo 💡 Copy and paste this command:
echo cd C:\Users\Stergio Eugin\Desktop\ecocloset-project\ngrok
echo.
echo 🔧 Step 4: Run ngrok
echo 💡 Copy and paste this command:
echo ngrok.exe http 3000
echo.
echo 🔧 Step 5: Copy your ngrok URL
echo 💡 Look for the line that says:
echo Forwarding https://abc123-def456.ngrok.io -> http://localhost:3000
echo 💡 Copy the https://...ngrok.io URL
echo.
echo 🔧 Step 6: Update QR Code
echo 💡 Open ecocloset-public-access.html
echo 💡 Click "Update QR Code" button
echo 💡 Paste your ngrok URL
echo.
echo 🌍 Your website will be accessible from anywhere!
echo.
echo 📱 Opening setup instructions...
start ecocloset-public-access.html
echo.
echo ✅ Follow the steps above to complete setup!
pause
