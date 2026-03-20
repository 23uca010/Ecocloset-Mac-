-- Create tables for EcoCloset application

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Items table
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price DECIMAL(10, 2),
  original_price DECIMAL(10, 2),
  condition TEXT,
  size TEXT,
  color TEXT,
  type TEXT CHECK (type IN ('sell', 'swap', 'donation')),
  image_url TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  location TEXT,
  rating DECIMAL(2, 1),
  reviews INTEGER DEFAULT 0,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- NGOs table
CREATE TABLE ngos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  location TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  image_url TEXT,
  rating DECIMAL(2, 1),
  total_donations INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  impact TEXT,
  founded INTEGER,
  projects INTEGER DEFAULT 0,
  beneficiaries INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Donations table
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ngo_id UUID REFERENCES ngos(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  quantity INTEGER DEFAULT 1,
  pickup_address TEXT,
  pickup_date DATE,
  pickup_time TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Swaps table
CREATE TABLE swaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_requested_id UUID REFERENCES items(id) ON DELETE CASCADE,
  item_offered_id UUID REFERENCES items(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_items_owner_id ON items(owner_id);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_ngo_id ON donations(ngo_id);
CREATE INDEX idx_swaps_requester_id ON swaps(requester_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE swaps ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Anyone can view items
CREATE POLICY "Items are viewable by everyone" ON items
  FOR SELECT USING (true);

-- Users can insert their own items
CREATE POLICY "Users can insert own items" ON items
  FOR INSERT WITH CHECK (auth.uid()::text = owner_id::text);

-- Users can update their own items
CREATE POLICY "Users can update own items" ON items
  FOR UPDATE USING (auth.uid()::text = owner_id::text);

-- Users can delete their own items
CREATE POLICY "Users can delete own items" ON items
  FOR DELETE USING (auth.uid()::text = owner_id::text);

-- Anyone can view NGOs
CREATE POLICY "NGOs are viewable by everyone" ON ngos
  FOR SELECT USING (true);

-- Users can view their own donations
CREATE POLICY "Users can view own donations" ON donations
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can insert their own donations
CREATE POLICY "Users can insert own donations" ON donations
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Users can update their own donations
CREATE POLICY "Users can update own donations" ON donations
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Users can view their own swaps
CREATE POLICY "Users can view own swaps" ON swaps
  FOR SELECT USING (auth.uid()::text = requester_id::text);

-- Users can insert their own swaps
CREATE POLICY "Users can insert own swaps" ON swaps
  FOR INSERT WITH CHECK (auth.uid()::text = requester_id::text);

-- Users can update their own swaps
CREATE POLICY "Users can update own swaps" ON swaps
  FOR UPDATE USING (auth.uid()::text = requester_id::text);

-- Insert sample NGOs
INSERT INTO ngos (name, description, category, location, phone, email, website, image_url, rating, total_donations, verified, impact, founded, projects, beneficiaries) VALUES
('Green Earth Foundation', 'Leading environmental organization focused on sustainable fashion and textile recycling.', 'Environment', 'Mumbai, Maharashtra', '+91 98765 43210', 'contact@greenearth.org', 'https://greenearth.org', 'https://images.unsplash.com/photo-1542601906990-b4d3b819a5b?w=600&h=400&fit=crop', 4.8, 15420, true, '50,000+ clothes recycled', 2010, 127, 15000),
('Helping Hands NGO', 'Dedicated to providing clothing to underprivileged communities across India.', 'Social Welfare', 'Delhi, NCR', '+91 98765 43211', 'info@helpinghands.org', 'https://helpinghands.org', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a5a?w=600&h=400&fit=crop', 4.9, 23100, true, '100,000+ people helped', 2008, 89, 25000),
('Women Empowerment Initiative', 'Empowering women through sustainable fashion and skill development programs.', 'Women Empowerment', 'Bangalore, Karnataka', '+91 98765 43212', 'contact@womenempower.org', 'https://womenempower.org', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop', 4.7, 12300, true, '25,000+ women trained', 2015, 67, 12000),
('Rural Development Trust', 'Working towards sustainable development in rural communities through fashion initiatives.', 'Rural Development', 'Pune, Maharashtra', '+91 98765 43213', 'info@ruraltrust.org', 'https://ruraltrust.org', 'https://images.unsplash.com/photo-1488520578282-53a7b62436b7?w=600&h=400&fit=crop', 4.6, 18900, true, '75,000+ rural families supported', 2012, 156, 50000),
('Children''s Future Foundation', 'Providing clothing and education support to underprivileged children.', 'Children Welfare', 'Chennai, Tamil Nadu', '+91 98765 43214', 'contact@childrensfuture.org', 'https://childrensfuture.org', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop', 4.9, 31200, true, '200,000+ children supported', 2011, 78, 8000),
('Sustainable Fashion Collective', 'Promoting sustainable fashion practices and textile recycling initiatives.', 'Environment', 'Kolkata, West Bengal', '+91 98765 43215', 'info@sustainablefashion.org', 'https://sustainablefashion.org', 'https://images.unsplash.com/photo-1441986300917-64674bd1d488?w=600&h=400&fit=crop', 4.5, 8900, true, '30,000+ kg textiles recycled', 2016, 45, 5000);
