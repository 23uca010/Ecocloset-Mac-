const QRCode = require('qrcode');
const os = require('os');

// Get your local network IP address
function getLocalNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost'; // Fallback
}

const localIP = getLocalNetworkIP();

// Generate multiple URL options
const urlOptions = [
  {
    name: 'Localhost (Computer Only)',
    url: 'http://localhost:3000',
    description: 'Only works on this computer',
    color: '#6b7280'
  },
  {
    name: 'Local Network',
    url: `http://${localIP}:3000`,
    description: 'Works on devices connected to same WiFi',
    color: '#16a34a'
  },
  {
    name: 'Public Demo (ngrok)',
    url: 'https://your-ngrok-url.ngrok.io',
    description: 'Works from anywhere (requires ngrok setup)',
    color: '#3b82f6'
  }
];

async function generateAllQRCodes() {
  try {
    console.log('🌐 Your local network IP:', localIP);
    console.log('');
    console.log('📱 Generating QR codes for all access options...');
    console.log('');

    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EcoCloset QR Codes - All Options</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #16a34a;
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
        .qr-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 30px;
        }
        .qr-box {
            text-align: center;
            padding: 20px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            background: #f9fafb;
        }
        .qr-box h3 {
            color: #374151;
            margin-bottom: 10px;
            font-size: 1.3em;
        }
        .qr-box img {
            border: 4px solid #16a34a;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 15px;
        }
        .url {
            background: #f3f4f6;
            padding: 10px 15px;
            border-radius: 6px;
            font-family: monospace;
            color: #374151;
            word-break: break-all;
            margin: 10px 0;
            font-size: 14px;
        }
        .description {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 15px;
        }
        .download-btn {
            background: #16a34a;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
            display: inline-block;
            margin: 5px;
        }
        .download-btn:hover {
            background: #15803d;
        }
        .troubleshooting {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .troubleshooting h3 {
            color: #d97706;
            margin-bottom: 15px;
        }
        .troubleshooting ul {
            color: #92400e;
            margin: 10px 0;
            padding-left: 20px;
        }
        .troubleshooting li {
            margin-bottom: 8px;
        }
        .ngrok-setup {
            background: #dbeafe;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .ngrok-setup h3 {
            color: #1d4ed8;
            margin-bottom: 15px;
        }
        .ngrok-setup code {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
        }
        .status {
            background: #ecfdf5;
            border: 2px solid #16a34a;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }
        .status h3 {
            color: #16a34a;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌱 EcoCloset QR Codes</h1>
        <p class="subtitle">Multiple Access Options for Your Sustainable Fashion Marketplace</p>
        
        <div class="status">
            <h3>🌐 Network Information</h3>
            <p><strong>Your Local IP:</strong> ${localIP}</p>
            <p><strong>Frontend Status:</strong> ✅ Running on port 3000</p>
            <p><strong>Backend Status:</strong> ✅ Running on port 5000</p>
        </div>

        <div class="troubleshooting">
            <h3>🔧 Troubleshooting QR Code Access</h3>
            <ul>
                <li><strong>Localhost QR:</strong> Only works on this computer - good for testing</li>
                <li><strong>Network QR:</strong> Requires same WiFi connection - best for local sharing</li>
                <li><strong>Public QR:</strong> Requires ngrok setup - works from anywhere</li>
                <li><strong>Firewall Issues:</strong> Windows Firewall might block network access</li>
                <li><strong>Mobile Data:</strong> Turn off mobile data, use WiFi only</li>
                <li><strong>VPN:</strong> Disable VPN if you're using one</li>
            </ul>
        </div>

        <div class="ngrok-setup">
            <h3>🌍 Public Access with ngrok (Optional)</h3>
            <p>To make your website accessible from anywhere, you can use ngrok:</p>
            <ol>
                <li>Download ngrok from <a href="https://ngrok.com/download" target="_blank">ngrok.com</a></li>
                <li>Run: <code>ngrok http 3000</code></li>
                <li>Copy the ngrok URL (looks like https://abc123.ngrok.io)</li>
                <li>Replace the ngrok URL in the third QR code below</li>
            </ol>
        </div>
        
        <div class="qr-grid">`;

    // Generate QR codes for each option
    for (const option of urlOptions) {
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(option.url, {
          width: 250,
          margin: 2,
          color: {
            dark: option.color,
            light: '#ffffff'
          }
        });

        htmlContent += `
            <div class="qr-box">
                <h3>${option.name}</h3>
                <img src="${qrCodeDataUrl}" alt="${option.name} QR Code" />
                <div class="url">${option.url}</div>
                <div class="description">${option.description}</div>
                <a href="${qrCodeDataUrl}" download="ecocloset-${option.name.toLowerCase().replace(/\s+/g, '-')}-qr.png" class="download-btn">
                    📥 Download
                </a>
                <a href="${option.url}" target="_blank" class="download-btn">
                    🔗 Test Link
                </a>
            </div>`;
      } catch (error) {
        console.error(`Error generating QR for ${option.name}:`, error);
      }
    }

    htmlContent += `
        </div>
        
        <div class="troubleshooting">
            <h3>📱 Mobile Testing Instructions</h3>
            <ol>
                <li><strong>Try Localhost First:</strong> Scan the localhost QR on your computer screen</li>
                <li><strong>Test Network Access:</strong> Open ${localIP}:3000 in your computer browser</li>
                <li><strong>Check WiFi:</strong> Ensure mobile device is on same WiFi network</li>
                <li><strong>Disable VPN:</strong> Turn off any VPN on both devices</li>
                <li><strong>Check Firewall:</strong> Windows might block network access</li>
                <li><strong>Use ngrok:</strong> For guaranteed access from anywhere</li>
            </ol>
        </div>
    </div>
</body>
</html>`;

    // Write HTML file
    const fs = require('fs');
    fs.writeFileSync('ecocloset-all-qr-codes.html', htmlContent);
    
    console.log('✅ All QR codes generated successfully!');
    console.log('📱 Open ecocloset-all-qr-codes.html to view all options');
    console.log('');
    console.log('🌐 Available URLs:');
    urlOptions.forEach(option => {
      console.log(`   • ${option.name}: ${option.url}`);
    });
    console.log('');
    console.log('📋 QR Code Options:');
    console.log('   • Localhost: Computer only (gray)');
    console.log('   • Network: Same WiFi (green)');
    console.log('   • Public: Anywhere (blue, requires ngrok)');
    
  } catch (error) {
    console.error('❌ Error generating QR codes:', error);
  }
}

generateAllQRCodes();
