const { supabase } = require('../config/supabaseClient');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get statistics from Supabase
    const [
      usersResult,
      itemsResult,
      donationsResult
    ] = await Promise.all([
      supabase.from('users').select('count').eq('role', 'user'),
      supabase.from('items').select('count'),
      supabase.from('donations').select('count')
    ]);

    const totalUsers = usersResult.data?.[0]?.count || 0;
    const totalItems = itemsResult.data?.[0]?.count || 0;
    const totalDonations = donationsResult.data?.[0]?.count || 0;

    // Get recent activity
    const [
      recentUsers,
      recentItems,
      pendingDonations
    ] = await Promise.all([
      supabase.from('users').select('*').eq('role', 'user').order('created_at', { ascending: false }).limit(5),
      supabase.from('items').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('donations').select('*').eq('status', 'pending').limit(5)
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalItems,
        totalDonations,
        recentUsers: recentUsers || [],
        recentItems: recentItems || [],
        pendingDonations: pendingDonations?.length || 0
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('users')
      .select('id, username, email, first_name, last_name, role, created_at')
      .eq('role', 'user')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`username.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Get users error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching users.'
      });
    }

    res.status(200).json({
      success: true,
      users: users || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Get all items
const getAllItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('items')
      .select(`
        *,
        owner:users(username, first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: items, error, count } = await query;

    if (error) {
      console.error('Get all items error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching items.'
      });
    }

    res.status(200).json({
      success: true,
      items: items || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get all items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const { data: userData, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (checkError || !userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const { data: updatedData, error: updateError } = await supabase
      .from('users')
      .update({
        role,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (updateError) {
      console.error('Update user role error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Error updating user role.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully!',
      user: updatedData[0]
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Get all users
const getUsers = getAllUsers;

// Get all items
const getAdminItems = getAllItems;

// Stub functions for missing admin features
const getUserById = async (req, res) => res.status(200).json({ success: true, message: 'Coming soon' });
const updateUser = async (req, res) => res.status(200).json({ success: true, message: 'Coming soon' });
const deleteUser = async (req, res) => res.status(200).json({ success: true, message: 'Coming soon' });
const getAdminSwaps = async (req, res) => res.status(200).json({ success: true, message: 'Coming soon' });
const getAdminDonations = async (req, res) => res.status(200).json({ success: true, message: 'Coming soon' });
const getSystemReports = async (req, res) => res.status(200).json({ success: true, message: 'Coming soon' });

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAdminItems,
  getAdminSwaps,
  getAdminDonations,
  getSystemReports
};
