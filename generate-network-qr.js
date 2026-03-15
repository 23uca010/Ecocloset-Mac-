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
const websiteUrl = `http://${localIP}:3000`;

async function generateNetworkQRCode() {
  try {
    console.log('🌐 Your local network IP:', localIP);
    console.log('🔗 Website URL:', websiteUrl);
    console.log('');

    // Generate QR code as PNG
    const qrCodeDataUrl = await QRCode.toDataURL(websiteUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#16a34a', // Green color to match EcoCloset theme
        light: '#ffffff'
      }
    });

    // Also generate a larger version for better quality
    const qrCodeDataUrlLarge = await QRCode.toDataURL(websiteUrl, {
      width: 500,
      margin: 2,
      color: {
        dark: '#16a34a', // Green color to match EcoCloset theme
        light: '#ffffff'
      }
    });

    // Create HTML file to display QR codes
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EcoCloset Network QR Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
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
        .qr-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
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
            margin-bottom: 15px;
            font-size: 1.3em;
        }
        .qr-box img {
            border: 4px solid #16a34a;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .url {
            background: #f3f4f6;
            padding: 10px 15px;
            border-radius: 6px;
            font-family: monospace;
            color: #374151;
            word-break: break-all;
            margin-top: 10px;
            font-size: 14px;
        }
        .network-info {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }
        .network-info h3 {
            color: #d97706;
            margin-bottom: 10px;
        }
        .network-info p {
            color: #92400e;
            margin: 5px 0;
        }
        .features {
            margin-top: 30px;
            padding: 20px;
            background: #ecfdf5;
            border-radius: 8px;
            border-left: 4px solid #16a34a;
        }
        .features h3 {
            color: #16a34a;
            margin-bottom: 10px;
        }
        .features ul {
            margin: 0;
            padding-left: 20px;
        }
        .features li {
            margin-bottom: 5px;
            color: #374151;
        }
        .download-btn {
            background: #16a34a;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 10px;
            text-decoration: none;
            display: inline-block;
        }
        .download-btn:hover {
            background: #15803d;
        }
        .instructions {
            background: #dbeafe;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }
        .instructions h3 {
            color: #1d4ed8;
            margin-bottom: 10px;
        }
        .instructions ol {
            color: #1e40af;
            margin: 10px 0;
            padding-left: 20px;
        }
        .instructions li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌱 EcoCloset</h1>
        <p class="subtitle">Sustainable Fashion Marketplace - Network QR Code</p>
        
        <div class="network-info">
            <h3>🌐 Network Information</h3>
            <p><strong>Your Local IP:</strong> ${localIP}</p>
            <p><strong>Website URL:</strong> ${websiteUrl}</p>
            <p><strong>Status:</strong> ✅ Accessible from devices on same network</p>
        </div>

        <div class="instructions">
            <h3>📱 How to Use This QR Code:</h3>
            <ol>
                <li>Make sure your mobile device is connected to the same WiFi network</li>
                <li>Scan the QR code with your phone's camera or QR scanner app</li>
                <li>The EcoCloset website will open on your mobile device</li>
                <li>Enjoy browsing 104 sustainable fashion items!</li>
            </ol>
        </div>
        
        <div class="qr-container">
            <div class="qr-box">
                <h3>📱 Mobile QR Code</h3>
                <img src="${qrCodeDataUrl}" alt="EcoCloset Network QR Code" />
                <div class="url">${websiteUrl}</div>
                <a href="${qrCodeDataUrl}" download="ecocloset-network-qr-300px.png" class="download-btn">
                    📥 Download QR Code
                </a>
            </div>
            
            <div class="qr-box">
                <h3>🖨️ High Quality QR Code</h3>
                <img src="${qrCodeDataUrlLarge}" alt="EcoCloset Network QR Code Large" />
                <div class="url">${websiteUrl}</div>
                <a href="${qrCodeDataUrlLarge}" download="ecocloset-network-qr-500px.png" class="download-btn">
                    📥 Download High Quality
                </a>
            </div>
        </div>
        
        <div class="features">
            <h3>✨ What You'll Find:</h3>
            <ul>
                <li>👔 104 Sustainable Fashion Items</li>
                <li>🔄 Swap & Donate Clothing</li>
                <li>👤 User Authentication System</li>
                <li>🌱 Eco-Friendly Focus</li>
                <li>📱 Mobile-Optimized Design</li>
                <li>🎁 Complete Marketplace Features</li>
                <li>📱 Item Detail Pages</li>
                <li>🔐 Registration & Login</li>
            </ul>
        </div>
    </div>
</body>
</html>`;

    // Write HTML file
    const fs = require('fs');
    fs.writeFileSync('ecocloset-network-qr.html', htmlContent);
    
    console.log('✅ Network QR Code generated successfully!');
    console.log('📱 Open ecocloset-network-qr.html to view and download QR codes');
    console.log('🌐 QR Code links to:', websiteUrl);
    console.log('');
    console.log('📋 QR Code Details:');
    console.log('   • Size: 300px and 500px versions');
    console.log('   • Color: Green theme (#16a34a)');
    console.log('   • Format: PNG (Data URL)');
    console.log('   • Ready for mobile scanning');
    console.log('   • Network accessible from same WiFi');
    console.log('');
    console.log('📱 Mobile Access Instructions:');
    console.log('   1. Connect mobile device to same WiFi network');
    console.log('   2. Scan QR code with phone camera');
    console.log('   3. Access EcoCloset on mobile device');
    
  } catch (error) {
    console.error('❌ Error generating QR code:', error);
  }
}

generateNetworkQRCode();
