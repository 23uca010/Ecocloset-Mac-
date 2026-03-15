const express = require("express");
const cors = require("cors");
const path = require("path");
const { supabase } = require('./config/supabaseClientDirect');
require("dotenv").config();

// Import only working routes
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Routes
app.get("/", (req, res) => {
  res.send("EcoCloset Backend API Running with Supabase");
});

// Base API route
app.get("/api", (req, res) => {
  res.json({
    success: true,
    service: "EcoCloset",
    version: "2.0.0",
    database: "Supabase",
    status: "running",
    description: "Sustainable Fashion Marketplace API",
    endpoints: {
      auth: "/api/auth",
      items: "/api/items"
    },
  });
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database: Supabase`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
