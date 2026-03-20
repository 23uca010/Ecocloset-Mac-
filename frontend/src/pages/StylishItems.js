import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Search, 
  Filter, 
  ChevronDown,
  ShoppingBag,
  Plus,
  Heart,
  ShoppingCart
} from 'lucide-react';

const StylishItems = () => {
  const [searchParams] = useSearchParams();
  const { api, isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  
  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];
  const listingTypes = [
    { id: 'sell', label: 'For Sale' },
    { id: 'swap_only', label: 'Swap Only' }
  ];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
  
  const sortOptions = [
    { value: 'newest', label: 'Most Recent' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  useEffect(() => {
    // If URL has search, populate it initially
    const query = searchParams.get('search');
    if (query) setSearchQuery(query);

    const fetchItems = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch('http://localhost:5001/api/items');
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        
        if (data.success) {
          const mappedItems = data.data.map(item => ({
            ...item,
            _id: item.id,
            type: item.listingType || 'sell',
            price: Number(item.price),
            seller: item.owner_name || 'Community Member',
            image: item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5001/${item.image}`) : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80'
          }));
          setItems(mappedItems);
        }
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Could not load items. Please make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleTypeChange = (typeId) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) ? prev.filter(t => t !== typeId) : [...prev, typeId]
    );
  };

  const handleSizeChange = (size) => {
     setSelectedSizes(prev => 
       prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
     );
  };

  const filteredItems = items.filter(item => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) return false;
    if (selectedTypes.length > 0 && !selectedTypes.includes(item.type)) return false;
    if (selectedSizes.length > 0 && !selectedSizes.includes(item.size)) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="text-gray-500 font-medium">Loading items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center gap-4 px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
          <p className="text-red-700 font-bold text-lg mb-2">Connection Error</p>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-24 relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Search Bar */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search items by title, description, category, or seller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-green-500 focus:outline-none text-[1.05rem] text-gray-800"
          />
        </div>

        {/* Header Area */}
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Browse Items</h1>
          
          <div className="relative hidden sm:block">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-gray-100 border-none rounded-xl py-3 pl-5 pr-12 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-[#f8f9fa] sticky top-28">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center text-gray-900">
                  Filters
                </h2>
                <Filter className="h-5 w-5 text-gray-400" />
              </div>

              {/* Category */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-[1.1rem]">Category</h3>
                <div className="space-y-3">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex justify-center items-center transition-colors ${
                          selectedCategories.includes(category) ? 'bg-[#108c4b] border-[#108c4b]' : 'border-gray-300 bg-white group-hover:border-green-500'
                        }`}>
                        {selectedCategories.includes(category) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <span className="ml-3 text-[1.05rem] text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Listing Type */}
              <div className="mb-8 border-t border-gray-200 pt-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-[1.1rem]">Listing Type</h3>
                <div className="space-y-3">
                  {listingTypes.map(type => (
                    <label key={type.id} className="flex items-center cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex justify-center items-center transition-colors ${
                          selectedTypes.includes(type.id) ? 'bg-[#108c4b] border-[#108c4b]' : 'border-gray-300 bg-white group-hover:border-green-500'
                        }`}>
                        {selectedTypes.includes(type.id) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedTypes.includes(type.id)}
                        onChange={() => handleTypeChange(type.id)}
                      />
                      <span className="ml-3 text-[1.05rem] text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-[1.1rem]">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className={`w-12 h-10 rounded-lg text-sm font-medium transition-colors border ${
                        selectedSizes.includes(size)
                          ? 'bg-[#108c4b] text-white border-[#108c4b]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Main Grid */}
          <div className="flex-1">
            <p className="text-gray-500 mb-6">{filteredItems.length} items found</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {filteredItems.map(item => (
                <Link to={`/items/${item._id}`} key={item._id} className="block group">
                  <div className="bg-white border border-gray-100 rounded-[1.5rem] overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative h-72 overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 focus:outline-none">
                        <span className={`px-4 py-2 text-sm font-bold rounded-lg shadow-sm ${
                          item.type === 'sell' ? 'bg-white/95 text-gray-900' :
                          'bg-[#108c4b] text-white'
                        }`}>
                          {item.type === 'sell' ? 'For Sale' : item.type === 'swap_only' ? 'Swap Only' : 'Sale or Swap'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 truncate group-hover:text-green-700 transition-colors">{item.title}</h3>
                      <div className="mb-4 text-sm">
                        <span className="text-[#3b82f6] font-medium">{item.condition}</span>
                        <span className="text-gray-400 mx-2">•</span>
                        <span className="text-gray-500">Size {item.size}</span>
                      </div>
                      
                      <div className="flex items-end justify-between mt-6">
                        <span className="text-[1.75rem] font-bold text-[#108c4b]">₹{Math.round(item.price)}</span>
                        <span className="text-sm font-medium text-gray-400 mb-1">by {item.seller}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {filteredItems.length === 0 && (
               <div className="bg-white rounded-[2rem] p-16 text-center border border-gray-100 mt-4">
                 <h3 className="text-xl font-bold text-gray-900 mb-2">
                   {items.length === 0 ? '🌿 No items listed yet' : 'No matching items'}
                 </h3>
                 <p className="text-gray-500">
                   {items.length === 0
                     ? 'Be the first to list something! Head to Sell/Swap to add your first item.'
                     : 'Try adjusting your filters or search query.'}
                 </p>
               </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default StylishItems;
