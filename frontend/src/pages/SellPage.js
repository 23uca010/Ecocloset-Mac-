import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, Upload, X, Tag, IndianRupee, CheckCircle, 
  AlertCircle, Info, Plus, ShoppingCart, Package
} from 'lucide-react';

const SellPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    color: '',
    brand: '',
    condition: '',
    price: '',
  });

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Bags', 'Jewelry'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const conditions = ['new', 'like_new', 'good', 'fair', 'poor'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));
    setPreviewImages(prev => [...prev, ...newImages]);
    if (errors.images) setErrors(prev => ({ ...prev, images: '' }));
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
    if (!formData.price) newErrors.price = 'Price is required for sale items';
    if (formData.price && parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (previewImages.length === 0) newErrors.images = 'At least one image is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError('');
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
      formDataToSend.append('listingType', 'sell');
      formDataToSend.append('price', formData.price);
      if (previewImages.length > 0 && previewImages[0].file) {
        formDataToSend.append('image', previewImages[0].file);
      }
      const response = await fetch('http://localhost:5000/api/items/create', {
        method: 'POST',
        body: formDataToSend,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to list item');
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => navigate('/browse'), 2000);
    } catch (error) {
      setSubmitError(error.message || 'Failed to list item. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-5">
            <ShoppingCart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">Sell Your Item</h1>
          <p className="text-green-100 text-lg max-w-xl mx-auto">List your pre-loved clothing and earn money while giving it a second life.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Status Messages */}
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start shadow-sm">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800">Listed Successfully!</h3>
              <p className="text-green-700 text-sm mt-0.5">Your item is live. Redirecting to browse...</p>
            </div>
          </div>
        )}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700 text-sm mt-0.5">{submitError}</p>
            </div>
          </div>
        )}
        {Object.keys(errors).length > 0 && !submitSuccess && !submitError && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start">
            <Info className="h-5 w-5 text-amber-600 mr-3 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">Please fix the following:</h3>
              <ul className="list-disc list-inside text-amber-700 text-sm mt-1 space-y-0.5">
                {Object.values(errors).map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          </div>
        )}

        <form id="sell-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Column - Form */}
            <div className="xl:col-span-2 space-y-6">

              {/* Basic Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-4 p-6 border-b border-gray-100 bg-gray-50/50">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Tag className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
                    <p className="text-sm text-gray-500">Tell buyers about your item</p>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Item Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all text-gray-900 bg-gray-50 focus:bg-white ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
                      placeholder="e.g., Vintage Denim Jacket"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">Brand</label>
                      <input type="text" name="brand" value={formData.brand} onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all bg-gray-50 focus:bg-white text-gray-900"
                        placeholder="e.g., Levi's, H&M" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">Price (₹) <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="number" name="price" value={formData.price} onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all bg-gray-50 focus:bg-white text-gray-900 ${errors.price ? 'border-red-400' : 'border-gray-200'}`}
                          placeholder="0" />
                      </div>
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Description <span className="text-red-500">*</span></label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all bg-gray-50 focus:bg-white resize-none text-gray-900 ${errors.description ? 'border-red-400' : 'border-gray-200'}`}
                      placeholder="Describe your item, its condition, and any special features..." />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                  </div>
                </div>
              </div>

              {/* Item Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-4 p-6 border-b border-gray-100 bg-gray-50/50">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Item Details</h2>
                    <p className="text-sm text-gray-500">Help buyers find your item</p>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Category <span className="text-red-500">*</span></label>
                    <select name="category" value={formData.category} onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all bg-gray-50 font-medium text-gray-700 ${errors.category ? 'border-red-400' : 'border-gray-200'}`}>
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Condition <span className="text-red-500">*</span></label>
                    <select name="condition" value={formData.condition} onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all bg-gray-50 font-medium text-gray-700 ${errors.condition ? 'border-red-400' : 'border-gray-200'}`}>
                      <option value="">Select Condition</option>
                      {conditions.map(c => <option key={c} value={c}>{c.replace('_', ' ').toUpperCase()}</option>)}
                    </select>
                    {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Size</label>
                    <select name="size" value={formData.size} onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all bg-gray-50 font-medium text-gray-700">
                      <option value="">Select Size</option>
                      {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Color</label>
                    <input type="text" name="color" value={formData.color} onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all bg-gray-50 focus:bg-white text-gray-900"
                      placeholder="e.g., Navy Blue" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Images & Submit */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                <div className="flex items-center gap-3 p-6 border-b border-gray-100 bg-gray-50/50">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Camera className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Photos <span className="text-red-500">*</span></h2>
                    <p className="text-xs text-gray-500">Clear photos sell faster</p>
                  </div>
                </div>
                <div className="p-5">
                  {previewImages.length === 0 ? (
                    <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-green-400 hover:bg-green-50 transition-all flex flex-col items-center justify-center h-48 cursor-pointer bg-gray-50">
                      <Upload className="h-10 w-10 text-gray-400 mb-3" />
                      <span className="text-sm font-semibold text-gray-700">Upload Photos</span>
                      <span className="text-xs text-gray-400 mt-1 text-center">JPG, PNG • High quality photos sell faster</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {previewImages.map((img, idx) => (
                        <div key={img.id} className={`relative group rounded-xl overflow-hidden border-2 bg-gray-100 ${idx === 0 ? 'col-span-2 h-52 border-green-200' : 'h-28 border-gray-200'}`}>
                          <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button type="button" onClick={() => removeImage(img.id)} className="bg-white text-red-600 p-1.5 rounded-full hover:scale-110 transition-transform shadow">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          {idx === 0 && <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg">Cover</div>}
                        </div>
                      ))}
                      <label className="border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all flex flex-col items-center justify-center h-28 cursor-pointer bg-gray-50">
                        <Plus className="h-6 w-6 text-gray-400 mb-1" />
                        <span className="text-xs font-semibold text-gray-500">Add More</span>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                  )}
                  {errors.images && (
                    <p className="text-red-500 text-xs mt-3 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> {errors.images}
                    </p>
                  )}
                </div>
                <div className="p-5 border-t border-gray-100 bg-gray-50/30">
                  <button type="submit" form="sell-form" disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center font-bold text-base shadow-lg shadow-green-200">
                    {isSubmitting ? (
                      <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> Processing...</>
                    ) : (
                      <><ShoppingCart className="h-5 w-5 mr-2" /> List for Sale</>
                    )}
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-3">By publishing, you agree to our Terms of Service.</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellPage;
