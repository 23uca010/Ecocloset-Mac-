// Realistic NGO Images Generator using Canvas API
export const ngoImageData = {
  "Green Earth Foundation": {
    primaryColor: "#2E7D32",
    secondaryColor: "#81C784",
    accentColor: "#4CAF50",
    icon: "🌍",
    pattern: "leaves",
    description: "Environmental sustainability focus"
  },
  "Helping Hands NGO": {
    primaryColor: "#1976D2",
    secondaryColor: "#64B5F6",
    accentColor: "#2196F3",
    icon: "🤝",
    pattern: "hands",
    description: "Social welfare and community support"
  },
  "Women Empowerment Initiative": {
    primaryColor: "#E91E63",
    secondaryColor: "#F06292",
    accentColor: "#FF4081",
    icon: "♀️",
    pattern: "hearts",
    description: "Women's rights and empowerment"
  },
  "Rural Development Trust": {
    primaryColor: "#FF6F00",
    secondaryColor: "#FFB74D",
    accentColor: "#FF9800",
    icon: "🌾",
    pattern: "wheat",
    description: "Rural development and agriculture"
  },
  "Children's Future Foundation": {
    primaryColor: "#7B1FA2",
    secondaryColor: "#BA68C8",
    accentColor: "#9C27B0",
    icon: "👶",
    pattern: "stars",
    description: "Children welfare and education"
  },
  "Sustainable Fashion Collective": {
    primaryColor: "#00695C",
    secondaryColor: "#4DB6AC",
    accentColor: "#009688",
    icon: "♻️",
    pattern: "recycle",
    description: "Sustainable fashion and recycling"
  }
};

// Create gradient on canvas
const createGradient = (ctx, colors, x0, y0, x1, y1) => {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  gradient.addColorStop(0, colors.primaryColor);
  gradient.addColorStop(1, colors.secondaryColor);
  return gradient;
};

// Draw pattern background
const drawPattern = (ctx, pattern, color, width, height) => {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.1;
  
  switch(pattern) {
    case 'leaves':
      // Draw leaf shapes
      for(let i = 0; i < 8; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.ellipse(x, y, 15, 8, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
      }
      break;
    case 'hands':
      // Draw hand shapes
      for(let i = 0; i < 6; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fill();
      }
      break;
    case 'hearts':
      // Draw heart shapes
      for(let i = 0; i < 10; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.moveTo(x, y + 5);
        ctx.bezierCurveTo(x, y, x - 5, y, x - 5, y + 5);
        ctx.bezierCurveTo(x - 5, y + 10, x, y + 15, x, y + 15);
        ctx.bezierCurveTo(x, y + 15, x + 5, y + 10, x + 5, y + 5);
        ctx.bezierCurveTo(x + 5, y, x, y, x, y + 5);
        ctx.fill();
      }
      break;
    case 'wheat':
      // Draw wheat shapes
      for(let i = 0; i < 12; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - 15);
        ctx.lineTo(x - 3, y - 12);
        ctx.moveTo(x, y - 15);
        ctx.lineTo(x + 3, y - 12);
        ctx.stroke();
      }
      break;
    case 'stars':
      // Draw star shapes
      for(let i = 0; i < 8; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        drawStar(ctx, x, y, 5, 10, 5);
      }
      break;
    case 'recycle':
      // Draw recycle arrows
      for(let i = 0; i < 6; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 1.5);
        ctx.stroke();
      }
      break;
  }
  
  ctx.globalAlpha = 1;
};

// Draw star shape
const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
};

// Generate realistic NGO image using Canvas
export const generateRealisticNGOImage = (ngoName, width = 300, height = 200) => {
  const ngo = ngoImageData[ngoName];
  if (!ngo) return null;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Create gradient background
  const gradient = createGradient(ctx, ngo, 0, 0, width, height);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add pattern overlay
  drawPattern(ctx, ngo.pattern, ngo.accentColor, width, height);

  // Add decorative circles
  ctx.fillStyle = ngo.accentColor;
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.arc(30, 30, 25, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width - 30, height - 30, 30, 0, 2 * Math.PI);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Main icon circle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(width / 2, height / 2 - 20, 45, 0, 2 * Math.PI);
  ctx.fill();

  // Inner circle with gradient
  const innerGradient = createGradient(ctx, ngo, width / 2 - 35, height / 2 - 55, width / 2 + 35, height / 2 + 15);
  ctx.fillStyle = innerGradient;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2 - 20, 40, 0, 2 * Math.PI);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Draw icon symbol (using text instead of emoji to avoid encoding issues)
  ctx.fillStyle = ngo.primaryColor;
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Use first letter of NGO name as icon
  const iconLetter = ngoName.charAt(0);
  ctx.fillText(iconLetter, width / 2, height / 2 - 20);

  // Add NGO name
  ctx.fillStyle = 'white';
  ctx.font = 'bold 16px Arial';
  const displayName = ngoName.length > 20 ? ngoName.substring(0, 17) + '...' : ngoName;
  ctx.fillText(displayName, width / 2, height / 2 + 25);

  // Add description
  ctx.font = '12px Arial';
  ctx.globalAlpha = 0.9;
  const displayDesc = ngo.description.length > 30 ? ngo.description.substring(0, 27) + '...' : ngo.description;
  ctx.fillText(displayDesc, width / 2, height / 2 + 45);
  ctx.globalAlpha = 1;

  // Add decorative elements
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(15, height - 25);
  ctx.lineTo(75, height - 25);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(width - 75, 15);
  ctx.lineTo(width - 15, 15);
  ctx.stroke();

  // Convert canvas to data URL
  return canvas.toDataURL('image/png');
};

// Generate all NGO images
export const generateAllNGOImages = () => {
  const images = {};
  Object.keys(ngoImageData).forEach(ngoName => {
    images[ngoName] = generateRealisticNGOImage(ngoName);
  });
  return images;
};
