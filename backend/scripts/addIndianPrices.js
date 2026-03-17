const mongoose = require('mongoose');
const Item = require('./models/Item');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecocloset');

// Generate random price in Indian Rupees
function generateIndianPrice() {
  // Random price between ₹299 and ₹9999
  const basePrice = Math.floor(Math.random() * 9700) + 299;
  
  // Round to nearest 50
  const roundedPrice = Math.round(basePrice / 50) * 50;
  
  return roundedPrice;
}

// Update all items with Indian prices
async function updateItemPrices() {
  try {
    console.log('🔄 Updating all items with Indian Rupee prices...');
    
    // Get all items
    const items = await Item.find({});
    console.log(`📦 Found ${items.length} items to update`);
    
    let updatedCount = 0;
    
    // Update each item with random Indian price
    for (const item of items) {
      const indianPrice = generateIndianPrice();
      
      await Item.findByIdAndUpdate(item._id, { 
        price: indianPrice 
      });
      
      updatedCount++;
      
      // Show progress for every 10 items
      if (updatedCount % 10 === 0) {
        console.log(`✅ Updated ${updatedCount}/${items.length} items...`);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} items with Indian Rupee prices!`);
    console.log('💰 Price range: ₹299 - ₹9,999');
    console.log('📊 Price distribution:');
    
    // Show price distribution
    const priceRanges = {
      '₹299-₹999': 0,
      '₹1000-₹2999': 0,
      '₹3000-₹4999': 0,
      '₹5000-₹6999': 0,
      '₹7000-₹9999': 0
    };
    
    const updatedItems = await Item.find({});
    updatedItems.forEach(item => {
      if (item.price >= 299 && item.price <= 999) priceRanges['₹299-₹999']++;
      else if (item.price >= 1000 && item.price <= 2999) priceRanges['₹1000-₹2999']++;
      else if (item.price >= 3000 && item.price <= 4999) priceRanges['₹3000-₹4999']++;
      else if (item.price >= 5000 && item.price <= 6999) priceRanges['₹5000-₹6999']++;
      else if (item.price >= 7000 && item.price <= 9999) priceRanges['₹7000-₹9999']++;
    });
    
    Object.entries(priceRanges).forEach(([range, count]) => {
      console.log(`   ${range}: ${count} items`);
    });
    
    console.log('\n🌱 EcoCloset items now have realistic Indian pricing!');
    
  } catch (error) {
    console.error('❌ Error updating item prices:', error);
  } finally {
    // Close database connection
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the update
updateItemPrices();
