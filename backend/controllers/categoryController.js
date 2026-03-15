const db = require('../database/sqlite');

// Get all categories
const getCategories = (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
    res.status(200).json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching categories.'
    });
  }
};

// Add new category
const addCategory = (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.'
      });
    }

    const info = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)').run(name, description);

    res.status(201).json({
      success: true,
      message: 'Category added successfully',
      data: { id: info.lastInsertRowid, name, description }
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists.'
      });
    }
    console.error('Add category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding category.'
    });
  }
};

// Update category
const updateCategory = (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    db.prepare('UPDATE categories SET name = ?, description = ? WHERE id = ?').run(name, description, id);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating category.'
    });
  }
};

// Delete category
const deleteCategory = (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category is in use
    const itemWithCat = db.prepare('SELECT id FROM items WHERE category = (SELECT name FROM categories WHERE id = ?) LIMIT 1').get(id);
    if (itemWithCat) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category that is currently in use by items.'
      });
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting category.'
    });
  }
};

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
};
