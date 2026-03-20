const { supabase } = require('./config/supabaseClient');

// SQL to create required tables
const createTablesSQL = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone TEXT,
  address TEXT,
  role VARCHAR(50) DEFAULT 'user',
  profile_image TEXT,
  isVerified BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  size VARCHAR(50),
  color VARCHAR(50),
  condition VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL,
  images TEXT[],
  owner_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id),
  donor_id UUID REFERENCES users(id),
  ngo_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create swap_requests table
CREATE TABLE IF NOT EXISTS swap_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_item_id UUID REFERENCES items(id),
  owner_item_id UUID REFERENCES items(id),
  requester_id UUID REFERENCES users(id),
  owner_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing Supabase database...');
    
    // Note: In a real scenario, you would run this SQL in Supabase dashboard
    // For now, we'll test basic connectivity
    
    // Test users table access
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count')
      .single();

    if (usersError) {
      console.log('⚠️  Users table may not exist:', usersError.message);
      console.log('📝  Please run the SQL in your Supabase dashboard');
    } else {
      console.log('✅ Users table accessible');
    }

    // Test items table access
    const { data: itemsData, error: itemsError } = await supabase
      .from('items')
      .select('count')
      .single();

    if (itemsError) {
      console.log('⚠️  Items table may not exist:', itemsError.message);
      console.log('📝  Please run the SQL in your Supabase dashboard');
    } else {
      console.log('✅ Items table accessible');
    }

    console.log('\n📋 SQL to run in Supabase Dashboard:');
    console.log('=====================================');
    console.log(createTablesSQL);
    console.log('=====================================');
    
    console.log('\n🌐 Database Connection Status:');
    console.log('✅ Supabase client initialized');
    console.log('✅ Database connectivity tested');
    
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// Run initialization
initializeDatabase();
