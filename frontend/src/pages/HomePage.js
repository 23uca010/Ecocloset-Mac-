import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  Search, 
  Filter, 
  Heart, 
  ShoppingBag, 
  Star,
  Users,
  Package,
  Recycle,
  Gift,
  ChevronRight,
  ArrowRight,
  Shield,
  Truck,
  Clock,
  MapPin,
  ShoppingCart
} from 'lucide-react';

const HomePage = () => {
  const { addToCart } = useCart();

  const featuredData = [
    {
      id: 1,
      title: 'Vintage Denim Jacket',
      price: 3750,
      image: '/images/denim-jacket.jpg',
      category: 'Outerwear',
      condition: 'Like-new',
      size: 'M',
      type: 'swap',
      rating: 4.5,
      reviews: 23,
      seller: 'Sarah M.',
      sellerAvatar: '/images/seller-sarah.jpg',
      location: 'New York, NY',
      listed: '2 days ago',
      description: 'Classic vintage denim jacket in excellent condition.'
    },
    {
      id: 2,
      title: 'White Leather Sneakers',
      price: 5400,
      image: '/images/white-sneakers.jpg',
      category: 'Shoes',
      condition: 'Like-new',
      size: 'M',
      type: 'sell',
      rating: 4.8,
      reviews: 15,
      seller: 'Alex K.',
      sellerAvatar: '/images/seller-alex.jpg',
      location: 'Los Angeles, CA',
      listed: '1 day ago',
      description: 'Clean white leather sneakers in like-new condition.'
    },
    {
      id: 3,
      title: 'Floral Summer Dress',
      price: 2900,
      image: '/images/floral-dress.jpg',
      category: 'Dresses',
      condition: 'Good',
      size: 'S',
      type: 'swap',
      rating: 4.2,
      reviews: 8,
      seller: 'Emma L.',
      sellerAvatar: '/images/seller-emma.jpg',
      location: 'Austin, TX',
      listed: '3 hours ago',
      description: 'Beautiful floral dress perfect for summer occasions.'
    },
    {
      id: 4,
      title: 'Brown Leather Boots',
      price: 6600,
      image: '/images/brown-boots.jpg',
      category: 'Shoes',
      condition: 'Good',
      size: 'L',
      type: 'sell',
      rating: 4.9,
      reviews: 31,
      seller: 'Michael R.',
      sellerAvatar: '/images/seller-michael.jpg',
      location: 'Portland, OR',
      listed: '5 days ago',
      description: 'Durable brown leather boots for all weather.'
    }
  ];

  const handleAddToCart = (item) => {
    const cartItem = {
      _id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      category: item.category,
      size: item.size || 'M',
      condition: item.condition,
      seller: item.seller
    };
    addToCart(cartItem);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Reduce Waste Reimagine fashion
            </h1>
            <p className="text-xl mb-8 text-green-100">
              Buy, sell, and swap pre-loved fashion. Sustainable style made simple.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/browse"
                  className="flex-1 bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  Start Shopping
                </Link>
                <Link
                  to="/sell-swap"
                  className="flex-1 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors flex items-center justify-center"
                >
                  List Your Items
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Browse & Buy</h3>
              <p className="text-gray-600">
                Discover unique pre-loved fashion from our community. Filter by size, style, and condition.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Swap Items</h3>
              <p className="text-gray-600">
                Trade your clothes with others. Find the perfect match and refresh your wardrobe for free.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sell & Earn</h3>
              <p className="text-gray-600">
                List items you no longer wear. Set your price and connect with buyers instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Items
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredData.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 right-2 flex items-center space-x-2">
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                      <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                    </button>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.type === 'sell' ? 'bg-green-600 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {item.type === 'sell' ? 'For Sale' : 'Sale or Swap'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{item.title}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                    <span className="text-sm text-gray-600">{item.condition} • Size {item.size}</span>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                    <span className="text-sm text-gray-400 ml-1">({item.reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <img
                        src={item.sellerAvatar}
                        alt={item.seller}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-600">by {item.seller}</span>
                    </div>
                  </div>
                  
                  {item.type === 'sell' && (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
