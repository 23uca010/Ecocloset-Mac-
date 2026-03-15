import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Heart, 
  ShoppingBag, 
  Star, 
  Grid, 
  List, 
  SlidersHorizontal,
  X,
  ArrowUpDown,
  ChevronDown,
  MapPin,
  Calendar,
  User
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

const ModernItems = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [itemType, setItemType] = useState('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  // Sample fashion images for fallback
  const fallbackImages = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1469334933656-a20f5b9a6c6d?w=300&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1479064525588-635012f7d65d?w=300&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d425?w=300&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=300&h=300&fit=crop&crop=center'
  ];

  // Function to get a fallback image based on item properties
  const getFallbackImage = (item, index) => {
    const hash = item.title?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    const imageIndex = hash % fallbackImages.length;
    return fallbackImages[imageIndex];
  };

  // Function to get item image with fallback
  const getItemImage = (item, index = 0) => {
    if (item.images && item.images.length > 0 && item.images[index]) {
      return item.images[index];
    }
    return getFallbackImage(item, index);
  };
  
  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Gray'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ];

  useEffect(() => {
    fetchItems();
  }, [searchParams, sortBy, selectedCategories, selectedSizes, selectedColors, priceRange, itemType]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:5000/api/items');
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Correct image path for display
        const mappedItems = data.data.map(item => ({
          ...item,
          _id: item.id,
          images: item.image ? [`http://localhost:5000/${item.image.replace(/\\/g, '/')}`] : []
        }));
        setItems(mappedItems);
      } else {
        console.error('Error fetching items:', data.message);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params);
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 5000]);
    setItemType('all');
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
              <p className="text-gray-600 mt-1">Discover sustainable fashion pieces</p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items, brands, or styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-2 p-2 text-green-600 hover:text-green-700"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
                >
                  {showFilters ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              {!showFilters && (
                <div className="lg:hidden">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Show Filters
                  </button>
                </div>
              )}

              <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Item Type */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Item Type</h3>
                  <div className="space-y-2">
                    {['all', 'sell', 'swap', 'donation'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="itemType"
                          value={type}
                          checked={itemType === type}
                          onChange={(e) => setItemType(e.target.value)}
                          className="mr-2 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-gray-700 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="mr-2 text-green-600 focus:ring-green-500 rounded"
                        />
                        <span className="text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Sizes</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                          selectedSizes.includes(size)
                            ? 'border-green-600 bg-green-50 text-green-600'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          selectedColors.includes(color)
                            ? 'border-green-600 bg-green-50 text-green-600'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{formatCurrency(priceRange[0])}</span>
                      <span>{formatCurrency(priceRange[1])}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    {items.length} items found
                  </span>
                  
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                      <div key={item._id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
                        <div className="relative">
                          <Link to={`/items/${item._id}`}>
                            <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                              <img 
                                src={getItemImage(item, 0)} 
                                alt={item.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                onError={(e) => {
                                  e.target.src = getFallbackImage(item, 0);
                                }}
                              />
                            </div>
                          </Link>
                          
                          {/* Type Badge */}
                          <div className="absolute top-2 left-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.type === 'swap' ? 'bg-blue-600 text-white' :
                              item.type === 'donation' ? 'bg-green-600 text-white' :
                              'bg-purple-600 text-white'
                            }`}>
                              {item.type}
                            </span>
                          </div>
                          
                          {/* Wishlist Button */}
                          <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">
                            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                          </button>
                        </div>
                        
                        <div className="p-4">
                          <Link to={`/items/${item._id}`}>
                            <h3 className="font-semibold text-gray-900 mb-1 hover:text-green-600 transition-colors">
                              {item.title}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">{item.category}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">4.5</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                             <span className="text-lg font-bold text-green-600">{formatCurrency(item.price)}</span>
                            <span className="text-sm text-gray-500">{item.condition}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                            >
                              <ShoppingBag className="h-4 w-4 mr-1" />
                              Add to Cart
                            </button>
                            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              <Heart className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item._id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="w-full sm:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={getItemImage(item, 0)} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = getFallbackImage(item, 0);
                              }}
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <Link to={`/items/${item._id}`}>
                                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors">
                                    {item.title}
                                  </h3>
                                </Link>
                                
                                <div className="flex items-center space-x-4 mb-2">
                                  <span className="text-sm text-gray-600">{item.category}</span>
                                  <span className="text-sm text-gray-600">{item.condition}</span>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600">4.5</span>
                                  </div>
                                </div>
                                
                                <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                                
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{item.location}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <User className="h-4 w-4" />
                                    <span>{item.owner?.firstName}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end space-y-2">
                                 <span className="text-2xl font-bold text-green-600">{formatCurrency(item.price)}</span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleAddToCart(item)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                                  >
                                    <ShoppingBag className="h-4 w-4 mr-1" />
                                    Add to Cart
                                  </button>
                                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Heart className="h-4 w-4 text-gray-600" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {items.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Clear Filters
                    </button>
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

export default ModernItems;
