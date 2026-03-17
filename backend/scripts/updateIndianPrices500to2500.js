const mongoose = require('mongoose');
const Item = require('./models/Item');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecocloset');

// Generate random price in Indian Rupees (₹500-₹2500 range)
function generateIndianPrice() {
  // Random price between ₹500 and ₹2500
  const basePrice = Math.floor(Math.random() * 2000) + 500;
  
  // Round to nearest 50
  const roundedPrice = Math.round(basePrice / 50) * 50;
  
  return roundedPrice;
}

// Update all items with Indian prices (₹500-₹2500 range)
async function updateItemPrices() {
  try {
    console.log('🔄 Updating all items with Indian Rupee prices (₹500-₹2500 range)...');
    
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
    console.log('💰 Price range: ₹500 - ₹2,500');
    console.log('📊 Price distribution:');
    
    // Show price distribution
    const priceRanges = {
      '₹500-₹999': 0,
      '₹1000-₹1499': 0,
      '₹1500-₹1999': 0,
      '₹2000-₹2500': 0
    };
    
    const updatedItems = await Item.find({});
    updatedItems.forEach(item => {
      if (item.price >= 500 && item.price <= 999) priceRanges['₹500-₹999']++;
      else if (item.price >= 1000 && item.price <= 1499) priceRanges['₹1000-₹1499']++;
      else if (item.price >= 1500 && item.price <= 1999) priceRanges['₹1500-₹1999']++;
      else if (item.price >= 2000 && item.price <= 2500) priceRanges['₹2000-₹2500']++;
    });
    
    Object.entries(priceRanges).forEach(([range, count]) => {
      console.log(`   ${range}: ${count} items`);
    });
    
    console.log('\n🌱 EcoCloset items now have Indian pricing in ₹500-₹2500 range!');
    console.log('💵 Perfect for affordable sustainable fashion in Indian market!');
    
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
