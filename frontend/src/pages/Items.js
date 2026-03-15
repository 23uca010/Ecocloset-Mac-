import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Search, Filter, Grid, List, Heart, Eye, MapPin, ShoppingCart } from 'lucide-react';

const Items = () => {
  const { api, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    size: '',
    condition: '',
    type: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['shirts', 'pants', 'dresses', 'jackets', 'shoes', 'accessories', 'other'];
  const sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl', 'custom'];
  const conditions = ['new', 'like_new', 'good', 'fair', 'poor'];
  const types = ['swap', 'donation', 'both'];

  useEffect(() => {
    fetchItems();
  }, [filters, pagination.page]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      const response = await api.get(`/items?${params}`);
      setItems(response.data.data.items);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const toggleLike = async (itemId) => {
    if (!isAuthenticated) return;
    
    try {
      await api.post(`/items/${itemId}/like`);
      fetchItems(); // Refresh items to update like status
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const ItemCard = ({ item }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <Link to={`/items/${item._id}`}>
          <img
            src={item.images[0] || '/placeholder-item.jpg'}
            alt={item.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </Link>
        <button
          onClick={() => toggleLike(item._id)}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            item.likes?.some(like => like.user === (isAuthenticated ? JSON.parse(localStorage.getItem('user'))?._id : null))
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          } transition-colors`}
        >
          <Heart className="h-4 w-4" fill={item.likes?.some(like => like.user === (isAuthenticated ? JSON.parse(localStorage.getItem('user'))?._id : null)) ? 'currentColor' : 'none'} />
        </button>
        <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700">
          {item.condition.replace('_', ' ')}
        </div>
      </div>
      <div className="p-4">
        <Link to={`/items/${item._id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 hover:text-green-600 transition-colors">
            {item.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="capitalize">{item.category}</span>
          <span className="uppercase">{item.size}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              item.type === 'swap' 
                ? 'bg-blue-100 text-blue-800'
                : item.type === 'donation'
                ? 'bg-green-100 text-green-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {item.type}
            </span>
            {item.views > 0 && (
              <div className="flex items-center text-gray-500">
                <Eye className="h-3 w-3 mr-1" />
                <span className="text-xs">{item.views}</span>
              </div>
            )}
          </div>
          <div className="flex items-center text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="text-xs">{item.owner?.city || 'Location'}</span>
          </div>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">₹{item.price?.toFixed(2) || '0.00'}</span>
            <button
              onClick={() => addToCart(item)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm font-medium">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ItemList = ({ item }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4">
      <div className="flex space-x-4">
        <Link to={`/items/${item._id}`} className="flex-shrink-0">
          <img
            src={item.images[0] || '/placeholder-item.jpg'}
            alt={item.title}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <Link to={`/items/${item._id}`}>
                <h3 className="font-semibold text-gray-900 mb-1 hover:text-green-600 transition-colors">
                  {item.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="capitalize">{item.category}</span>
                <span className="uppercase">{item.size}</span>
                <span>{item.condition.replace('_', ' ')}</span>
              </div>
            </div>
            <button
              onClick={() => toggleLike(item._id)}
              className={`p-2 rounded-full ${
                item.likes?.some(like => like.user === (isAuthenticated ? JSON.parse(localStorage.getItem('user'))?._id : null))
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } transition-colors`}
            >
              <Heart className="h-4 w-4" fill={item.likes?.some(like => like.user === (isAuthenticated ? JSON.parse(localStorage.getItem('user'))?._id : null)) ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                item.type === 'swap' 
                  ? 'bg-blue-100 text-blue-800'
                  : item.type === 'donation'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {item.type}
              </span>
              <div className="flex items-center text-gray-500">
                <Eye className="h-3 w-3 mr-1" />
                <span className="text-xs">{item.views} views</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              by {item.owner?.firstName} {item.owner?.lastName}
            </div>
          </div>
        </div>
        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">₹{item.price?.toFixed(2) || '0.00'}</span>
            <button
              onClick={() => addToCart(item)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm font-medium">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Items</h1>
          <p className="text-gray-600">Discover sustainable fashion items available for swap and donation.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <button type="submit" className="btn-primary">
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-600'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>

          {showFilters && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select
                    value={filters.size}
                    onChange={(e) => handleFilterChange('size', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Sizes</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>{size.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Conditions</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Types</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      handleFilterChange('sortBy', sortBy);
                      handleFilterChange('sortOrder', sortOrder);
                    }}
                    className="input-field"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="views-desc">Most Viewed</option>
                    <option value="title-asc">Title A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {items.length} of {pagination.total} items
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : items.length > 0 ? (
          <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {items.map(item => viewMode === 'grid' ? <ItemCard key={item._id} item={item} /> : <ItemList key={item._id} item={item} />)}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                    className={`px-3 py-2 border rounded-md ${
                      pagination.page === i + 1
                        ? 'bg-green-600 text-white border-green-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;
