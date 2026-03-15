import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Shield,
  Truck,
  Clock,
  MapPin,
  Sparkles,
  Eye,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const StylishItems = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { api, isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('horizontal');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Bags', 'Jewelry'];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];
  const types = ['sell', 'swap', 'donation'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Brown'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ];

  // Sample realistic items with beautiful images - exactly 10 items with realistic fashion photography
  const sampleItems = [];

  const allItems = sampleItems;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/items');
        const data = await response.json();
        
        if (data.success) {
          // Map backend fields to frontend expectations
          const mappedItems = data.data.map(item => ({
            ...item,
            _id: item.id, // Better-sqlite3 uses id
            type: item.listingType || 'sell',
            price: parseFloat(item.price) || 0,
            rating: 4.5,
            reviews: Math.floor(Math.random() * 50) + 5,
            owner: {
              firstName: item.owner_name,
              profileImage: item.owner_avatar,
              phone: item.owner_phone,
              location: item.owner_location
            },
            location: item.owner_location || 'Community',
            phone: item.owner_phone,
            // Handle image path correctly
            image: item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000/${item.image}`) : 'https://via.placeholder.com/400x300?text=No+Image'
          }));
          console.log('StylishItems fetched:', mappedItems);
          setItems(mappedItems);
        }
      } catch (error) {
        console.error('Error fetching stylish items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleAddToCart = (item) => {
    const cartItem = {
      _id: item._id,
      title: item.title,
      price: item.price,
      image: item.image,
      category: item.category,
      size: item.size || 'M',
      condition: item.condition,
      seller: item.owner.firstName
    };
    addToCart(cartItem);
  };
  
  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requester_id: user?.id,
          requester_role: user?.role
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setItems(items.filter(item => item._id !== itemId));
        alert('Item deleted successfully');
      } else {
        alert(data.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    }
  };

  const filteredItems = items.filter(item => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) return false;
    if (item.price < priceRange[0] || item.price > priceRange[1]) return false;
    if (selectedCondition !== 'all' && item.condition !== selectedCondition) return false;
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing fashion items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Sustainable Fashion
              </h1>
              <p className="text-gray-600 mt-2">Discover unique items from our community</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-purple-600" />
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ChevronRight className={`h-4 w-4 transform transition-transform ${showFilters ? 'rotate-90' : ''}`} />
                </button>
              </div>
              
              {showFilters && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([...selectedCategories, category]);
                              } else {
                                setSelectedCategories(selectedCategories.filter(c => c !== category));
                              }
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatCurrency(priceRange[0])}</span>
                        <span>{formatCurrency(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Condition</h3>
                    <select
                      value={selectedCondition}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="all">All Conditions</option>
                      {conditions.map(condition => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Type</h3>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="all">All Types</option>
                      <option value="sell">For Sale</option>
                      <option value="swap">For Swap</option>
                      <option value="donation">For Donation</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 flex items-center">
                    <Sparkles className="h-4 w-4 mr-1 text-purple-600" />
                    {items.length} items found
                  </span>
                  
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('horizontal')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'horizontal' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Package className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-1">
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* No Items Message */}
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                {/* Horizontal Grid View - 2 items per row */}
                {viewMode === 'horizontal' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredItems.map((item) => (
                      <div 
                        key={item._id} 
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                        onMouseEnter={() => setHoveredItem(item._id)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <div className="relative">
                          <Link to={`/items/${item._id}`}>
                            <div className="aspect-square overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                          
                          {/* Quick View */}
                          {hoveredItem === item._id && (
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button className="px-6 py-3 bg-white text-purple-600 rounded-full font-medium hover:bg-purple-50 transition-colors flex items-center">
                                <Eye className="h-4 w-4 mr-2" />
                                Quick View
                              </button>
                            </div>
                          )}
                          
                          {/* Type Badge */}
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.type === 'sell' ? 'bg-green-100 text-green-800' :
                              item.type === 'swap' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {item.type === 'sell' ? 'For Sale' : item.type === 'swap' ? 'For Swap' : 'For Donation'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          {/* Owner Info */}
                          <div className="flex items-center mb-3">
                            {item.owner.profileImage ? (
                              <img 
                                src={item.owner.profileImage} 
                                alt={item.owner.firstName}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                                <Users className="h-4 w-4 text-purple-600" />
                              </div>
                            )}
                            <span className="text-sm text-gray-600">{item.owner.firstName || 'User'}</span>
                            {item.location && (
                              <span className="text-sm text-gray-400 ml-auto flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {item.location}
                              </span>
                            )}
                          </div>
                          
                          {item.phone && (
                            <div className="flex items-center mb-3 text-xs text-gray-500 bg-purple-50 p-2 rounded-lg">
                              <Users className="h-3.3 w-3.5 mr-2 text-purple-600" />
                              <span className="font-medium mr-1 text-gray-700">Contact:</span>
                              <span className="text-purple-700 font-semibold italic">{item.phone}</span>
                            </div>
                          )}
                          
                          {/* Title */}
                          <Link to={`/items/${item._id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                              {item.title}
                            </h3>
                          </Link>
                          
                          {/* Description */}
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                          
                          {/* Details */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600">{item.category} • {item.size}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{item.rating}</span>
                              <span className="text-sm text-gray-400">({item.reviews})</span>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-2xl font-bold text-purple-600">{formatCurrency(item.price)}</span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                 <span className="text-sm text-gray-400 line-through ml-2">{formatCurrency(item.originalPrice)}</span>
                              )}
                            </div>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.condition}</span>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            {item.type === 'sell' ? (
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                              >
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Add to Cart
                              </button>
                            ) : item.type === 'swap' ? (
                              <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Propose Swap
                              </button>
                            ) : (
                              <button className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                                <Gift className="h-4 w-4 mr-2" />
                                Request Donation
                              </button>
                            )}
                            {(user?.id == item.user_id || user?.role === 'admin') && (
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(item._id);
                                }}
                                className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                title="Delete My Item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              <Heart className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Grid View - 3 items per row */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <div key={item._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                        <div className="relative">
                          <Link to={`/items/${item._id}`}>
                            <div className="aspect-square overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                          
                          {/* Type Badge */}
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.type === 'sell' ? 'bg-green-100 text-green-800' :
                              item.type === 'swap' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {item.type === 'sell' ? 'For Sale' : item.type === 'swap' ? 'For Swap' : 'For Donation'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          {/* Owner Info */}
                          <div className="flex items-center mb-3">
                            {item.owner.profileImage ? (
                              <img 
                                src={item.owner.profileImage} 
                                alt={item.owner.firstName}
                                className="w-8 h-8 rounded-full mr-2 border border-purple-100"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-2 border border-purple-100">
                                <Users className="h-4 w-4 text-purple-600" />
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-700">{item.owner.firstName || 'User'}</span>
                            {item.location && (
                              <span className="text-xs text-gray-400 ml-auto flex items-center">
                                <MapPin className="h-3 w-3 mr-1 text-purple-400" />
                                {item.location}
                              </span>
                            )}
                          </div>

                          <Link to={`/items/${item._id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-purple-600 transition-colors">
                              {item.title}
                            </h3>
                          </Link>

                          {item.phone && (
                            <div className="flex items-center mb-2 text-xs text-purple-700 font-semibold bg-purple-50 px-2 py-1.5 rounded-lg border border-purple-100">
                              <Users className="h-3 w-3 mr-1.5" />
                              Contact: {item.phone}
                            </div>
                          )}
                          
                          <div className="flex items-center mb-3 text-sm text-gray-500">
                            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                            {item.location}
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                               <span className="text-2xl font-bold text-purple-600">{formatCurrency(item.price)}</span>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.condition}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {item.type === 'sell' ? (
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center text-sm"
                              >
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Add to Cart
                              </button>
                            ) : item.type === 'swap' ? (
                              <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm">
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Swap
                              </button>
                            ) : (
                              <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center text-sm">
                                <Gift className="h-4 w-4 mr-2" />
                                Donate
                              </button>
                            )}
                            {(user?.id == item.user_id || user?.role === 'admin') && (
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(item._id);
                                }}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                title="Delete My Item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              <Heart className="h-4 w-4 text-gray-400" />
                            </button>
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
      </div>
    </div>
  );
};

export default StylishItems;
