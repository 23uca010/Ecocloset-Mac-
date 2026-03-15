// NGO Images Data - Colorful placeholder images for NGOs
export const ngoImages = {
  "Green Earth Foundation": {
    primaryColor: "#2E7D32",
    secondaryColor: "#81C784",
    accentColor: "#4CAF50",
    icon: "G",
    style: "gradient-green",
    description: "Environmental sustainability focus"
  },
  "Helping Hands NGO": {
    primaryColor: "#1976D2",
    secondaryColor: "#64B5F6",
    accentColor: "#2196F3",
    icon: "H",
    style: "gradient-blue",
    description: "Social welfare and community support"
  },
  "Women Empowerment Initiative": {
    primaryColor: "#E91E63",
    secondaryColor: "#F06292",
    accentColor: "#FF4081",
    icon: "W",
    style: "gradient-pink",
    description: "Women's rights and empowerment"
  },
  "Rural Development Trust": {
    primaryColor: "#FF6F00",
    secondaryColor: "#FFB74D",
    accentColor: "#FF9800",
    icon: "R",
    style: "gradient-orange",
    description: "Rural development and agriculture"
  },
  "Children's Future Foundation": {
    primaryColor: "#7B1FA2",
    secondaryColor: "#BA68C8",
    accentColor: "#9C27B0",
    icon: "C",
    style: "gradient-purple",
    description: "Children welfare and education"
  },
  "Sustainable Fashion Collective": {
    primaryColor: "#00695C",
    secondaryColor: "#4DB6AC",
    accentColor: "#009688",
    icon: "S",
    style: "gradient-teal",
    description: "Sustainable fashion and recycling"
  }
};

// Generate SVG images for NGOs
export const generateNGOImage = (ngoName, width = 300, height = 200) => {
  const ngo = ngoImages[ngoName];
  if (!ngo) return null;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${ngoName.replace(/\s+/g, '-')}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${ngo.primaryColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${ngo.secondaryColor};stop-opacity:1" />
        </linearGradient>
        <pattern id="pattern-${ngoName.replace(/\s+/g, '-')}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="2" fill="${ngo.accentColor}" opacity="0.3"/>
          <circle cx="10" cy="10" r="1" fill="${ngo.accentColor}" opacity="0.5"/>
          <circle cx="30" cy="30" r="1" fill="${ngo.accentColor}" opacity="0.5"/>
        </pattern>
      </defs>
      
      <!-- Background with gradient -->
      <rect width="${width}" height="${height}" fill="url(#grad-${ngoName.replace(/\s+/g, '-')})"/>
      
      <!-- Pattern overlay -->
      <rect width="${width}" height="${height}" fill="url(#pattern-${ngoName.replace(/\s+/g, '-')})"/>
      
      <!-- Icon circle -->
      <circle cx="${width/2}" cy="${height/2 - 20}" r="40" fill="white" opacity="0.9"/>
      <circle cx="${width/2}" cy="${height/2 - 20}" r="35" fill="${ngo.primaryColor}" opacity="0.1"/>
      
      <!-- Icon text -->
      <text x="${width/2}" y="${height/2 - 10}" text-anchor="middle" font-size="30" font-weight="bold" fill="${ngo.primaryColor}">${ngo.icon}</text>
      
      <!-- NGO Name -->
      <text x="${width/2}" y="${height/2 + 25}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white">
        ${ngoName.split(' ').slice(0, 2).join(' ')}
      </text>
      
      <!-- Description -->
      <text x="${width/2}" y="${height/2 + 45}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="white" opacity="0.8">
        ${ngo.description}
      </text>
      
      <!-- Decorative elements -->
      <circle cx="20" cy="20" r="15" fill="${ngo.accentColor}" opacity="0.2"/>
      <circle cx="${width - 20}" cy="${height - 20}" r="20" fill="${ngo.accentColor}" opacity="0.2"/>
      <rect x="10" y="${height - 30}" width="60" height="3" fill="white" opacity="0.3"/>
      <rect x="${width - 70}" y="10" width="60" height="3" fill="white" opacity="0.3"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Export a function to get all NGO images
export const getAllNGOImages = () => {
  const images = {};
  Object.keys(ngoImages).forEach(ngoName => {
    images[ngoName] = generateNGOImage(ngoName);
  });
  return images;
};
