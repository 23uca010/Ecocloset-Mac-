const { supabase } = require('../config/supabaseClient');

// Create donation request
const createDonationRequest = async (req, res) => {
  try {
    const { item, ngo, donationType, pickupDetails, dropoffDetails, estimatedValue, taxReceipt, notes } = req.body;
    const userId = req.user.id;

    if (!item || !ngo || !donationType) {
      return res.status(400).json({
        success: false,
        message: 'Item, NGO, and donation type are required.'
      });
    }

    // Check if item exists
    const { data: itemData, error: itemError } = await supabase
      .from('items')
      .select('*')
      .eq('id', item)
      .single();

    if (itemError || !itemData) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    // Create donation request
    const { data: donationData, error: donationError } = await supabase
      .from('donations')
      .insert([{
        item_id: item,
        donor_id: userId,
        ngo_id: ngo,
        donation_type: donationType,
        pickup_details: pickupDetails,
        dropoff_details: dropoffDetails,
        estimated_value: estimatedValue,
        tax_receipt: taxReceipt,
        notes,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select();

    if (donationError) {
      console.error('Donation creation error:', donationError);
      return res.status(500).json({
        success: false,
        message: 'Error creating donation request.'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Donation request created successfully!',
      donation: donationData[0]
    });

  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Get user donations
const getUserDonations = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: donations, error } = await supabase
      .from('donations')
      .select(`
        *,
        items(title, category, price, images),
        donor:users(username, first_name, last_name),
        ngo:users(username, first_name, last_name)
      `)
      .eq('donor_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get donations error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching donations.'
      });
    }

    res.status(200).json({
      success: true,
      donations: donations || []
    });

  } catch (error) {
    console.error('Get user donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Get NGO donations
const getNGODonations = async (req, res) => {
  try {
    const ngoId = req.user.id;

    const { data: donations, error } = await supabase
      .from('donations')
      .select(`
        *,
        items(title, category, price, images),
        donor:users(username, first_name, last_name)
      `)
      .eq('ngo_id', ngoId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get NGO donations error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching donations.'
      });
    }

    res.status(200).json({
      success: true,
      donations: donations || []
    });

  } catch (error) {
    console.error('Get NGO donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Update donation status
const updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;

    const { data: donationData, error: checkError } = await supabase
      .from('donations')
      .select('*')
      .eq('id', id)
      .single();

    if (checkError || !donationData) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found.'
      });
    }

    // Check if user owns this donation or is the NGO
    if (donationData.ngo_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const { data: updatedData, error: updateError } = await supabase
      .from('donations')
      .update({
        status,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (updateError) {
      console.error('Update donation error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Error updating donation.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Donation updated successfully!',
      donation: updatedData[0]
    });

  } catch (error) {
    console.error('Update donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

module.exports = {
  createDonationRequest,
  getUserDonations,
  getNGODonations,
  updateDonationStatus,
  getDonationById: async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Get donation by ID - Coming soon with Supabase!'
    });
  },
  respondToDonation: async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Respond to donation - Coming soon with Supabase!'
    });
  },
  scheduleDonation: async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Schedule donation - Coming soon with Supabase!'
    });
  },
  completeDonation: async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Complete donation - Coming soon with Supabase!'
    });
  },
  reviewDonation: async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Review donation - Coming soon with Supabase!'
    });
  }
};
