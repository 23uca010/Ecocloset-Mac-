const { supabase } = require('../config/supabaseClient');
const { uploadMultiple, handleUploadError, getFileUrl, deleteFile } = require('../middleware/upload');

// Get all items with filtering and pagination
const getItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      size,
      color,
      condition,
      type,
      status = 'available',
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice
    } = req.query;

    // Build Supabase query
    let query = supabase.from('items').select('*').eq('status', status);

    // Apply filters
    if (category) query = query.eq('category', category);
    if (size) query = query.eq('size', size);
    if (color) query = query.eq('color', color);
    if (condition) query = query.eq('condition', condition);
    if (type) query = query.eq('type', type);
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query = query.gte('price', parseFloat(minPrice) || 0);
      if (maxPrice) {
        query = query.lte('price', parseFloat(maxPrice));
      }
    }

    // Apply sorting
    if (sortBy === 'price') {
      query = query.order(sortOrder === 'desc' ? 'price' : '-price');
    } else if (sortBy === 'createdAt') {
      query = query.order(sortOrder === 'desc' ? 'created_at' : '-created_at');
    }

    // Calculate pagination
    const rangeStart = (page - 1) * limit;
    const rangeEnd = rangeStart + limit - 1;
    query = query.range(rangeStart, rangeEnd);

    // Execute query
    const { data: items, error, count } = await query;

    if (error) {
      console.error('Items fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching items.'
      });
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('items')
      .select('*', { count: 'exact', head: true })
      .eq('status', status);

    res.status(200).json({
      success: true,
      items: items || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount || 0,
        pages: Math.ceil((totalCount || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Create new item
const createItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, category, price, originalPrice, size, color, condition, type, images } = req.body;

    // Validate required fields
    if (!title || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.'
      });
    }

    // Handle image uploads
    const imageUrls = [];
    if (images && images.length > 0) {
      uploadMultiple(req, res, 'items', async (filePaths) => {
        if (!filePaths || filePaths.length === 0) return;

        // Upload images to Supabase storage
        for (const filePath of filePaths) {
          try {
            const fileName = `item_${Date.now()}_${filePath.split('\\').pop()}`;
            // Note: You'll need to configure Supabase storage separately
            imageUrls.push(`/uploads/${fileName}`);
          } catch (uploadError) {
            console.error('Image upload error:', uploadError);
          }
        }

        // Create item in Supabase
        const { data: itemData, error: insertError } = await supabase
          .from('items')
          .insert([{
            title,
            description,
            category,
            price: parseFloat(price),
            original_price: parseFloat(originalPrice) || null,
            size,
            color,
            condition,
            type,
            images: imageUrls,
            owner_id: userId,
            status: 'available',
            created_at: new Date().toISOString()
          }])
          .select();

        if (insertError) {
          console.error('Item creation error:', insertError);
          return res.status(500).json({
            success: false,
            message: 'Error creating item.'
          });
        }

        res.status(201).json({
          success: true,
          message: 'Item created successfully!',
          item: itemData[0]
        });
      });
    } else {
      // Create item without images
      const { data: itemData, error: insertError } = await supabase
        .from('items')
        .insert([{
          title,
          description,
          category,
          price: parseFloat(price),
          original_price: parseFloat(originalPrice) || null,
          size,
          color,
          condition,
          type,
          images: [],
          owner_id: userId,
          status: 'available',
          created_at: new Date().toISOString()
        }])
        .select();

      if (insertError) {
        console.error('Item creation error:', insertError);
        return res.status(500).json({
          success: false,
          message: 'Error creating item.'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Item created successfully!',
        item: itemData[0]
      });
    }

  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Get single item
const getItem = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: item, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Item fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching item.'
      });
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    res.status(200).json({
      success: true,
      item
    });

  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Update item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    // Check if user owns the item
    const { data: existingItem, error: checkError } = await supabase
      .from('items')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (checkError) {
      console.error('Ownership check error:', checkError);
      return res.status(500).json({
        success: false,
        message: 'Error checking item ownership.'
      });
    }

    if (!existingItem || existingItem.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own items.'
      });
    }

    // Update item
    const { data: updatedItem, error: updateError } = await supabase
      .from('items')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (updateError) {
      console.error('Item update error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Error updating item.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item updated successfully!',
      item: updatedItem[0]
    });

  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user owns the item
    const { data: existingItem, error: checkError } = await supabase
      .from('items')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (checkError) {
      console.error('Ownership check error:', checkError);
      return res.status(500).json({
        success: false,
        message: 'Error checking item ownership.'
      });
    }

    if (!existingItem || existingItem.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own items.'
      });
    }

    // Delete item
    const { error: deleteError } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Item delete error:', deleteError);
      return res.status(500).json({
        success: false,
        message: 'Error deleting item.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully!'
    });

  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

module.exports = {
  getItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  getItemById: getItem,
  getUserItems: getItems,
  toggleLike: async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Like functionality coming soon with Supabase!'
    });
  }
};
