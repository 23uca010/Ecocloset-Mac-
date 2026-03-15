const { supabase } = require('../config/supabaseClient');

// Create swap request
const createSwapRequest = async (req, res) => {
  try {
    const { itemRequested, itemOffered, message, proposedMeeting } = req.body;
    const userId = req.user.id;

    if (!itemRequested || !itemOffered) {
      return res.status(400).json({
        success: false,
        message: 'Both requested and offered items are required.'
      });
    }

    // Check if items exist and are available
    const [requestedItem, offeredItem] = await Promise.all([
      supabase.from('items').select('*').eq('id', itemRequested).single(),
      supabase.from('items').select('*').eq('id', itemOffered).single()
    ]);

    if (requestedItem.error || offeredItem.error || !requestedItem.data || !offeredItem.data) {
      return res.status(404).json({
        success: false,
        message: 'One or both items not found.'
      });
    }

    if (requestedItem.data.owner_id === userId || offeredItem.data.owner_id === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot swap with your own items.'
      });
    }

    // Create swap request
    const { data: swapData, error: swapError } = await supabase
      .from('swap_requests')
      .insert([{
        requester_item_id: itemRequested,
        owner_item_id: itemOffered,
        requester_id: userId,
        owner_id: offeredItem.data.owner_id,
        message,
        proposed_meeting: proposedMeeting,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select();

    if (swapError) {
      console.error('Swap request creation error:', swapError);
      return res.status(500).json({
        success: false,
        message: 'Error creating swap request.'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Swap request created successfully!',
      swap: swapData[0]
    });

  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Get user swap requests
const getSwapRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: swaps, error } = await supabase
      .from('swap_requests')
      .select(`
        *,
        requested_item:items(title, category, price, images),
        owner_item:items(title, category, price, images),
        owner:users(username, first_name, last_name)
      `)
      .eq('requester_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get swap requests error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching swap requests.'
      });
    }

    res.status(200).json({
      success: true,
      swaps: swaps || []
    });

  } catch (error) {
    console.error('Get swap requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Get swap request by ID
const getSwapRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: swap, error } = await supabase
      .from('swap_requests')
      .select(`
        *,
        requested_item:items(title, category, price, images),
        owner_item:items(title, category, price, images),
        owner:users(username, first_name, last_name)
      `)
      .eq('id', id)
      .single();

    if (error || !swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found.'
      });
    }

    // Check if user owns this swap request
    if (swap.requester_id !== userId && swap.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    res.status(200).json({
      success: true,
      swap
    });

  } catch (error) {
    console.error('Get swap request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Respond to swap request
const respondToSwapRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;
    const userId = req.user.id;

    const { data: swap, error: checkError } = await supabase
      .from('swap_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (checkError || !swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found.'
      });
    }

    // Check if user owns this swap request (is the owner of the offered item)
    if (swap.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const { data: updatedData, error: updateError } = await supabase
      .from('swap_requests')
      .update({
        status,
        response_message: message,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (updateError) {
      console.error('Respond to swap error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Error responding to swap request.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Swap request response sent successfully!',
      swap: updatedData[0]
    });

  } catch (error) {
    console.error('Respond to swap error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Complete swap request
const completeSwapRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: swap, error: checkError } = await supabase
      .from('swap_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (checkError || !swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found.'
      });
    }

    // Check if user is involved in this swap
    if (swap.requester_id !== userId && swap.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const { data: updatedData, error: updateError } = await supabase
      .from('swap_requests')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (updateError) {
      console.error('Complete swap error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Error completing swap request.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Swap request completed successfully!',
      swap: updatedData[0]
    });

  } catch (error) {
    console.error('Complete swap error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Cancel swap request
const cancelSwapRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: swap, error: checkError } = await supabase
      .from('swap_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (checkError || !swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found.'
      });
    }

    // Check if user owns this swap request
    if (swap.requester_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const { data: updatedData, error: updateError } = await supabase
      .from('swap_requests')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (updateError) {
      console.error('Cancel swap error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Error cancelling swap request.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Swap request cancelled successfully!',
      swap: updatedData[0]
    });

  } catch (error) {
    console.error('Cancel swap error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

module.exports = {
  createSwapRequest,
  getSwapRequests,
  getSwapRequestById,
  respondToSwapRequest,
  completeSwapRequest,
  cancelSwapRequest
};
