const QRCode = require('qrcode');

// Your EcoCloset website URL
const websiteUrl = 'http://localhost:3000';

async function generateQRCode() {
  try {
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
    <title>EcoCloset QR Code</title>
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
    </style>
</head>
<body>
    <div class="container">
        <h1>🌱 EcoCloset</h1>
        <p class="subtitle">Sustainable Fashion Marketplace</p>
        
        <div class="qr-container">
            <div class="qr-box">
                <h3>📱 Mobile QR Code</h3>
                <img src="${qrCodeDataUrl}" alt="EcoCloset QR Code" />
                <div class="url">${websiteUrl}</div>
                <a href="${qrCodeDataUrl}" download="ecocloset-qr-300px.png" class="download-btn">
                    📥 Download QR Code
                </a>
            </div>
            
            <div class="qr-box">
                <h3>🖨️ High Quality QR Code</h3>
                <img src="${qrCodeDataUrlLarge}" alt="EcoCloset QR Code Large" />
                <div class="url">${websiteUrl}</div>
                <a href="${qrCodeDataUrlLarge}" download="ecocloset-qr-500px.png" class="download-btn">
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
                <li>📱 Responsive Design</li>
                <li>🎁 Complete Marketplace Features</li>
            </ul>
        </div>
    </div>
</body>
</html>`;

    // Write HTML file
    const fs = require('fs');
    fs.writeFileSync('ecocloset-qr.html', htmlContent);
    
    console.log('✅ QR Code generated successfully!');
    console.log('📱 Open ecocloset-qr.html to view and download QR codes');
    console.log('🌐 QR Code links to:', websiteUrl);
    console.log('');
    console.log('📋 QR Code Details:');
    console.log('   • Size: 300px and 500px versions');
    console.log('   • Color: Green theme (#16a34a)');
    console.log('   • Format: PNG (Data URL)');
    console.log('   • Ready for mobile scanning');
    
  } catch (error) {
    console.error('❌ Error generating QR code:', error);
  }
}

generateQRCode();
