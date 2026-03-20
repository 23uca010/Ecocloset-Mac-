const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Item = require('./models/Item');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecocloset")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

async function addSampleItems() {
  try {
    // First, create a sample user if not exists
    let user = await User.findOne({ email: 'demo@ecocloset.com' });
    
    if (!user) {
      // Create user without password hashing for demo
      user = new User({
        username: 'demouser',
        email: 'demo@ecocloset.com',
        password: 'demo123', // Will be hashed later
        firstName: 'Demo',
        lastName: 'User',
        role: 'user'
      });
      
      // Manually hash the password to avoid the pre-save hook issue
      const bcrypt = require('bcryptjs');
      const salt = bcrypt.genSaltSync(12);
      user.password = bcrypt.hashSync('demo123', salt);
      
      // Save user without triggering the pre-save hook
      await user.save({ validateBeforeSave: false });
      console.log('Demo user created');
    }

    // Sample items data with correct enum values
    const sampleItems = [
      {
        title: "Vintage Denim Jacket",
        description: "Classic blue denim jacket in excellent condition. Perfect for casual wear and sustainable fashion.",
        category: "jackets",
        size: "m",
        condition: "like_new",
        type: "both",
        brand: "Levi's",
        materials: ["denim", "cotton"],
        color: "blue",
        sustainabilityScore: 8,
        images: ["https://images.unsplash.com/photo-1594634314056-718b1cd5c5c5?w=400"],
        owner: user._id,
        tags: ["vintage", "denim", "casual", "sustainable"],
        status: "available"
      },
      {
        title: "Floral Summer Dress",
        description: "Beautiful floral print dress perfect for summer occasions. Made from sustainable materials.",
        category: "dresses",
        size: "s",
        condition: "good",
        type: "swap",
        brand: "Zara",
        materials: ["cotton", "polyester"],
        color: "floral",
        sustainabilityScore: 7,
        images: ["https://images.unsplash.com/photo-1594634314056-718b1cd5c5c5?w=400"],
        owner: user._id,
        tags: ["dress", "summer", "floral", "casual"],
        status: "available"
      },
      {
        title: "Organic Cotton T-Shirt",
        description: "Comfortable organic cotton t-shirt. Great for everyday wear with environmental benefits.",
        category: "shirts",
        size: "l",
        condition: "like_new",
        type: "donation",
        brand: "Patagonia",
        materials: ["organic_cotton"],
        color: "white",
        sustainabilityScore: 9,
        images: ["https://images.unsplash.com/photo-1594634314056-718b1cd5c5c5?w=400"],
        owner: user._id,
        tags: ["t-shirt", "organic", "sustainable", "casual"],
        status: "available"
      },
      {
        title: "Wool Winter Coat",
        description: "Warm wool coat perfect for winter. High quality and sustainable choice for cold weather.",
        category: "jackets",
        size: "m",
        condition: "like_new",
        type: "both",
        brand: "H&M",
        materials: ["wool", "polyester"],
        color: "black",
        sustainabilityScore: 8,
        images: ["https://images.unsplash.com/photo-1594634314056-718b1cd5c5c5?w=400"],
        owner: user._id,
        tags: ["coat", "winter", "warm", "sustainable"],
        status: "available"
      },
      {
        title: "Canvas Sneakers",
        description: "Comfortable canvas sneakers in great condition. Perfect for sustainable footwear choice.",
        category: "shoes",
        size: "custom",
        condition: "good",
        type: "swap",
        brand: "Converse",
        materials: ["canvas", "rubber"],
        color: "white",
        sustainabilityScore: 7,
        images: ["https://images.unsplash.com/photo-1594634314056-718b1cd5c5c5?w=400"],
        owner: user._id,
        tags: ["sneakers", "canvas", "casual", "sustainable"],
        status: "available"
      },
      {
        title: "Leather Handbag",
        description: "Elegant leather handbag in excellent condition. Timeless piece for sustainable fashion.",
        category: "accessories",
        size: "custom",
        condition: "like_new",
        type: "both",
        brand: "Coach",
        materials: ["leather"],
        color: "brown",
        sustainabilityScore: 6,
        images: ["https://images.unsplash.com/photo-1594634314056-718b1cd5c5c5?w=400"],
        owner: user._id,
        tags: ["handbag", "leather", "elegant", "sustainable"],
        status: "available"
      }
    ];

    // Add items to database
    for (const itemData of sampleItems) {
      const item = new Item(itemData);
      await item.save();
      console.log(`Added item: ${item.title}`);
    }

    console.log('Sample items added successfully!');
    console.log(`Total items in database: ${await Item.countDocuments()}`);

  } catch (error) {
    console.error('Error adding sample items:', error);
  } finally {
    mongoose.disconnect();
  }
}

addSampleItems();
