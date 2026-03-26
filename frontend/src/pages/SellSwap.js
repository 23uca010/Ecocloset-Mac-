import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  X, 
  Package, 
  Tag, 
  IndianRupee, 
  Recycle, 
  Heart, 
  CheckCircle, 
  AlertCircle,
  ShoppingBag,
  Info,
  Plus
} from 'lucide-react';

const SellSwap = () => {
  const { user, api } = useAuth();
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
    
    if (name.startsWith('swapPreferences.') && type === 'checkbox') {
      const child = name.split('.')[1];
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
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
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
    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
      formDataToSend.append('price', (formData.type === 'sell' || formData.type === 'both') ? Number(formData.price) : '');
      
      if (previewImages.length > 0 && previewImages[0].file) {
        formDataToSend.append('image', previewImages[0].file);
      }

      // Use the authenticated api instance from useAuth
      const response = await api.post('/items/create', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to list item');
      }
      
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        navigate('/browse');
      }, 2000);
      
    } catch (error) {
      console.error('Error listing item:', error);
      setSubmitError(error.message || 'Failed to list item. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* Hero Section */}
      <section className="bg-[#1e1b4b] text-white py-24 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-20 h-20 mx-auto rounded-full border-[3px] border-white/40 flex items-center justify-center mb-8 bg-white/10 backdrop-blur-sm">
            <ShoppingBag className="h-10 w-10 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            List Your Item
          </h1>
          <p className="text-lg md:text-2xl text-indigo-100 max-w-4xl mx-auto font-light leading-relaxed">
            Give your pre-loved fashion a second life. Choose to swap, sell, or donate your clothes and join the circular fashion movement.
          </p>
        </div>
        
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        
        {/* Status Messages */}
        {submitSuccess && (
          <div className="mb-10 bg-[#e6f6eb] border-l-4 border-[#108c4b] rounded-r-xl p-6 flex items-start shadow-sm">
            <CheckCircle className="h-6 w-6 text-[#108c4b] mr-4 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-[#108c4b] mb-1">Item Listed Successfully!</h3>
              <p className="text-[#108c4b]/80 font-medium">Your item has been listed and is now visible in the Browse page for everyone. Redirecting to Browse...</p>
            </div>
          </div>
        )}

        {submitError && (
          <div className="mb-10 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-6 flex items-start shadow-sm">
            <AlertCircle className="h-6 w-6 text-red-600 mr-4 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-red-800 mb-1">Error Listing Item</h3>
              <p className="text-red-700 font-medium">{submitError}</p>
            </div>
          </div>
        )}

        {Object.keys(errors).length > 0 && !submitSuccess && !submitError && (
          <div className="mb-10 bg-orange-50 border-l-4 border-orange-500 rounded-r-xl p-6 flex items-start shadow-sm">
            <Info className="h-6 w-6 text-orange-600 mr-4 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-orange-800 mb-1">Please fix the following errors:</h3>
              <ul className="list-disc list-inside text-orange-700 font-medium space-y-1">
                {Object.values(errors).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          
          {/* Left Column - Main Form */}
          <div className="xl:col-span-2 space-y-10">
            <form id="listing-form" onSubmit={handleSubmit} className="space-y-10">
              
              {/* Basic Information Section */}
              <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 p-8 sm:p-10 bg-gray-50/50">
                  <div className="flex items-center">
                    <div className="bg-white p-3 rounded-xl shadow-sm mr-5 border border-gray-100 text-indigo-600">
                      <Tag className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                      <p className="text-gray-500 mt-1 font-medium">Tell us what you are listing.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 sm:p-10 space-y-8">
                  <div>
                    <label className="block text-[1.05rem] font-bold text-gray-800 mb-3">Item Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 text-lg bg-gray-50 focus:bg-white"
                      placeholder="e.g., Vintage Denim Jacket"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[1.05rem] font-bold text-gray-800 mb-3">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 text-lg bg-gray-50 focus:bg-white"
                        placeholder="e.g., Levi's, H&M"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[1.05rem] font-bold text-gray-800 mb-3">Price (₹) <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <IndianRupee className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 text-lg bg-gray-50 focus:bg-white"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[1.05rem] font-bold text-gray-800 mb-3">Description <span className="text-red-500">*</span></label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 text-lg bg-gray-50 focus:bg-white resize-none"
                      placeholder="Describe your item, its condition, and any special features..."
                    />
                  </div>
                </div>
              </div>

              {/* Item Details Section */}
              <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 p-8 sm:p-10 bg-gray-50/50">
                  <div className="flex items-center">
                    <div className="bg-white p-3 rounded-xl shadow-sm mr-5 border border-gray-100 text-[#0f8c85]">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Item Specifications</h2>
                      <p className="text-gray-500 mt-1 font-medium">Categorize your item correctly.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[1.05rem] font-bold text-gray-800 mb-3">Category <span className="text-red-500">*</span></label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white text-lg font-medium text-gray-700"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[1.05rem] font-bold text-gray-800 mb-3">Condition <span className="text-red-500">*</span></label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white text-lg font-medium text-gray-700"
                    >
                      <option value="">Select Condition</option>
                      {conditions.map(c => (
                        <option key={c} value={c}>{c.replace('_', ' ').toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[1.05rem] font-bold text-gray-800 mb-3">Size</label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white text-lg font-medium text-gray-700"
                    >
                      <option value="">Select Size</option>
                      {sizes.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[1.05rem] font-bold text-gray-800 mb-3">Color</label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white text-lg"
                      placeholder="e.g., Navy Blue"
                    />
                  </div>

                  <div className="md:col-span-2 mt-4 pt-8 border-t border-gray-100">
                    <label className="block text-[1.1rem] font-bold text-gray-900 mb-4">What do you want to do with this item? <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['swap', 'sell', 'both', 'donate'].map(t => (
                        <label key={t} className={`
                          cursor-pointer border-2 rounded-xl p-4 text-center transition-all font-semibold
                          ${formData.type === t ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}
                        `}>
                          <input type="radio" name="type" value={t} checked={formData.type === t} onChange={handleInputChange} className="hidden" />
                          <div className="capitalize text-[1.05rem]">{t.replace('both', 'Sell & Swap')}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap Preferences Conditional */}
              {(formData.type === 'swap' || formData.type === 'both') && (
                <div className="bg-white rounded-[1.5rem] shadow-sm border border-orange-100 overflow-hidden">
                  <div className="border-b border-orange-100 p-8 sm:p-10 bg-orange-50/50">
                    <div className="flex items-center">
                      <div className="bg-white p-3 rounded-xl shadow-sm mr-5 border border-orange-100 text-orange-600">
                        <Recycle className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Swap Preferences</h2>
                        <p className="text-gray-500 mt-1 font-medium">What are you looking to receive?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 sm:p-10 space-y-10">
                    <div>
                      <label className="block text-[1.05rem] font-bold text-gray-800 mb-4">Preferred Categories</label>
                      <div className="flex flex-wrap gap-3">
                        {swapCategories.map(cat => (
                          <label key={cat} className={`cursor-pointer px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all ${formData.swapPreferences.categories.includes(cat) ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                            <input type="checkbox" name="swapPreferences.categories" value={cat} checked={formData.swapPreferences.categories.includes(cat)} onChange={handleInputChange} className="hidden" />
                            {cat}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[1.05rem] font-bold text-gray-800 mb-4">Preferred Sizes</label>
                      <div className="flex flex-wrap gap-3">
                        {sizes.map(size => (
                          <label key={size} className={`cursor-pointer px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all ${formData.swapPreferences.sizes.includes(size) ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                            <input type="checkbox" name="swapPreferences.sizes" value={size} checked={formData.swapPreferences.sizes.includes(size)} onChange={handleInputChange} className="hidden" />
                            {size}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[1.05rem] font-bold text-gray-800 mb-3">Additional Swap Notes</label>
                      <textarea
                        name="swapPreferences.notes"
                        value={formData.swapPreferences.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 focus:bg-white resize-none text-lg"
                        placeholder="Any specific brands or styles you absolutely want (or don't want)?"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Donation Info Conditional */}
              {formData.type === 'donate' && (
                <div className="bg-white rounded-[1.5rem] shadow-sm border border-pink-100 overflow-hidden">
                  <div className="border-b border-pink-100 p-8 sm:p-10 bg-pink-50/50">
                    <div className="flex items-center">
                      <div className="bg-white p-3 rounded-xl shadow-sm mr-5 border border-pink-100 text-pink-600">
                        <Heart className="h-6 w-6 fill-current" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Donation Details</h2>
                        <p className="text-gray-500 mt-1 font-medium">Direct your goodwill effectively.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 sm:p-10 space-y-8">
                    <div>
                      <label className="block text-[1.05rem] font-bold text-gray-800 mb-3">Preferred NGO Target</label>
                      <select
                        name="donationInfo.preferredNGO"
                        value={formData.donationInfo.preferredNGO}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white text-lg font-medium text-gray-700"
                      >
                        <option value="">Any verified NGO partner</option>
                        {ngos.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>

                    <div className="flex items-center space-x-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <input
                        type="checkbox"
                        id="pickupAvailable"
                        name="donationInfo.pickupAvailable"
                        checked={formData.donationInfo.pickupAvailable}
                        onChange={handleInputChange}
                        className="h-6 w-6 text-pink-600 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label htmlFor="pickupAvailable" className="text-lg font-bold text-gray-800 cursor-pointer select-none">
                        I need a volunteer to pick this up
                      </label>
                    </div>
                    
                    {formData.donationInfo.pickupAvailable && (
                      <div className="animate-in fade-in slide-in-from-top-4">
                        <label className="block text-[1.05rem] font-bold text-gray-800 mb-3">Pickup Address <span className="text-red-500">*</span></label>
                        <textarea
                          name="donationInfo.pickupAddress"
                          value={formData.donationInfo.pickupAddress}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white resize-none text-lg"
                          placeholder="Your full address including pincode..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Column - Images and Actions */}
          <div className="space-y-10">
            {/* Images Section */}
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden sticky top-8">
              <div className="border-b border-gray-100 p-8 bg-gray-50/50">
                <div className="flex items-center">
                  <div className="bg-white p-3 rounded-xl shadow-sm mr-4 border border-gray-100 text-indigo-600">
                    <Camera className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Photos <span className="text-red-500">*</span></h2>
                </div>
              </div>
              
              <div className="p-8">
                {previewImages.length === 0 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center h-56 cursor-pointer group bg-gray-50">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-indigo-400 group-hover:text-indigo-600" />
                    </div>
                    <span className="text-lg text-gray-800 font-bold">Upload Photos</span>
                    <span className="text-sm text-gray-500 mt-2 font-medium text-center">JPG, PNG allowed.<br/>High quality images sell faster.</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
                
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {previewImages.map((img, idx) => (
                      <div key={img.id} className={`relative group rounded-xl overflow-hidden border-2 flex items-center justify-center bg-gray-100 ${idx === 0 ? 'col-span-2 h-64 border-indigo-200' : 'h-32 border-gray-200'}`}>
                        <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => removeImage(img.id)} className="bg-white text-red-600 p-2 rounded-full hover:scale-110 transition-transform shadow-lg">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        {idx === 0 && <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">Cover</div>}
                      </div>
                    ))}
                    <label className="border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center h-32 cursor-pointer bg-gray-50">
                      <Plus className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm font-bold text-gray-600">Add More</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                )}
                {errors.images && (
                  <p className="text-red-500 text-sm mt-4 font-semibold flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.images}
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                <button
                  type="submit"
                  form="listing-form"
                  disabled={isSubmitting}
                  className="w-full bg-[#1e1b4b] text-white py-5 px-6 rounded-xl hover:bg-indigo-900 transition-colors disabled:opacity-50 flex items-center justify-center font-bold text-[1.15rem] shadow-lg shadow-indigo-900/20"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Publish Listing
                    </>
                  )}
                </button>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 font-medium">By publishing, you agree to our Terms of Service.</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellSwap;
