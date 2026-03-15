import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  Search, 
  Filter, 
  Heart, 
  ShoppingBag, 
  Star,
  MapPin,
  Clock,
  ChevronDown,
  Grid,
  List,
  SlidersHorizontal,
  X,
  Package,
  ShoppingCart
} from 'lucide-react';

const ItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    priceRange: [0, 500],
    condition: 'all',
    size: 'all',
    color: 'all',
    type: 'all',
    sortBy: 'newest'
  });

  const categories = ['all', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Bags', 'Jewelry'];
  const conditions = ['all', 'New', 'Like New', 'Good', 'Fair'];
  const sizes = ['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['all', 'Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Gray'];
  const types = ['all', 'sell', 'swap', 'donation'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const sampleItems = [
    {
      id: 1,
      title: 'Vintage Denim Jacket',
      price: 45.99,
      originalPrice: 89.99,
      image: 'https://images.unsplash.com/photo-1576871344422-2218d1d9e9c?w=400&h=300&fit=crop',
      category: 'Outerwear',
      condition: 'Good',
      size: 'M',
      type: 'sell',
      rating: 4.5,
      reviews: 23,
      seller: 'Sarah M.',
      sellerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c5a7?w=40&h=40&fit=crop&crop=face',
      location: 'New York, NY',
      listed: '2 days ago',
      description: 'Classic vintage denim jacket in excellent condition. Perfect for layering and adds a timeless touch to any outfit.'
    },
    {
      id: 2,
      title: 'Floral Summer Dress',
      price: 32.50,
      originalPrice: 65.00,
      image: 'https://images.unsplash.com/photo-1572804013427-75d4628b2cba?w=400&h=300&fit=crop',
      category: 'Dresses',
      condition: 'Like New',
      size: 'S',
      type: 'sell',
      rating: 4.8,
      reviews: 15,
      seller: 'Emma L.',
      sellerAvatar: 'https://images.unsplash.com/photo-1544005173-66ddc4aee555?w=40&h=40&fit=crop&crop=face',
      location: 'Los Angeles, CA',
      listed: '1 day ago',
      description: 'Beautiful floral dress perfect for summer occasions. Lightweight fabric with vibrant colors.'
    },
    {
      id: 3,
      title: 'Sustainable Cotton T-Shirt',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
      category: 'Tops',
      condition: 'New',
      size: 'L',
      type: 'sell',
      rating: 4.2,
      reviews: 8,
      seller: 'Mike R.',
      sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      location: 'Austin, TX',
      listed: '3 hours ago',
      description: 'Eco-friendly cotton t-shirt made from sustainable materials. Comfortable and stylish.'
    },
    {
      id: 4,
      title: 'Handcrafted Leather Bag',
      price: 78.00,
      originalPrice: 120.00,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a81?w=400&h=300&fit=crop',
      category: 'Accessories',
      condition: 'Good',
      size: 'One Size',
      type: 'sell',
      rating: 4.9,
      reviews: 31,
      seller: 'Lisa K.',
      sellerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      location: 'Portland, OR',
      listed: '5 days ago',
      description: 'Handcrafted leather bag with plenty of storage space. Durable and fashionable.'
    }
  ];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/items');
        const data = await response.json();
        
        if (data.success) {
          // Map backend listingType to frontend type for consistency
          const mappedItems = data.data.map(item => ({
            ...item,
            type: item.listingType || 'sell', // Default to sell if not specified
            price: parseFloat(item.price) || 0,
            rating: 4.5, // Mock rating for now
            reviews: 0,
            seller: 'Eco User', // Mock seller for now
            sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop',
            location: 'Community', // Mock location for now
            listed: 'Just now'
          }));
          console.log('Fetched items:', mappedItems);
          setItems(mappedItems);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    console.log('Current items state:', items);
    console.log('Active filters:', filters);
  }, [items, filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const applyFilters = () => {
    // Simulate filtering
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowFilters(false);
    }, 500);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 500],
      condition: 'all',
      size: 'all',
      color: 'all',
      type: 'all',
      sortBy: 'newest'
    });
  };

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

  const filteredItems = items.filter(item => {
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.condition !== 'all' && item.condition !== filters.condition) return false;
    if (filters.size !== 'all' && item.size !== filters.size) return false;
    if (filters.color !== 'all' && item.color !== filters.color) return false;
    if (filters.type !== 'all' && item.type !== filters.type) return false;
    if (item.price < filters.priceRange[0] || item.price > filters.priceRange[1]) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Browse Items</h1>
              <span className="text-sm text-gray-600">{filteredItems.length} items found</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                />
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Sidebar */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setShowFilters(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {conditions.map(cond => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select
                    value={filters.size}
                    onChange={(e) => handleFilterChange('size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <select
                    value={filters.color}
                    onChange={(e) => handleFilterChange('color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={applyFilters}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={clearFilters}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Items Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Items</h2>
              <p className="text-gray-600">Handpicked sustainable fashion pieces from our community</p>
            </div>
            <button className="text-green-600 hover:text-green-700 font-semibold text-lg flex items-center">
              View All
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4-4m4 4l-4-4" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleItems.slice(0, 4).map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <img
                    src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000/${item.image}`) : 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={item.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex items-center space-x-2">
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                      <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                    </button>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      item.type === 'sell' ? 'bg-green-600 text-white' :
                      item.type === 'swap' ? 'bg-blue-600 text-white' :
                      'bg-purple-600 text-white'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg truncate">{item.title}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold text-green-600">${item.price}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">${item.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{item.condition}</span>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                    <span className="text-sm text-gray-400 ml-1">({item.reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={item.sellerAvatar}
                        alt={item.seller}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-600">{item.seller}</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="mr-3">{item.location}</span>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{item.listed}</span>
                  </div>
                  
                  {item.type === 'sell' && (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Items Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Items</h2>
          <p className="text-gray-600">Browse our complete collection of sustainable fashion</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-green-600"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                    <div className="relative">
                      <img
                        src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000/${item.image}`) : 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-2 right-2 flex items-center space-x-2">
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                        </button>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.type === 'sell' ? 'bg-green-600 text-white' :
                          item.type === 'swap' ? 'bg-blue-600 text-white' :
                          'bg-purple-600 text-white'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 truncate">{item.title}</h3>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-lg font-bold text-green-600">${item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-400 line-through ml-2">${item.originalPrice}</span>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">{item.condition}</span>
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
                          <span className="text-sm text-gray-600">{item.seller}</span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="mr-3">{item.location}</span>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{item.listed}</span>
                      </div>
                      
                      {item.type === 'sell' && (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="flex items-center space-x-6">
                      <img
                        src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000/${item.image}`) : 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={item.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-2">{item.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                              <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                            </button>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.type === 'sell' ? 'bg-green-600 text-white' :
                              item.type === 'swap' ? 'bg-blue-600 text-white' :
                              'bg-purple-600 text-white'
                            }`}>
                              {item.type}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div>
                              <span className="text-lg font-bold text-green-600">${item.price}</span>
                              {item.originalPrice && (
                                <span className="text-sm text-gray-400 line-through ml-2">${item.originalPrice}</span>
                              )}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              <span>{item.rating}</span>
                              <span className="text-gray-400 ml-1">({item.reviews})</span>
                            </div>
                            
                            <div className="flex items-center">
                              <img
                                src={item.sellerAvatar}
                                alt={item.seller}
                                className="w-6 h-6 rounded-full mr-2"
                              />
                              <span className="text-sm text-gray-600">{item.seller}</span>
                            </div>
                            
                            <span className="text-sm text-gray-600">{item.condition}</span>
                            
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="mr-3">{item.location}</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{item.listed}</span>
                          </div>
                          
                          {item.type === 'sell' && (
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="ml-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ItemsPage;
