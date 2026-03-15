import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  X, 
  Plus, 
  Package, 
  Tag, 
  IndianRupee, 
  MapPin, 
  User, 
  Heart, 
  Recycle, 
  Gift, 
  CheckCircle, 
  AlertCircle,
  Image as ImageIcon,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';

const SellSwap = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    color: '',
    brand: '',
    condition: '',
    type: 'swap',
    price: '',
    swapPreferences: {
      categories: [],
      sizes: [],
      colors: [],
      notes: ''
    },
    donationInfo: {
      preferredNGO: '',
      pickupAvailable: false,
      pickupAddress: ''
    }
  });
  
  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Bags', 'Jewelry'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
  const conditions = ['new', 'like_new', 'good', 'fair', 'poor'];
  const colors = ['Black', 'White', 'Gray', 'Brown', 'Blue', 'Green', 'Red', 'Pink', 'Purple', 'Yellow', 'Orange'];
  const swapCategories = categories;
  const ngos = ['Green Earth Foundation', 'Fashion for Good', 'Sustainable Style Initiative', 'Eco Fashion Alliance'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.includes('swapPreferences')) {
      const [parent, child] = name.split('.');
      if (type === 'checkbox') {
        const currentArray = formData.swapPreferences[child] || [];
        const newArray = checked
          ? [...currentArray, value]
          : currentArray.filter(item => item !== value);
        setFormData(prev => ({
          ...prev,
          swapPreferences: {
            ...prev.swapPreferences,
            [child]: newArray
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setPreviewImages(prev => [...prev, ...newImages]);
    setErrors(prev => ({ ...prev, images: '' }));
  };

  const removeImage = (imageId) => {
    setPreviewImages(prev => prev.filter(img => img.id !== imageId));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if ((formData.type === 'sell' || formData.type === 'both') && !formData.price) newErrors.price = 'Price is required for sale items';
    if ((formData.type === 'sell' || formData.type === 'both') && formData.price && parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    
    if (previewImages.length === 0) newErrors.images = 'At least one image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', user?.id || null);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('size', formData.size);
      formDataToSend.append('color', formData.color);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('listingType', formData.type);
      formDataToSend.append('price', (formData.type === 'sell' || formData.type === 'both') ? formData.price : 0);
      
      if (previewImages.length > 0 && previewImages[0].file) {
        formDataToSend.append('image', previewImages[0].file);
      }

      const response = await fetch('http://localhost:5000/api/items/create', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to list item');
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        size: '',
        color: '',
        brand: '',
        condition: '',
        type: 'swap',
        price: '',
        swapPreferences: {
          categories: [],
          sizes: [],
          colors: [],
          notes: ''
        },
        donationInfo: {
          preferredNGO: '',
          pickupAvailable: false,
          pickupAddress: ''
        }
      });
      setPreviewImages([]);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/items');
      }, 2000);
      
    } catch (error) {
      console.error('Error listing item:', error);
      setSubmitError(error.message || 'Failed to list item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Left Side - Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Recycle className="h-8 w-8 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">EcoCloset</h1>
              </div>
              <div className="hidden md:block text-gray-500">|</div>
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold text-gray-700">List Your Item</h2>
              </div>
            </div>

            {/* Right Side - User Profile */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="bg-transparent outline-none text-sm w-48"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile Dropdown */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">{user?.firstName || user?.email?.split('@')[0] || 'Guest'}</p>
                  <p className="text-xs text-gray-500">Premium Member</p>
                </div>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="h-8 w-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                    <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Package className="h-4 w-4 mr-2" />
                      My Listings
                    </Link>
                    <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <hr className="my-1" />
                    <button 
                      onClick={() => {
                        // Handle logout
                        navigate('/login');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - List Your Item Only */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">List Your Item</h1>
          <p className="text-lg text-gray-600">List your clothing items for swap or sale on EcoCloset</p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6 flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">Item Listed Successfully!</h3>
              <p className="text-green-700">Your item has been listed and will be visible to other users. Redirecting to dashboard...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6 flex items-center">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{submitError}</p>
            </div>
          </div>
        )}

        {/* List Your Item Form - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Information Section */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center mb-8">
                  <div className="bg-green-100 p-4 rounded-xl mr-4">
                    <Tag className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                    <p className="text-base text-gray-600">Tell us about your item</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Item Title *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pl-14 text-base"
                        placeholder="e.g., Vintage Denim Jacket"
                      />
                      <Tag className="absolute left-5 top-4 h-5 w-5 text-gray-400" />
                    </div>
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.title}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        Brand
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pl-14 text-base"
                          placeholder="e.g., Levi's, H&M"
                        />
                        <Package className="absolute left-5 top-4 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        Price *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pl-14 text-base"
                          placeholder="0"
                        />
                        <IndianRupee className="absolute left-5 top-4 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.price}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Description *
                    </label>
                    <div className="relative">
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-base"
                        placeholder="Describe your item, its condition, and any special features..."
                      />
                    </div>
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Item Details Section */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center mb-8">
                  <div className="bg-blue-100 p-4 rounded-xl mr-4">
                    <Package className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Item Details</h2>
                    <p className="text-base text-gray-600">Specify the details of your item</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white text-base"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-4 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.category}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Size
                    </label>
                    <div className="relative">
                      <select
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white text-base"
                      >
                        <option value="">Select Size</option>
                        {sizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-4 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Color
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base"
                        placeholder="e.g., Blue, Black"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Condition *
                    </label>
                    <div className="relative">
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white text-base"
                      >
                        <option value="">Select Condition</option>
                        {conditions.map(condition => (
                          <option key={condition} value={condition}>{condition.charAt(0).toUpperCase() + condition.slice(1)}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-4 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.condition && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.condition}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Listing Type *
                    </label>
                    <div className="relative">
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white text-base"
                      >
                        <option value="swap">For Swap</option>
                        <option value="sell">For Sale</option>
                        <option value="both">For Swap & Sale</option>
                        <option value="donate">For Donation</option>
                      </select>
                      <div className="absolute right-5 top-4 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap Preferences Section - Only show for swap or both */}
              {(formData.type === 'swap' || formData.type === 'both') && (
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center mb-8">
                    <div className="bg-orange-100 p-4 rounded-xl mr-4">
                      <Recycle className="h-7 w-7 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Swap Preferences</h2>
                      <p className="text-base text-gray-600">What would you like to swap this item for?</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        Preferred Categories
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {swapCategories.map(cat => (
                          <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="swapPreferences.categories"
                              value={cat}
                              checked={formData.swapPreferences.categories.includes(cat)}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-base text-gray-700">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        Preferred Sizes
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {sizes.map(size => (
                          <label key={size} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="swapPreferences.sizes"
                              value={size}
                              checked={formData.swapPreferences.sizes.includes(size)}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-base text-gray-700">{size}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        Preferred Colors
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {colors.map(color => (
                          <label key={color} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="swapPreferences.colors"
                              value={color}
                              checked={formData.swapPreferences.colors.includes(color)}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-base text-gray-700">{color.charAt(0).toUpperCase() + color.slice(1)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        Additional Notes
                      </label>
                      <textarea
                        name="swapPreferences.notes"
                        value={formData.swapPreferences.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-base"
                        placeholder="Any specific preferences or requirements for the swap..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Donation Info Section - Only show for donate */}
              {formData.type === 'donate' && (
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center mb-8">
                    <div className="bg-pink-100 p-4 rounded-xl mr-4">
                      <Heart className="h-7 w-7 text-pink-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Donation Information</h2>
                      <p className="text-base text-gray-600">How would you like to donate this item?</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        Preferred NGO
                      </label>
                      <div className="relative">
                        <select
                          name="donationInfo.preferredNGO"
                          value={formData.donationInfo.preferredNGO}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white text-base"
                        >
                          <option value="">Select NGO (Optional)</option>
                          {ngos.map(ngo => (
                            <option key={ngo} value={ngo}>{ngo}</option>
                          ))}
                        </select>
                        <div className="absolute right-5 top-4 pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="donationInfo.pickupAvailable"
                          checked={formData.donationInfo.pickupAvailable}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-base font-semibold text-gray-700">Pickup Available</span>
                      </label>
                      <p className="text-sm text-gray-500 mt-2 ml-8">Check if you can offer pickup service for this donation</p>
                    </div>
                    
                    {formData.donationInfo.pickupAvailable && (
                      <div>
                        <label className="block text-base font-semibold text-gray-700 mb-3">
                          Pickup Address
                        </label>
                        <textarea
                          name="donationInfo.pickupAddress"
                          value={formData.donationInfo.pickupAddress}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-base"
                          placeholder="Enter your pickup address..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-between items-center pt-6">
                <Link
                  to="/dashboard"
                  className="px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-semibold text-base"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg font-semibold text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Listing...
                    </>
                  ) : (
                    <>
                      <Package className="h-5 w-5 mr-3" />
                      List Item
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Images and Preview */}
          <div className="space-y-8">
            {/* Images Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-8">
                <div className="bg-purple-100 p-4 rounded-xl mr-4">
                  <Camera className="h-7 w-7 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Item Images</h2>
                  <p className="text-base text-gray-600">Add photos of your item</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {previewImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-green-500 transition-colors flex flex-col items-center justify-center h-40 bg-gray-50">
                  <Upload className="h-10 w-10 text-gray-400 mb-3" />
                  <span className="text-base text-gray-600 font-medium">Add Photo</span>
                  <span className="text-xs text-gray-500 mt-1">JPG, PNG up to 10MB</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.images && (
                <p className="text-red-500 text-sm mt-3 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.images}
                </p>
              )}
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
                <span className="text-2xl mr-3">💡</span>
                Listing Tips
              </h3>
              <ul className="space-y-4 text-base text-blue-800">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Take clear photos in good lighting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Show multiple angles of the item</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Include details about brand and condition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Be honest about any flaws or wear</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Set competitive pricing for faster sales</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellSwap;
