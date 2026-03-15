const { supabase } = require('../config/supabaseClient');

// Get NGO dashboard statistics
const getNGODashboard = async (req, res) => {
  try {
    const ngoId = req.user.id;

    // Get statistics from Supabase
    const [
      donationsResult,
      itemsResult,
      usersResult
    ] = await Promise.all([
      supabase.from('donations').select('count').eq('ngo_id', ngoId),
      supabase.from('items').select('count').eq('owner_id', ngoId),
      supabase.from('users').select('count').eq('role', 'user')
    ]);

    const totalDonations = donationsResult.data?.[0]?.count || 0;
    const totalItems = itemsResult.data?.[0]?.count || 0;
    const totalUsers = usersResult.data?.[0]?.count || 0;

    // Get pending donations
    const { data: pendingDonations } = await supabase
      .from('donations')
      .select('*')
      .eq('ngo_id', ngoId)
      .eq('status', 'pending');

    // Get items received
    const { data: itemsReceived } = await supabase
      .from('donations')
      .select('*')
      .eq('ngo_id', ngoId)
      .eq('status', 'completed');

    res.status(200).json({
      success: true,
      stats: {
        totalDonations,
        totalItems,
        totalUsers,
        pendingDonations: pendingDonations?.length || 0,
        itemsReceived: itemsReceived?.length || 0,
        totalImpact: itemsReceived?.length || 0
      }
    });

  } catch (error) {
    console.error('NGO dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Get NGOs
const getNGOs = async (req, res) => {
  try {
    const { data: ngos, error } = await supabase
      .from('users')
      .select('id, username, first_name, last_name, email, phone, address, created_at')
      .eq('role', 'ngo')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get NGOs error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching NGOs.'
      });
    }

    res.status(200).json({
      success: true,
      ngos: ngos || []
    });

  } catch (error) {
    console.error('Get NGOs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Get NGO items
const getNGOItems = async (req, res) => {
  try {
    const { data: items, error } = await supabase
      .from('items')
      .select(`
        *,
        owner:users(username, first_name, last_name)
      `)
      .eq('owner_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get NGO items error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching items.'
      });
    }

    res.status(200).json({
      success: true,
      items: items || []
    });

  } catch (error) {
    console.error('Get NGO items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Stub functions for missing NGO features
const getAvailableItems = async (req, res) => res.status(200).json({ success: true, message: 'Coming soon' });
const getNGOProfile = async (req, res) => res.status(200).json({ success: true, message: 'Coming soon' });
const updateNGOProfile = async (req, res) => res.status(200).json({ success: true, message: 'Coming soon' });
const getDonationHistory = async (req, res) => res.status(200).json({ success: true, message: 'Coming soon' });
const generateImpactReport = async (req, res) => res.status(200).json({ success: true, message: 'Coming soon' });
const getPickupSchedule = async (req, res) => res.status(200).json({ success: true, message: 'Coming soon' });

module.exports = {
  getNGODashboard,
  getNGOs,
  getNGOItems,
  getAvailableItems,
  getNGOProfile,
  updateNGOProfile,
  getDonationHistory,
  generateImpactReport,
  getPickupSchedule
};
