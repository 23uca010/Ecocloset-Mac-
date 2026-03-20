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
    
    if (items.length === 0) {
      console.log('❌ No items found in database!');
      return;
    }
    
    let updatedCount = 0;
    let errorCount = 0;
    
    // Update each item with random Indian price
    for (const item of items) {
      try {
        const indianPrice = generateIndianPrice();
        
        const result = await Item.findByIdAndUpdate(item._id, { 
          price: indianPrice 
        });
        
        if (result) {
          updatedCount++;
          console.log(`✅ Updated item ${item._id}: ${item.title} -> ₹${indianPrice}`);
        } else {
          errorCount++;
          console.log(`❌ Failed to update item ${item._id}: ${item.title}`);
        }
        
        // Show progress for every 10 items
        if (updatedCount % 10 === 0) {
          console.log(`✅ Progress: ${updatedCount}/${items.length} items updated...`);
        }
        
      } catch (error) {
        errorCount++;
        console.log(`❌ Error updating item ${item._id}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Update Summary:`);
    console.log(`   ✅ Successfully updated: ${updatedCount} items`);
    console.log(`   ❌ Failed to update: ${errorCount} items`);
    console.log(`   📊 Total processed: ${items.length} items`);
    console.log('💰 Price range: ₹500 - ₹2,500');
    
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
