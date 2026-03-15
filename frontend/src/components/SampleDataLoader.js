import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Package, Plus, Check } from 'lucide-react';

const SampleDataLoader = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [itemsAdded, setItemsAdded] = useState(0);

  const sampleItems = [
    {
      title: "Vintage Denim Jacket",
      description: "Classic blue denim jacket in excellent condition. Perfect for layering and adding a timeless piece to your wardrobe.",
      category: "Outerwear",
      size: "M",
      color: "Blue",
      price: 45.99,
      condition: "Excellent",
      brand: "Levi's",
      type: "sell",
      images: [
        "https://images.unsplash.com/photo-1576871338826-8349b5a5a9a1?w=300&h=300&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1551698618-1d57b5c0c6a1?w=300&h=300&fit=crop&crop=center"
      ],
      status: "available"
    },
    {
      title: "Floral Summer Dress",
      description: "Beautiful floral print dress perfect for summer occasions. Lightweight and comfortable.",
      category: "Dresses",
      size: "S",
      color: "Pink",
      price: 32.50,
      condition: "Good",
      brand: "Zara",
      type: "swap",
      images: [
        "https://images.unsplash.com/photo-1594634312681-425c7b97ccd1?w=300&h=300&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300&h=300&fit=crop&crop=center"
      ],
      status: "available"
    },
    {
      title: "Classic White Sneakers",
      description: "Clean white sneakers in like-new condition. Versatile and stylish.",
      category: "Shoes",
      size: "9",
      color: "White",
      price: 55.00,
      condition: "Like New",
      brand: "Nike",
      type: "sell",
      images: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300&h=300&fit=crop&crop=center"
      ],
      status: "available"
    },
    {
      title: "Leather Handbag",
      description: "Genuine leather handbag with multiple compartments. Elegant and practical.",
      category: "Accessories",
      size: "One Size",
      color: "Brown",
      price: 78.00,
      condition: "Excellent",
      brand: "Coach",
      type: "donation",
      images: [
        "https://images.unsplash.com/photo-1553062407-fc76c0a3a5a5?w=300&h=300&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1584917865444-7061a4f1e5e3?w=300&h=300&fit=crop&crop=center"
      ],
      status: "available"
    },
    {
      title: "Striped Cotton T-Shirt",
      description: "Comfortable striped t-shirt made from 100% organic cotton.",
      category: "Tops",
      size: "L",
      color: "Blue",
      price: 18.99,
      condition: "Good",
      brand: "H&M",
      type: "sell",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1562157889-7b1e0d4b5b9c?w=300&h=300&fit=crop&crop=center"
      ],
      status: "available"
    },
    {
      title: "Black Skinny Jeans",
      description: "Form-fitting black skinny jeans. Stretchy and comfortable for all-day wear.",
      category: "Bottoms",
      size: "M",
      color: "Black",
      price: 42.00,
      condition: "Excellent",
      brand: "Guess",
      type: "swap",
      images: [
        "https://images.unsplash.com/photo-1542272604-787c3835535a?w=300&h=300&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=300&fit=crop&crop=center"
      ],
      status: "available"
    },
    {
      title: "Wool Winter Coat",
      description: "Warm wool coat perfect for winter weather. Classic design with modern fit.",
      category: "Outerwear",
      size: "L",
      color: "Gray",
      price: 120.00,
      condition: "Good",
      brand: "Burberry",
      type: "donation",
      images: [
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=300&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop&crop=center"
      ],
      status: "available"
    },
    {
      title: "Silk Scarf",
      description: "Luxurious silk scarf with elegant floral pattern. Perfect accessory for any outfit.",
      category: "Accessories",
      size: "One Size",
      color: "Purple",
      price: 25.00,
      condition: "Excellent",
      brand: "Hermès",
      type: "sell",
      images: [
        "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=300&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop&crop=center"
      ],
      status: "available"
    }
  ];

  const addSampleItems = async () => {
    setLoading(true);
    setMessage('');
    setItemsAdded(0);

    try {
      let addedCount = 0;
      
      for (const item of sampleItems) {
        const { data, error } = await supabase
          .from('items')
          .insert([{
            ...item,
            owner_id: '00000000-0000-0000-0000-000000000000', // Default user ID
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
        
        if (error) {
          console.error('Error adding item:', error);
        } else {
          addedCount++;
          setItemsAdded(addedCount);
        }
      }
      
      setMessage(`✅ Successfully added ${addedCount} sample items!`);
    } catch (error) {
      console.error('Error adding sample items:', error);
      setMessage('❌ Error adding sample items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearItems = async () => {
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .neq('owner_id', '00000000-0000-0000-0000-000000000000');
      
      if (error) {
        console.error('Error clearing items:', error);
        setMessage('❌ Error clearing items. Please try again.');
      } else {
        setMessage('✅ Items cleared successfully!');
        setItemsAdded(0);
      }
    } catch (error) {
      console.error('Error clearing items:', error);
      setMessage('❌ Error clearing items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Package className="h-8 w-8 text-green-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Sample Data Manager</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Add Sample Items</h3>
            <p className="text-sm text-blue-700 mb-4">
              Add sample fashion items with proper images to test the browse functionality.
              Each item includes high-quality Unsplash images.
            </p>
            <button
              onClick={addSampleItems}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center font-medium"
            >
              {loading ? (
                <span>Adding Items...</span>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Add 8 Sample Items
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-2">Clear Sample Items</h3>
            <p className="text-sm text-red-700 mb-4">
              Remove all sample items from the database (except user-added items).
            </p>
            <button
              onClick={clearItems}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {loading ? 'Clearing...' : 'Clear Sample Items'}
            </button>
          </div>

          {message && (
            <div className={`p-4 rounded-lg flex items-center ${
              message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              <Check className="h-5 w-5 mr-2" />
              {message}
            </div>
          )}

          {itemsAdded > 0 && (
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">
                <strong>{itemsAdded}</strong> items have been added to the database.
                Refresh the items page to see them.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SampleDataLoader;
