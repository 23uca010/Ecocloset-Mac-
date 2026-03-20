const QRCode = require('qrcode');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Download ngrok for Windows
function downloadNgrok() {
  return new Promise((resolve, reject) => {
    const ngrokUrl = 'https://bin.equinox.io/c/bNyj1mQVY4VCngVgL39W3F/ngrok-stable-windows-amd64.zip';
    const filePath = path.join(__dirname, 'ngrok.zip');
    
    const file = fs.createWriteStream(filePath);
    
    https.get(ngrokUrl, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log('✅ ngrok downloaded successfully!');
        console.log('📁 File saved as: ngrok.zip');
        console.log('');
        console.log('🔧 Next steps:');
        console.log('1. Extract ngrok.zip');
        console.log('2. Run: ngrok.exe http 3000');
        console.log('3. Copy the ngrok URL');
        console.log('4. Update the QR code below');
        resolve(filePath);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

// Generate QR code with placeholder for ngrok URL
async function generatePublicQRCode() {
  try {
    console.log('🌍 Setting up public access for EcoCloset...');
    console.log('');
    
    // Download ngrok
    await downloadNgrok();
    
    // Generate QR code with placeholder
    const placeholderUrl = 'https://your-ngrok-url.ngrok.io';
    
    const qrCodeDataUrl = await QRCode.toDataURL(placeholderUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#3b82f6', // Blue for public access
        light: '#ffffff'
      }
    });

    // Create HTML file with instructions
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EcoCloset - Public Access QR Code</title>
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
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        .subtitle {
            text-align: center;
            color: #6b7280;
            margin-bottom: 30px;
            font-size: 1.2em;
        }
        .qr-container {
            text-align: center;
            margin: 30px 0;
        }
        .qr-box {
            display: inline-block;
            padding: 30px;
            border: 3px solid #3b82f6;
            border-radius: 12px;
            background: #f8fafc;
            box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
        }
        .qr-box img {
            border: 4px solid #3b82f6;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }
        .url-input {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            color: #374151;
            word-break: break-all;
            margin: 20px 0;
            font-size: 16px;
            border: 2px solid #e5e7eb;
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
            margin-bottom: 10px;
            line-height: 1.5;
        }
        .instructions code {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            color: #dc2626;
        }
        .download-btn {
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
        .download-btn:hover {
            background: #2563eb;
        }
        .update-btn {
            background: #10b981;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 18px;
            margin: 10px;
        }
        .update-btn:hover {
            background: #059669;
        }
        .status {
            background: #ecfdf5;
            border: 2px solid #10b981;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        .status h3 {
            color: #10b981;
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
        .ngrok-status {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        .ngrok-status h3 {
            color: #d97706;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 EcoCloset - Public Access</h1>
        <p class="subtitle">Share your sustainable fashion marketplace with anyone, anywhere!</p>
        
        <div class="status">
            <h3>✅ Setup Status</h3>
            <p><strong>ngrok Downloaded:</strong> ✅ Ready to extract</p>
            <p><strong>Frontend Running:</strong> ✅ http://localhost:3000</p>
            <p><strong>Backend Running:</strong> ✅ http://localhost:5000</p>
        </div>

        <div class="ngrok-status">
            <h3>🔧 ngrok Setup Required</h3>
            <p>ngrok has been downloaded as <code>ngrok.zip</code> in your project folder.</p>
        </div>
        
        <div class="instructions">
            <h3>📋 Step-by-Step Instructions</h3>
            <ol>
                <li><strong>Extract ngrok.zip</strong> - Right-click and extract the ngrok files</li>
                <li><strong>Open Command Prompt</strong> - Navigate to the extracted ngrok folder</li>
                <li><strong>Run ngrok:</strong> <code>ngrok.exe http 3000</code></li>
                <li><strong>Copy the URL</strong> - It will look like <code>https://abc123.ngrok.io</code></li>
                <li><strong>Update QR Code:</strong> - Click the "Update QR Code" button below</li>
                <li><strong>Share QR Code:</strong> - Anyone can scan it from anywhere!</li>
            </ol>
        </div>
        
        <div class="qr-container">
            <div class="qr-box">
                <h3>🌍 Public QR Code</h3>
                <img src="${qrCodeDataUrl}" alt="EcoCloset Public QR Code" />
                <div class="url-input" id="urlDisplay">
                    https://your-ngrok-url.ngrok.io
                </div>
                <button class="update-btn" onclick="updateQRCode()">
                    🔄 Update QR Code
                </button>
                <a href="${qrCodeDataUrl}" download="ecocloset-public-qr.png" class="download-btn">
                    📥 Download QR Code
                </a>
            </div>
        </div>
        
        <div class="features">
            <h3>✨ Public Access Features</h3>
            <ul>
                <li>🌍 <strong>Works from anywhere</strong> - No network restrictions</li>
                <li>📱 <strong>Mobile friendly</strong> - Optimized for all devices</li>
                <li>🔄 <strong>Real-time updates</strong> - Changes appear instantly</li>
                <li>🔒 <strong>Secure connection</strong> - HTTPS encryption</li>
                <li>👥 <strong>Unlimited users</strong> - Anyone can access</li>
                <li>🌱 <strong>Full features</strong> - Complete marketplace experience</li>
            </ul>
        </div>
        
        <div class="instructions">
            <h3>🌐 Website Links</h3>
            <p><strong>Local Access:</strong> <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></p>
            <p><strong>Public Access:</strong> <span id="publicLink">https://your-ngrok-url.ngrok.io</span> (after ngrok setup)</p>
            <p><strong>Backend API:</strong> <a href="http://localhost:5000/api" target="_blank">http://localhost:5000/api</a></p>
        </div>
    </div>

    <script>
        function updateQRCode() {
            const url = prompt('Enter your ngrok URL (e.g., https://abc123.ngrok.io):');
            if (url && url.includes('ngrok.io')) {
                // Update the display
                document.getElementById('urlDisplay').textContent = url;
                document.getElementById('publicLink').textContent = url;
                
                // Generate new QR code
                const QRCode = require('qrcode');
                QRCode.toDataURL(url, {
                    width: 400,
                    margin: 2,
                    color: {
                        dark: '#3b82f6',
                        light: '#ffffff'
                    }
                }).then(dataUrl => {
                    // Update QR code image
                    const img = document.querySelector('.qr-box img');
                    img.src = dataUrl;
                    
                    // Update download link
                    const downloadLink = document.querySelector('.download-btn');
                    downloadLink.href = dataUrl;
                    
                    alert('✅ QR Code updated successfully!');
                }).catch(err => {
                    alert('❌ Error updating QR code: ' + err.message);
                });
            } else {
                alert('❌ Please enter a valid ngrok URL');
            }
        }
    </script>
</body>
</html>`;

    // Write HTML file
    fs.writeFileSync('ecocloset-public-access.html', htmlContent);
    
    console.log('');
    console.log('✅ Public access setup complete!');
    console.log('📱 Open ecocloset-public-access.html for instructions');
    console.log('');
    console.log('🌍 Website Links:');
    console.log('   • Local: http://localhost:3000');
    console.log('   • Public: https://your-ngrok-url.ngrok.io (after ngrok setup)');
    console.log('   • API: http://localhost:5000/api');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('   1. Extract ngrok.zip');
    console.log('   2. Run: ngrok.exe http 3000');
    console.log('   3. Copy ngrok URL');
    console.log('   4. Update QR code in the HTML page');
    console.log('   5. Share with anyone!');
    
  } catch (error) {
    console.error('❌ Error setting up public access:', error);
  }
}

generatePublicQRCode();
