import { supabase } from '../lib/supabaseClient';

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

export const addSampleItems = async () => {
  try {
    console.log('Adding sample items...');
    
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
        console.log('Item added successfully:', item.title);
      }
    }
    
    console.log('Sample items added successfully!');
  } catch (error) {
    console.error('Error adding sample items:', error);
  }
};

// Run this function in the browser console to add sample items
// addSampleItems();
