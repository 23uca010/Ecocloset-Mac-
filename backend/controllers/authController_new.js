const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabaseClient');
const { uploadSingle, handleUploadError, getFileUrl } = require('../middleware/upload');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Register user
const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone, address, role } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.'
      });
    }

    // Check if user already exists in Supabase
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('email, username')
      .or('email.eq.' + email + ',username.eq.' + username)
      .limit(1);

    if (checkError) {
      console.error('Error checking existing user:', checkError);
      return res.status(500).json({
        success: false,
        message: 'Database error. Please try again.'
      });
    }

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists.'
      });
    }

    // Create new user in Supabase
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          first_name: firstName,
          last_name: lastName,
          phone: phone || '',
          address: address || '',
          role: role || 'user'
        }
      }
    });

    if (signUpError) {
      console.error('Supabase signup error:', signUpError);
      return res.status(400).json({
        success: false,
        message: signUpError.message || 'Registration failed. Please try again.'
      });
    }

    // Create user profile in database
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email,
        username,
        first_name: firstName,
        last_name: lastName,
        phone: phone || '',
        address: address || '',
        role: role || 'user',
        created_at: new Date().toISOString()
      }])
      .select();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return res.status(500).json({
        success: false,
        message: 'Profile creation failed. Please try again.'
      });
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        username,
        firstName,
        lastName,
        phone,
        address,
        role: role || 'user'
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    // For Supabase, we need email format
    const email = username.includes('@') ? username : `${username}@ecocloset.local`;

    // Authenticate with Supabase
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      console.error('Supabase signin error:', signInError);
      return res.status(401).json({
        success: false,
        message: signInError.message || 'Invalid credentials. Please try again.'
      });
    }

    // Get user profile from database
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return res.status(500).json({
        success: false,
        message: 'Error fetching user profile.'
      });
    }

    const token = generateToken(authData.user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: profileData.id,
        email: profileData.email,
        username: profileData.username,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        phone: profileData.phone,
        address: profileData.address,
        role: profileData.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: profileData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching profile.'
      });
    }

    if (!profileData) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: profileData.id,
        email: profileData.email,
        username: profileData.username,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        phone: profileData.phone,
        address: profileData.address,
        role: profileData.role
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, phone, address } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating profile.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: data[0]
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Upload profile image
const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.userId;

    uploadSingle(req, res, 'profile', async (filename) => {
      if (!filename) return;

      const imageUrl = getFileUrl(filename);

      const { data, error } = await supabase
        .from('users')
        .update({ profile_image: imageUrl })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Image upload error:', error);
        return res.status(500).json({
          success: false,
          message: 'Error uploading image.'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Profile image updated successfully!',
        profileImage: imageUrl
      });
    });

  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password.'
      });
    }

    // Verify current password with Supabase
    const { data: { user }, error: verifyError } = await supabase.auth.signInWithPassword({
      email: req.user.email,
      password: currentPassword
    });

    if (verifyError) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    // Update password in Supabase
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      console.error('Password update error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Error updating password.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password updated successfully!'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  uploadProfileImage,
  changePassword
};
