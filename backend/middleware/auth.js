const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabaseClient');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user profile from SQLite
    const db = require('../config/database');
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.userId);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      location: user.location,
      role: 'user', // Default for now
      isVerified: true
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error in authentication.' 
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user profile from SQLite
      const db = require('../config/database');
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.userId);

      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          location: user.location,
          role: 'user',
          isVerified: true
        };
      }
    }
    
    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
};

// Check if user owns resource or is admin
const checkOwnershipOrAdmin = (resourceField = 'owner') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required.' 
        });
      }

      // Admin can access everything
      if (req.user.role === 'admin') {
        return next();
      }

      // For item ownership, we still use Supabase for items for now,
      // but we compare owner_id with req.user.id (from SQLite)
      if (resourceField === 'owner') {
        const { data: itemData, error } = await supabase
          .from('items')
          .select('owner_id')
          .eq('id', req.params.id)
          .single();

        if (error || !itemData) {
          return res.status(404).json({ 
            success: false, 
            message: 'Item not found.' 
          });
        }

        if (itemData.owner_id !== req.user.id) {
          return res.status(403).json({ 
            success: false, 
            message: 'Access denied. You can only access your own resources.' 
          });
        }
      }

      next();
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error in authorization check.' 
      });
    }
  };
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  checkOwnershipOrAdmin
};
