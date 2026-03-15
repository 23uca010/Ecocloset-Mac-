const mongoose = require('mongoose');
const Item = require('./models/Item');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecocloset');

// Verify prices were updated correctly
async function verifyPrices() {
  try {
    console.log('🔍 Verifying price updates in database...');
    
    // Get all items to check prices
    const items = await Item.find({});
    console.log(`📦 Found ${items.length} items in database`);
    
    if (items.length === 0) {
      console.log('❌ No items found in database!');
      return;
    }
    
    // Check price ranges
    let minPrice = Infinity;
    let maxPrice = 0;
    let itemsWithoutPrice = 0;
    let itemsWithPrice = 0;
    
    items.forEach(item => {
      if (!item.price || item.price === 0) {
        itemsWithoutPrice++;
      } else {
        itemsWithPrice++;
        if (item.price < minPrice) minPrice = item.price;
        if (item.price > maxPrice) maxPrice = item.price;
      }
    });
    
    console.log(`\n📊 Price Analysis:`);
    console.log(`   Items with price: ${itemsWithPrice}`);
    console.log(`   Items without price: ${itemsWithoutPrice}`);
    console.log(`   Minimum price: ₹${minPrice}`);
    console.log(`   Maximum price: ₹${maxPrice}`);
    
    // Show first 5 items with prices
    console.log(`\n📋 First 5 items with prices:`);
    items.slice(0, 5).forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.title}: ₹${item.price}`);
    });
    
    // Check if prices are in expected range
    const inRange = minPrice >= 500 && maxPrice <= 2500;
    console.log(`\n✅ Price range check: ${inRange ? '✅ IN RANGE (₹500-₹2500)' : '❌ OUT OF RANGE'}`);
    
    if (itemsWithoutPrice > 0) {
      console.log(`\n⚠️ Warning: ${itemsWithoutPrice} items still don't have prices!`);
    }
    
    console.log('\n🌐 Test these items in browser:');
    console.log('   http://localhost:3000/items');
    console.log('   http://localhost:5000/api/items');
    
  } catch (error) {
    console.error('❌ Error verifying prices:', error);
  } finally {
    // Close database connection
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run verification
verifyPrices();
