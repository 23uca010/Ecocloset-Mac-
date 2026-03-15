const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { supabase } = require('./config/supabaseClient');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Supabase connection
supabase.from('users').select('count').single()
  .then(({ data, error }) => {
    if (!error) {
      console.log('✅ Backend Supabase connection successful');
    } else {
      console.error('❌ Backend Supabase connection failed:', error.message);
    }
  })
  .catch(err => {
    console.error('❌ Backend Supabase client error:', err);
  });

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic routes
app.get("/", (req, res) => {
  res.send("EcoCloset Backend API Running with Supabase - Connected!");
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    service: "EcoCloset",
    version: "2.0.0",
    database: "Supabase",
    status: "running",
    supabase: "connected",
    description: "Sustainable Fashion Marketplace API",
    endpoints: {
      auth: "/api/auth",
      items: "/api/items",
      swaps: "/api/swaps", 
      donations: "/api/donations",
      admin: "/api/admin",
      ngo: "/api/ngo"
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: Supabase Connected`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
});
