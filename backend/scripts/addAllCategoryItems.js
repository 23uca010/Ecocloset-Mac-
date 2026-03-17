const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Item = require('./models/Item');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecocloset")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

async function addAllCategoryItems() {
  try {
    // Get or create demo user
    let user = await User.findOne({ email: 'demo@ecocloset.com' });
    
    if (!user) {
      const bcrypt = require('bcryptjs');
      const salt = bcrypt.genSaltSync(12);
      
      user = new User({
        username: 'demouser',
        email: 'demo@ecocloset.com',
        password: bcrypt.hashSync('demo123', salt),
        firstName: 'Demo',
        lastName: 'User',
        role: 'user'
      });
      
      await user.save({ validateBeforeSave: false });
      console.log('Demo user created');
    }

    // Comprehensive items for all categories
    const allCategoryItems = [
      // SHIRTS
      {
        title: "Classic White Oxford Shirt",
        description: "Timeless white oxford shirt perfect for professional and casual wear. Made from sustainable cotton.",
        category: "shirts",
        size: "m",
        condition: "like_new",
        type: "both",
        brand: "Brooks Brothers",
        materials: ["organic_cotton"],
        color: "white",
        sustainabilityScore: 9,
        images: ["https://images.unsplash.com/photo-1596755094587-5e0244e83d2e?w=400"],
        owner: user._id,
        tags: ["formal", "classic", "sustainable", "versatile"],
        status: "available"
      },
      {
        title: "Vintage Band T-Shirt",
        description: "Classic rock band t-shirt from the 90s. Great condition with minimal wear.",
        category: "shirts",
        size: "l",
        condition: "good",
        type: "swap",
        brand: "Various",
        materials: ["cotton"],
        color: "black",
        sustainabilityScore: 8,
        images: ["https://images.unsplash.com/photo-1521572163464-7535f5453c2a?w=400"],
        owner: user._id,
        tags: ["vintage", "band", "casual", "retro"],
        status: "available"
      },
      {
        title: "Linen Summer Shirt",
        description: "Breathable linen shirt perfect for hot weather. Natural fibers and eco-friendly.",
        category: "shirts",
        size: "s",
        condition: "new",
        type: "both",
        brand: "Uniqlo",
        materials: ["linen"],
        color: "beige",
        sustainabilityScore: 10,
        images: ["https://images.unsplash.com/photo-1594933886957-4f5b5c6d1c2e?w=400"],
        owner: user._id,
        tags: ["summer", "linen", "breathable", "eco-friendly"],
        status: "available"
      },

      // PANTS
      {
        title: "Slim Fit Chino Pants",
        description: "Versatile slim-fit chinos in khaki color. Perfect for office and casual occasions.",
        category: "pants",
        size: "m",
        condition: "like_new",
        type: "both",
        brand: "Dockers",
        materials: ["cotton"],
        color: "khaki",
        sustainabilityScore: 7,
        images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400"],
        owner: user._id,
        tags: ["formal", "versatile", "classic", "comfortable"],
        status: "available"
      },
      {
        title: "Vintage Denim Jeans",
        description: "Classic 501 style denim jeans with authentic vintage wash. Great for sustainable fashion.",
        category: "pants",
        size: "l",
        condition: "good",
        type: "swap",
        brand: "Levi's",
        materials: ["denim", "cotton"],
        color: "blue",
        sustainabilityScore: 9,
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"],
        owner: user._id,
        tags: ["vintage", "denim", "classic", "durable"],
        status: "available"
      },
      {
        title: "Recycled Polyester Joggers",
        description: "Comfortable joggers made from recycled materials. Perfect for lounging and light exercise.",
        category: "pants",
        size: "m",
        condition: "new",
        type: "donation",
        brand: "Patagonia",
        materials: ["recycled_polyester"],
        color: "gray",
        sustainabilityScore: 10,
        images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400"],
        owner: user._id,
        tags: ["recycled", "comfortable", "athletic", "eco-friendly"],
        status: "available"
      },

      // DRESSES
      {
        title: "Floral Summer Maxi Dress",
        description: "Beautiful flowing maxi dress with floral print. Perfect for summer events and beach outings.",
        category: "dresses",
        size: "m",
        condition: "like_new",
        type: "both",
        brand: "Free People",
        materials: ["rayon", "cotton"],
        color: "floral",
        sustainabilityScore: 7,
        images: ["https://images.unsplash.com/photo-1539008895308-32bf5c846a2c?w=400"],
        owner: user._id,
        tags: ["summer", "floral", "bohemian", "comfortable"],
        status: "available"
      },
      {
        title: "Little Black Dress",
        description: "Timeless little black dress perfect for formal occasions. Classic and elegant design.",
        category: "dresses",
        size: "s",
        condition: "like_new",
        type: "swap",
        brand: "Zara",
        materials: ["polyester", "spandex"],
        color: "black",
        sustainabilityScore: 6,
        images: ["https://images.unsplash.com/photo-1539008895308-32bf5c846a2c?w=400"],
        owner: user._id,
        tags: ["formal", "classic", "elegant", "versatile"],
        status: "available"
      },
      {
        title: "Organic Cotton Sundress",
        description: "Eco-friendly sundress made from certified organic cotton. Perfect for sustainable summer fashion.",
        category: "dresses",
        size: "l",
        condition: "new",
        type: "donation",
        brand: "Eileen Fisher",
        materials: ["organic_cotton"],
        color: "yellow",
        sustainabilityScore: 10,
        images: ["https://images.unsplash.com/photo-1539008895308-32bf5c846a2c?w=400"],
        owner: user._id,
        tags: ["organic", "summer", "sustainable", "comfortable"],
        status: "available"
      },

      // JACKETS
      {
        title: "Classic Denim Jacket",
        description: "Iconic denim jacket with vintage wash. Perfect layering piece for any season.",
        category: "jackets",
        size: "m",
        condition: "good",
        type: "both",
        brand: "Levi's",
        materials: ["denim", "cotton"],
        color: "blue",
        sustainabilityScore: 8,
        images: ["https://images.unsplash.com/photo-1571651205322-3886f6af25a2?w=400"],
        owner: user._id,
        tags: ["classic", "denim", "versatile", "durable"],
        status: "available"
      },
      {
        title: "Wool Pea Coat",
        description: "Classic navy wool pea coat perfect for winter. Timeless style with excellent warmth.",
        category: "jackets",
        size: "l",
        condition: "like_new",
        type: "swap",
        brand: "J.Crew",
        materials: ["wool", "polyester"],
        color: "navy",
        sustainabilityScore: 7,
        images: ["https://images.unsplash.com/photo-1571651205322-3886f6af25a2?w=400"],
        owner: user._id,
        tags: ["winter", "formal", "classic", "warm"],
        status: "available"
      },
      {
        title: "Recycled Windbreaker",
        description: "Lightweight windbreaker made from recycled materials. Perfect for outdoor activities.",
        category: "jackets",
        size: "s",
        condition: "new",
        type: "donation",
        brand: "Patagonia",
        materials: ["recycled_polyester"],
        color: "green",
        sustainabilityScore: 10,
        images: ["https://images.unsplash.com/photo-1571651205322-3886f6af25a2?w=400"],
        owner: user._id,
        tags: ["recycled", "outdoor", "lightweight", "eco-friendly"],
        status: "available"
      },

      // SHOES
      {
        title: "Classic Canvas Sneakers",
        description: "Timeless canvas sneakers in white color. Comfortable and versatile for everyday wear.",
        category: "shoes",
        size: "custom",
        condition: "good",
        type: "both",
        brand: "Converse",
        materials: ["canvas", "rubber"],
        color: "white",
        sustainabilityScore: 7,
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"],
        owner: user._id,
        tags: ["classic", "casual", "versatile", "comfortable"],
        status: "available"
      },
      {
        title: "Leather Ankle Boots",
        description: "Stylish leather ankle boots perfect for fall and winter. Durable and fashionable.",
        category: "shoes",
        size: "custom",
        condition: "like_new",
        type: "swap",
        brand: "Dr. Martens",
        materials: ["leather"],
        color: "brown",
        sustainabilityScore: 6,
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"],
        owner: user._id,
        tags: ["boots", "leather", "durable", "fashionable"],
        status: "available"
      },
      {
        title: "Recycled Running Shoes",
        description: "Athletic running shoes made from recycled materials. Perfect for eco-conscious runners.",
        category: "shoes",
        size: "custom",
        condition: "new",
        type: "donation",
        brand: "Nike",
        materials: ["recycled_materials", "rubber"],
        color: "multicolor",
        sustainabilityScore: 10,
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"],
        owner: user._id,
        tags: ["recycled", "athletic", "eco-friendly", "performance"],
        status: "available"
      },

      // ACCESSORIES
      {
        title: "Leather Crossbody Bag",
        description: "Elegant leather crossbody bag perfect for daily use. Timeless design with modern functionality.",
        category: "accessories",
        size: "custom",
        condition: "like_new",
        type: "both",
        brand: "Coach",
        materials: ["leather"],
        color: "brown",
        sustainabilityScore: 6,
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"],
        owner: user._id,
        tags: ["leather", "elegant", "practical", "timeless"],
        status: "available"
      },
      {
        title: "Silk Scarf Collection",
        description: "Beautiful silk scarf with artistic print. Perfect accessory for any outfit.",
        category: "accessories",
        size: "custom",
        condition: "like_new",
        type: "swap",
        brand: "Hermès",
        materials: ["silk"],
        color: "multicolor",
        sustainabilityScore: 8,
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"],
        owner: user._id,
        tags: ["silk", "luxury", "artistic", "versatile"],
        status: "available"
      },
      {
        title: "Recycled Tote Bag",
        description: "Eco-friendly tote bag made from recycled materials. Perfect for shopping and daily use.",
        category: "accessories",
        size: "custom",
        condition: "new",
        type: "donation",
        brand: "Baggu",
        materials: ["recycled_materials"],
        color: "black",
        sustainabilityScore: 10,
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"],
        owner: user._id,
        tags: ["recycled", "eco-friendly", "practical", "sustainable"],
        status: "available"
      },

      // OTHER
      {
        title: "Vintage Sunglasses",
        description: "Classic retro-style sunglasses with UV protection. Timeless accessory for any look.",
        category: "other",
        size: "custom",
        condition: "good",
        type: "both",
        brand: "Ray-Ban",
        materials: ["plastic", "glass"],
        color: "black",
        sustainabilityScore: 7,
        images: ["https://images.unsplash.com/photo-1473496659199-fdc835453219?w=400"],
        owner: user._id,
        tags: ["vintage", "accessories", "classic", "uv_protection"],
        status: "available"
      },
      {
        title: "Organic Cotton Belt",
        description: "Sustainable belt made from organic cotton. Perfect for completing any eco-conscious outfit.",
        category: "other",
        size: "custom",
        condition: "new",
        type: "donation",
        brand: "Patagonia",
        materials: ["organic_cotton"],
        color: "brown",
        sustainabilityScore: 10,
        images: ["https://images.unsplash.com/photo-1473496659199-fdc835453219?w=400"],
        owner: user._id,
        tags: ["organic", "sustainable", "accessories", "eco-friendly"],
        status: "available"
      },
      {
        title: "Recycled Watch",
        description: "Modern watch with strap made from recycled materials. Combines style with sustainability.",
        category: "other",
        size: "custom",
        condition: "like_new",
        type: "swap",
        brand: "Nordgreen",
        materials: ["recycled_materials", "stainless_steel"],
        color: "silver",
        sustainabilityScore: 9,
        images: ["https://images.unsplash.com/photo-1473496659199-fdc835453219?w=400"],
        owner: user._id,
        tags: ["recycled", "watch", "accessories", "sustainable"],
        status: "available"
      }
    ];

    // Clear existing items first (optional - comment out if you want to keep existing items)
    await Item.deleteMany({});
    console.log('Cleared existing items');

    // Add all items to database
    let addedCount = 0;
    for (const itemData of allCategoryItems) {
      const item = new Item(itemData);
      await item.save();
      console.log(`Added item: ${item.title} (${item.category})`);
      addedCount++;
    }

    console.log(`\n✅ Successfully added ${addedCount} items across all categories!`);
    console.log(`Total items in database: ${await Item.countDocuments()}`);

    // Show category breakdown
    const categories = ['shirts', 'pants', 'dresses', 'jackets', 'shoes', 'accessories', 'other'];
    console.log('\n📊 Items by category:');
    for (const category of categories) {
      const count = await Item.countDocuments({ category });
      console.log(`${category}: ${count} items`);
    }

  } catch (error) {
    console.error('Error adding items:', error);
  } finally {
    mongoose.disconnect();
  }
}

addAllCategoryItems();
