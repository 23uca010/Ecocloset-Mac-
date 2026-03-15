import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
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
  ChevronDown,
  Star,
  Shield,
  Truck
} from 'lucide-react';

const AddListing = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    color: '',
    brand: '',
    condition: '',
    type: 'sell',
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
      pickupAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    },
    images: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Gray'];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];
  const itemTypes = ['sell', 'swap', 'donation'];
  
  const ngoOptions = [
    'Green Earth Foundation',
    'Helping Hands NGO',
    'Women Empowerment Initiative',
    'Rural Development Trust',
    'Children\'s Future Foundation',
    'Sustainable Fashion Collective'
  ];

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
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    
    for (let file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages.push({
            id: Date.now() + Math.random(),
            preview: event.target.result,
            file: file
          });
          setPreviewImages(prev => [...prev, ...newImages]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (imageId) => {
    setPreviewImages(prev => prev.filter(img => img.id !== imageId));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.size) {
      newErrors.size = 'Size is required';
    }
    
    if (!formData.condition) {
      newErrors.condition = 'Condition is required';
    }
    
    if (formData.type === 'sell' && !formData.price) {
      newErrors.price = 'Price is required for selling';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for JSON sending as per user instructions
      const submissionData = {
        title: formData.title,
        brand: formData.brand,
        price: formData.price || 0,
        description: formData.description,
        category: formData.category,
        size: formData.size,
        color: formData.color,
        condition: formData.condition,
        listingType: formData.type,
        image: previewImages.length > 0 ? previewImages[0].preview : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800'
      };

      const response = await fetch("http://localhost:5000/api/items/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create listing');
      }
      
      // Show success message
      alert('Listing created successfully!');
      navigate('/items');
    } catch (error) {
      console.error('Error creating listing:', error);
      setErrors({ submit: error.message || 'Failed to create listing. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <X className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Create Listing</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Shield className="h-6 w-6 text-green-600" />
              <span className="text-sm text-gray-600">Protected by EcoSwap</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Create New Listing</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-semibold">1</span>
                  </div>
                  <span className="text-sm text-gray-600">Basic Info</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 font-semibold">2</span>
                  </div>
                  <span className="text-sm text-gray-600">Details</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 font-semibold">3</span>
                  </div>
                  <span className="text-sm text-gray-600">Photos</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-semibold">4</span>
                  </div>
                  <span className="text-sm text-gray-600">Review</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Vintage Denim Jacket"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your item, its condition, and any special features..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size *
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select size</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  {errors.size && (
                    <p className="text-red-500 text-sm mt-1">{errors.size}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color *
                  </label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select color</option>
                    {colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                  {errors.color && (
                    <p className="text-red-500 text-sm mt-1">{errors.color}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Levi's, Zara, H&M"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select condition</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                  {errors.condition && (
                    <p className="text-red-500 text-sm mt-1">{errors.condition}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Photos */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previewImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  {previewImages.length < 4 && (
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Add up to 4 photos</p>
                        <p className="text-xs text-gray-500">JPG, PNG up to 10MB each</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Listing Type */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Type</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {itemTypes.map(type => (
                  <label key={type} className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={handleInputChange}
                      className="mr-3 text-green-600"
                    />
                    <div>
                      <div className="flex items-center">
                        {type === 'sell' && <IndianRupee className="h-5 w-5 text-green-600 mr-2" />}
                        {type === 'swap' && <Recycle className="h-5 w-5 text-blue-600 mr-2" />}
                        {type === 'donation' && <Gift className="h-5 w-5 text-purple-600 mr-2" />}
                        <span className="font-medium capitalize">{type}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {type === 'sell' && 'Set a fixed price for your item'}
                        {type === 'swap' && 'Exchange with other community members'}
                        {type === 'donation' && 'Donate to a good cause'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {formData.type === 'sell' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
              )}
            </div>

            {/* Advanced Options */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-green-600 hover:text-green-700 font-medium flex items-center"
              >
                <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                Advanced Options
              </button>
            </div>

            {showAdvanced && (
              <div className="mt-6 space-y-6 border-t pt-6">
                {/* Swap Preferences */}
                {formData.type === 'swap' && (
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Swap Preferences</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categories you're interested in
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {categories.map(category => (
                          <label key={category} className="flex items-center">
                            <input
                              type="checkbox"
                              name="swapPreferences.categories"
                              value={category}
                              checked={formData.swapPreferences.categories.includes(category)}
                              onChange={handleInputChange}
                              className="mr-2 text-green-600 rounded"
                            />
                            <span className="text-sm text-gray-700">{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sizes you're interested in
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {sizes.map(size => (
                          <label key={size} className="flex items-center">
                            <input
                              type="checkbox"
                              name="swapPreferences.sizes"
                              value={size}
                              checked={formData.swapPreferences.sizes.includes(size)}
                              onChange={handleInputChange}
                              className="mr-2 text-green-600 rounded"
                            />
                            <span className="text-sm text-gray-700">{size}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Colors you're interested in
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {colors.map(color => (
                          <label key={color} className="flex items-center">
                            <input
                              type="checkbox"
                              name="swapPreferences.colors"
                              value={color}
                              checked={formData.swapPreferences.colors.includes(color)}
                              onChange={handleInputChange}
                              className="mr-2 text-green-600 rounded"
                            />
                            <span className="text-sm text-gray-700">{color}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional notes
                      </label>
                      <textarea
                        name="swapPreferences.notes"
                        value={formData.swapPreferences.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Any specific requirements or preferences for the swap..."
                      />
                    </div>
                  </div>
                )}

                {/* Donation Information */}
                {formData.type === 'donation' && (
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Donation Information</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred NGO
                      </label>
                      <select
                        name="donationInfo.preferredNGO"
                        value={formData.donationInfo.preferredNGO}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select NGO (optional)</option>
                        {ngoOptions.map(ngo => (
                          <option key={ngo} value={ngo}>{ngo}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="donationInfo.pickupAvailable"
                          checked={formData.donationInfo.pickupAvailable}
                          onChange={handleInputChange}
                          className="mr-2 text-green-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Pickup available</span>
                      </label>
                    </div>

                    {formData.donationInfo.pickupAvailable && (
                      <div className="mt-4 space-y-4">
                        <h5 className="text-sm font-medium text-gray-900 mb-4">Pickup Address</h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">
                              Street Address
                            </label>
                            <input
                              type="text"
                              name="donationInfo.pickupAddress.street"
                              value={formData.donationInfo.pickupAddress.street}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="123 Main St"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              name="donationInfo.pickupAddress.city"
                              value={formData.donationInfo.pickupAddress.city}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="New York"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">
                              State
                            </label>
                            <input
                              type="text"
                              name="donationInfo.pickupAddress.state"
                              value={formData.donationInfo.pickupAddress.state}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="NY"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              name="donationInfo.pickupAddress.zipCode"
                              value={formData.donationInfo.pickupAddress.zipCode}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="10001"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-t-2 border-green-600 mr-2"></div>
                    Creating Listing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Create Listing
                  </>
                )}
              </button>
              
              {errors.submit && (
                <p className="text-red-500 text-sm mt-2 text-center">{errors.submit}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddListing;
