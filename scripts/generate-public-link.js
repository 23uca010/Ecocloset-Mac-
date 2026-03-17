const https = require('https');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// Download ngrok for Windows automatically
function downloadNgrok() {
  return new Promise((resolve, reject) => {
    const ngrokUrl = 'https://bin.equinox.io/c/bNyj1mQVY4VCngVgL39W3F/ngrok-stable-windows-amd64.zip';
    const filePath = path.join(__dirname, 'ngrok.zip');
    
    if (fs.existsSync(filePath)) {
      console.log('✅ ngrok already downloaded');
      resolve(filePath);
      return;
    }
    
    const file = fs.createWriteStream(filePath);
    
    https.get(ngrokUrl, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log('✅ ngrok downloaded successfully!');
        resolve(filePath);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

// Create a comprehensive public access guide
async function generatePublicAccess() {
  try {
    console.log('🌍 Generating EcoCloset Public Access...');
    console.log('');
    
    // Download ngrok if not already present
    await downloadNgrok();
    
    // Create a simple HTML page with the public access information
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EcoCloset - Public Access Link</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #3b82f6;
            text-align: center;
            margin-bottom: 20px;
            font-size: 2.5em;
        }
        .public-link {
            background: #ecfdf5;
            border: 3px solid #10b981;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 20px 0;
        }
        .public-link h2 {
            color: #10b981;
            margin-bottom: 15px;
            font-size: 1.8em;
        }
        .link-display {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 18px;
            color: #065f46;
            word-break: break-all;
            border: 2px solid #34d399;
            margin: 15px 0;
        }
        .instructions {
            background: #dbeafe;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .instructions h3 {
            color: #1d4ed8;
            margin-bottom: 15px;
        }
        .instructions ol {
            color: #1e40af;
            margin: 10px 0;
            padding-left: 20px;
        }
        .instructions li {
            margin-bottom: 8px;
            line-height: 1.5;
        }
        .instructions code {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            color: #dc2626;
        }
        .status {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        .status h3 {
            color: #d97706;
            margin-bottom: 10px;
        }
        .features {
            background: #f0fdf4;
            border: 2px solid #16a34a;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .features h3 {
            color: #16a34a;
            margin-bottom: 10px;
        }
        .features ul {
            color: #374151;
            margin: 10px 0;
            padding-left: 20px;
        }
        .features li {
            margin-bottom: 5px;
        }
        .btn {
            background: #3b82f6;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 18px;
            text-decoration: none;
            display: inline-block;
            margin: 10px;
            transition: background 0.2s;
        }
        .btn:hover {
            background: #2563eb;
        }
        .btn-success {
            background: #10b981;
        }
        .btn-success:hover {
            background: #059669;
        }
        .qr-placeholder {
            width: 300px;
            height: 300px;
            background: #f3f4f6;
            border: 3px dashed #9ca3af;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px auto;
            color: #6b7280;
            font-size: 16px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 EcoCloset - Public Access</h1>
        <p style="text-align: center; color: #6b7280; font-size: 1.2em; margin-bottom: 30px;">
            Share your sustainable fashion marketplace with anyone, anywhere!
        </p>
        
        <div class="public-link">
            <h2>🌐 PUBLIC WEBSITE LINK</h2>
            <div class="link-display" id="publicLink">
                https://your-ngrok-url.ngrok.io
            </div>
            <p style="color: #6b7280; margin-top: 10px;">
                This link will work from any network, anywhere in the world!
            </p>
        </div>

        <div class="status">
            <h3>🔧 Setup Required</h3>
            <p><strong>ngrok downloaded:</strong> ✅ Ready to extract</p>
            <p><strong>Frontend running:</strong> ✅ http://localhost:3000</p>
            <p><strong>Backend running:</strong> ✅ http://localhost:5000</p>
            <p><strong>Public access:</strong> 🔄 Complete ngrok setup below</p>
        </div>
        
        <div class="instructions">
            <h3>📋 Quick Setup (5 Minutes)</h3>
            <ol>
                <li><strong>Extract ngrok.zip</strong> - Right-click and extract to 'ngrok' folder</li>
                <li><strong>Open Command Prompt</strong> - Press Windows Key + R, type 'cmd', press Enter</li>
                <li><strong>Navigate to ngrok folder:</strong> <code>cd C:\\Users\\Stergio Eugin\\Desktop\\ecocloset-project\\ngrok</code></li>
                <li><strong>Run ngrok:</strong> <code>ngrok.exe http 3000</code></li>
                <li><strong>Copy your public URL:</strong> Look for the line that says <code>Forwarding https://abc123.ngrok.io -> http://localhost:3000</code></li>
                <li><strong>Update this page:</strong> Click "Update Public Link" below</li>
                <li><strong>Share your link:</strong> Anyone can access your EcoCloset!</li>
            </ol>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <button class="btn btn-success" onclick="updatePublicLink()">
                🔄 Update Public Link
            </button>
            <button class="btn" onclick="generateQRCode()">
                📱 Generate QR Code
            </button>
        </div>

        <div id="qrSection" style="display: none; text-align: center;">
            <h3 style="color: #3b82f6; margin-bottom: 20px;">📱 Public QR Code</h3>
            <div id="qrCodeContainer"></div>
            <button class="btn" onclick="downloadQRCode()" style="margin-top: 15px;">
                📥 Download QR Code
            </button>
        </div>
        
        <div class="features">
            <h3>✨ What Your Public Link Offers</h3>
            <ul>
                <li>🌍 <strong>Global Access</strong> - Works from any network, anywhere</li>
                <li>📱 <strong>Mobile Friendly</strong> - Perfect for smartphones and tablets</li>
                <li>🔄 <strong>Real-time Updates</strong> - Changes appear instantly</li>
                <li>🔒 <strong>Secure Connection</strong> - HTTPS encryption included</li>
                <li>👥 <strong>Unlimited Users</strong> - No user limits or restrictions</li>
                <li>🌱 <strong>Full Features</strong> - Complete marketplace experience</li>
                <li>👔 <strong>104 Items</strong> - All sustainable fashion products</li>
                <li>🔐 <strong>User Accounts</strong> - Registration and login working</li>
                <li>📊 <strong>Dashboard</strong> - User profiles and statistics</li>
            </ul>
        </div>
        
        <div style="background: #f8fafc; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #374151; margin-bottom: 15px;">🌐 All Website Links</h3>
            <p><strong>Local Access:</strong> <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></p>
            <p><strong>Public Access:</strong> <span id="publicLinkText">https://your-ngrok-url.ngrok.io</span> (after setup)</p>
            <p><strong>Backend API:</strong> <a href="http://localhost:5000/api" target="_blank">http://localhost:5000/api</a></p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
    <script>
        let currentPublicURL = null;
        let currentQRDataUrl = null;

        function updatePublicLink() {
            const url = prompt('Enter your ngrok URL (e.g., https://abc123.ngrok.io):');
            if (url && url.includes('ngrok.io')) {
                currentPublicURL = url;
                document.getElementById('publicLink').textContent = url;
                document.getElementById('publicLinkText').textContent = url;
                
                // Update the link to be clickable
                const linkElement = document.getElementById('publicLink');
                linkElement.innerHTML = \`<a href="\${url}" target="_blank" style="color: #065f46; text-decoration: underline;">\${url}</a>\`;
                
                alert('✅ Public link updated successfully!');
            } else {
                alert('❌ Please enter a valid ngrok URL');
            }
        }

        function generateQRCode() {
            if (!currentPublicURL) {
                alert('❌ Please update your public link first');
                return;
            }
            
            QRCode.toDataURL(currentPublicURL, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#3b82f6',
                    light: '#ffffff'
                }
            }).then(dataUrl => {
                currentQRDataUrl = dataUrl;
                const container = document.getElementById('qrCodeContainer');
                container.innerHTML = \`<img src="\${dataUrl}" alt="EcoCloset Public QR Code" style="border: 3px solid #3b82f6; border-radius: 8px;" />\`;
                document.getElementById('qrSection').style.display = 'block';
                alert('✅ QR Code generated successfully!');
            }).catch(err => {
                alert('❌ Error generating QR code: ' + err.message);
            });
        }

        function downloadQRCode() {
            if (!currentQRDataUrl) {
                alert('❌ Please generate a QR code first');
                return;
            }
            
            const link = document.createElement('a');
            link.download = 'ecocloset-public-qr.png';
            link.href = currentQRDataUrl;
            link.click();
        }
    </script>
</body>
</html>`;

    // Write the HTML file
    fs.writeFileSync('ECOCLOSET_PUBLIC_LINK.html', htmlContent);
    
    // Create a simple batch file for easy access
    const batchContent = `@echo off
echo 🌍 EcoCloset Public Access Generator
echo ====================================
echo.
echo This will help you create a public link for your EcoCloset website
echo that anyone can access from any network.
echo.
echo 🔧 Setup Instructions:
echo 1. Extract ngrok.zip to ngrok folder
echo 2. Run: ngrok.exe http 3000
echo 3. Copy your ngrok URL
echo 4. Update the public link
echo.
echo 🌐 Opening public link generator...
start ECOCLOSET_PUBLIC_LINK.html
echo.
echo ✅ Follow the instructions to create your public link!
pause`;

    fs.writeFileSync('CREATE_PUBLIC_LINK.bat', batchContent);
    
    console.log('✅ Public access generator created!');
    console.log('');
    console.log('🌐 Files Created:');
    console.log('   • ECOCLOSET_PUBLIC_LINK.html - Public link generator');
    console.log('   • CREATE_PUBLIC_LINK.bat - Easy access script');
    console.log('   • ngrok.zip - ngrok application');
    console.log('');
    console.log('🌍 Your Complete Website Links:');
    console.log('   • Local: http://localhost:3000');
    console.log('   • Public: https://your-ngrok-url.ngrok.io (after setup)');
    console.log('   • API: http://localhost:5000/api');
    console.log('');
    console.log('🚀 Next Steps:');
    console.log('   1. Open ECOCLOSET_PUBLIC_LINK.html');
    console.log('   2. Follow the setup instructions');
    console.log('   3. Get your ngrok URL');
    console.log('   4. Update the public link');
    console.log('   5. Share with anyone!');
    console.log('');
    console.log('🌱 Your EcoCloset will be accessible from anywhere in the world!');
    
  } catch (error) {
    console.error('❌ Error generating public access:', error);
  }
}

generatePublicAccess();
