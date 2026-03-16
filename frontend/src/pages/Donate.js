import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, Users, Target, TrendingUp, MapPin, ExternalLink, ShieldCheck, Award,
  Upload, Camera, X, Plus, CheckCircle, AlertCircle, Info, Package,
  Home as HomeIcon, Truck
} from 'lucide-react';

const NGO_LIST = [
  { id: 1, name: "Goonj", description: "Focused on dignified disaster relief and humanitarian aid, connecting urban surplus with rural and urban poor through clothing.", focusArea: "Clothing Distribution & Disaster Relief", impact: "Reached 2M+ people across India", location: "Pan-India", verified: true, image: "https://images.pexels.com/photos/6608822/pexels-photo-6608822.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 2, name: "Eco Femme", description: "Promotes sustainable fashion while empowering rural women artisans and menstrual health education.", focusArea: "Sustainable Fashion & Women Empowerment", impact: "Empowered 500+ rural artisans", location: "Tamil Nadu", verified: true, image: "https://images.pexels.com/photos/7750106/pexels-photo-7750106.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 3, name: "Clothes Box Foundation", description: "Providing clothing to underprivileged children and families through sustainable fashion drives.", focusArea: "Children's Clothing & Education", impact: "Clothed 50K+ children annually", location: "Mumbai & Delhi", verified: true, image: "https://images.pexels.com/photos/6995244/pexels-photo-6995244.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 4, name: "ReCircle", description: "India's first circular fashion marketplace connecting brands, NGOs, and consumers to divert textile waste.", focusArea: "Textile Recycling & Circular Economy", impact: "Recycled 100+ tons of textiles", location: "Bangalore", verified: true, image: "https://images.pexels.com/photos/6002131/pexels-photo-6002131.jpeg?auto=compress&cs=tinysrgb&w=800" }
];

const Donate = () => {
  const { isAuthenticated, user, api } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ngos');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState({});

  // Item Donation State
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', size: '', condition: '',
    donationType: 'charity', pickupAvailable: false, pickupAddress: '',
    location: '', preferredNGO: '',
  });

  // NGO Modal State
  const [selectedNGOForModal, setSelectedNGOForModal] = useState(null);
  const [ngoFormData, setNgoFormData] = useState({
    donationType: 'clothing',
    clothesDescription: '',
    phoneNumber: '',
    name: '',
    email: '',
    message: ''
  });
  const [ngoSubmitSuccess, setNgoSubmitSuccess] = useState(false);
  const [ngoSubmitError, setNgoSubmitError] = useState('');
  const [ngoIsSubmitting, setNgoIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && selectedNGOForModal) {
      setNgoFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phone || ''
      }));
    }
  }, [user, selectedNGOForModal]);

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Bags', 'Jewelry'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const conditions = ['new', 'like_new', 'good', 'fair'];
  const ngoOptions = NGO_LIST.map(n => n.name);

  // General Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleNgoInputChange = (e) => {
    const { name, value } = e.target;
    setNgoFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({ id: Math.random().toString(36).substr(2, 9), file, preview: URL.createObjectURL(file) }));
    setPreviewImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => setPreviewImages(prev => prev.filter(img => img.id !== id));

  // Item Donation Submit
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (previewImages.length === 0) newErrors.images = 'At least one image is required';
    if (formData.pickupAvailable && !formData.pickupAddress.trim()) newErrors.pickupAddress = 'Pickup address is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const fd = new FormData();
      fd.append('user_id', user?.id || null);
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('category', formData.category);
      fd.append('size', formData.size);
      fd.append('condition', formData.condition);
      fd.append('listingType', 'donate');
      fd.append('price', 0);
      if (previewImages.length > 0 && previewImages[0].file) fd.append('image', previewImages[0].file);
      const response = await fetch('http://localhost:5000/api/items/create', { method: 'POST', body: fd });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit donation');
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => navigate('/browse'), 2000);
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // NGO Modal Submit
  const handleNgoSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    
    // Validation
    if (ngoFormData.donationType === 'clothing' && !ngoFormData.clothesDescription.trim()) {
       setNgoSubmitError("Clothes description is required.");
       return;
    }
    if (!ngoFormData.phoneNumber.trim() || !ngoFormData.name.trim() || !ngoFormData.email.trim()) {
       setNgoSubmitError("Name, Email, and Phone Number are required.");
       return;
    }

    setNgoIsSubmitting(true);
    setNgoSubmitError('');

    try {
      await api.post('/donations', {
        ngoName: selectedNGOForModal.name,
        donationType: ngoFormData.donationType,
        clothesDescription: ngoFormData.donationType === 'clothing' ? ngoFormData.clothesDescription : null,
        phoneNumber: ngoFormData.phoneNumber,
        name: ngoFormData.name,
        email: ngoFormData.email,
        message: ngoFormData.message
      });
      setNgoSubmitSuccess(true);
      setTimeout(() => {
        setNgoSubmitSuccess(false);
        setSelectedNGOForModal(null);
      }, 3000);
    } catch (err) {
      setNgoSubmitError(err.response?.data?.message || 'Failed to submit donation request.');
    } finally {
      setNgoIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#108c4b] to-emerald-500 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-5">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">Give Back Through Fashion</h1>
          <p className="text-green-100 text-lg max-w-xl mx-auto">Support verified NGOs or donate your pre-loved clothes directly to those in need.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-x divide-gray-100">
            {[
              { icon: Users, val: '2.5M+', label: 'Lives Impacted', color: 'text-[#108c4b] bg-green-100' },
              { icon: Target, val: '4', label: 'Partner NGOs', color: 'text-teal-700 bg-teal-100' },
              { icon: TrendingUp, val: '₹5.2Cr', label: 'Total Donations', color: 'text-lime-700 bg-lime-100' },
              { icon: Award, val: '100+', label: 'Verified Partners', color: 'text-amber-700 bg-amber-100' },
            ].map((s) => (
              <div key={s.label} className="text-center px-4">
                <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-extrabold text-gray-900 mb-0.5">{s.val}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl w-fit border border-gray-200">
          <button
            onClick={() => setActiveTab('ngos')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'ngos' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Target className="h-4 w-4" /> Partner NGOs
          </button>
          <button
            onClick={() => setActiveTab('item')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'item' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Package className="h-4 w-4" /> Donate an Item
          </button>
        </div>

        {/* NGOs Tab */}
        {activeTab === 'ngos' && (
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Our Partner Organizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {NGO_LIST.map((ngo) => (
                <div key={ngo.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col group">
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img src={ngo.image} alt={ngo.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {ngo.verified && (
                      <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col items-center text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{ngo.name}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-xs font-semibold mb-3">
                      <Target className="h-3.5 w-3.5 text-green-600" /> {ngo.focusArea}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">{ngo.description}</p>
                    
                    <button
                      onClick={() => { setSelectedNGOForModal(ngo); setNgoSubmitError(''); setNgoSubmitSuccess(false); }}
                      className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-xl hover:bg-indigo-700 transition-colors font-bold text-sm flex items-center justify-center gap-2 shadow-sm">
                      <Heart className="h-4 w-4" /> Donate
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* How it Works */}
            <div className="mt-16 bg-white border border-gray-100 rounded-2xl p-8 lg:p-12 shadow-sm">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">How Your Donation Helps</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="hidden md:block absolute top-10 left-1/6 w-2/3 h-0.5 bg-gray-100 -z-10"></div>
                {[
                  { step: '1', title: 'Choose an NGO', desc: 'Browse our verified partners and select one based on their focus and impact.', icon: Target },
                  { step: '2', title: 'Donate Your Item', desc: 'List your pre-loved item using our simple form and select the NGO to receive it.', icon: Package },
                  { step: '3', title: 'Track Your Impact', desc: 'Receive updates on how your contribution is making a difference in communities.', icon: TrendingUp },
                ].map((s) => (
                  <div key={s.step} className="bg-white text-center">
                    <div className="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-5 text-2xl font-extrabold border-4 border-white shadow-sm shadow-green-100">
                      <s.icon className="h-8 w-8 text-[#108c4b]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed px-4">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Donate Item Tab */}
        {activeTab === 'item' && (
          <div>
            {submitSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 shrink-0" />
                <div><h3 className="font-semibold text-green-800">Donation Listed!</h3><p className="text-green-700 text-sm mt-0.5">Thank you for your generosity. Redirecting...</p></div>
              </div>
            )}
            {submitError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 shrink-0" />
                <div><h3 className="font-semibold text-red-800">Error</h3><p className="text-red-700 text-sm mt-0.5">{submitError}</p></div>
              </div>
            )}

            <form id="donate-form" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">

                  {/* Basic Info */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center gap-4 p-6 border-b border-gray-100 bg-gray-50/50">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Package className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Item Information</h2>
                        <p className="text-sm text-gray-500">Tell us what you'd like to donate</p>
                      </div>
                    </div>
                    <div className="p-6 space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Item Title <span className="text-red-500">*</span></label>
                        <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all text-gray-900 bg-gray-50 focus:bg-white ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
                          placeholder="e.g., Winter Coat, Kids T-shirts" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Description <span className="text-red-500">*</span></label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all bg-gray-50 focus:bg-white resize-none text-gray-900 ${errors.description ? 'border-red-400' : 'border-gray-200'}`}
                          placeholder="Describe the item(s) you're donating..." />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Category <span className="text-red-500">*</span></label>
                          <select name="category" value={formData.category} onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 bg-gray-50 text-gray-700 font-medium ${errors.category ? 'border-red-400' : 'border-gray-200'}`}>
                            <option value="">Category</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Condition <span className="text-red-500">*</span></label>
                          <select name="condition" value={formData.condition} onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 bg-gray-50 text-gray-700 font-medium ${errors.condition ? 'border-red-400' : 'border-gray-200'}`}>
                            <option value="">Condition</option>
                            {conditions.map(c => <option key={c} value={c}>{c.replace('_', ' ').toUpperCase()}</option>)}
                          </select>
                        </div>
                        <div>
                           <label className="block text-sm font-semibold text-gray-800 mb-1.5">Size</label>
                           <select name="size" value={formData.size} onChange={handleInputChange}
                             className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 bg-gray-50 text-gray-700 font-medium">
                             <option value="">Size</option>
                             {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Donation Type */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center gap-4 p-6 border-b border-gray-100 bg-gray-50/50">
                      <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                        <Heart className="h-5 w-5 text-rose-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Donation Details</h2>
                        <p className="text-sm text-gray-500">How would you like to donate?</p>
                      </div>
                    </div>
                    <div className="p-6 space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">Donation Type</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { val: 'charity', label: 'To a Charity / NGO', icon: Heart },
                            { val: 'user', label: 'Direct to a User', icon: Users },
                          ].map(opt => (
                            <label key={opt.val} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.donationType === opt.val ? 'border-[#108c4b] bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                              <input type="radio" name="donationType" value={opt.val} checked={formData.donationType === opt.val} onChange={handleInputChange} className="hidden" />
                              <opt.icon className={`h-5 w-5 ${formData.donationType === opt.val ? 'text-[#108c4b]' : 'text-gray-400'}`} />
                              <span className={`text-sm font-semibold ${formData.donationType === opt.val ? 'text-[#108c4b]' : 'text-gray-700'}`}>{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {formData.donationType === 'charity' && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Preferred NGO</label>
                          <select name="preferredNGO" value={formData.preferredNGO} onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 bg-gray-50 text-gray-700 font-medium">
                            <option value="">Any verified NGO partner</option>
                            {ngoOptions.map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Your Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 bg-gray-50 focus:bg-white text-gray-900"
                            placeholder="e.g., Mumbai, Maharashtra" />
                        </div>
                      </div>

                      <div className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.pickupAvailable ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                        <input type="checkbox" id="pickupAvailable" name="pickupAvailable" checked={formData.pickupAvailable} onChange={handleInputChange}
                          className="h-5 w-5 text-[#108c4b] mt-0.5 rounded cursor-pointer" />
                        <div>
                          <label htmlFor="pickupAvailable" className="text-sm font-semibold text-gray-800 cursor-pointer flex items-center gap-2">
                            <Truck className="h-4 w-4 text-[#108c4b]" /> Pickup Required
                          </label>
                          <p className="text-xs text-gray-500 mt-0.5">A volunteer can pick up from your address</p>
                        </div>
                      </div>

                      {formData.pickupAvailable && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Pickup Address <span className="text-red-500">*</span></label>
                          <textarea name="pickupAddress" value={formData.pickupAddress} onChange={handleInputChange} rows={3}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-500 bg-gray-50 focus:bg-white resize-none text-gray-900 ${errors.pickupAddress ? 'border-red-400' : 'border-gray-200'}`}
                            placeholder="Full address including pincode..." />
                          {errors.pickupAddress && <p className="text-red-500 text-xs mt-1">{errors.pickupAddress}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Images & Submit */}
                <div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                    <div className="flex items-center gap-3 p-6 border-b border-gray-100 bg-gray-50/50">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Camera className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Photos <span className="text-red-500">*</span></h2>
                        <p className="text-xs text-gray-500">Show the item clearly</p>
                      </div>
                    </div>
                    <div className="p-5">
                      {previewImages.length === 0 ? (
                        <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-green-400 hover:bg-green-50 transition-all flex flex-col items-center justify-center h-48 cursor-pointer bg-gray-50">
                          <Upload className="h-10 w-10 text-gray-400 mb-3" />
                          <span className="text-sm font-semibold text-gray-700">Upload Photos</span>
                          <span className="text-xs text-gray-400 mt-1 text-center">JPG, PNG allowed</span>
                          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {previewImages.map((img, idx) => (
                            <div key={img.id} className={`relative group rounded-xl overflow-hidden border-2 bg-gray-100 ${idx === 0 ? 'col-span-2 h-52 border-green-200' : 'h-28 border-gray-200'}`}>
                              <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button type="button" onClick={() => removeImage(img.id)} className="bg-white text-red-600 p-1.5 rounded-full shadow"><X className="h-4 w-4" /></button>
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
                      {errors.images && <p className="text-red-500 text-xs mt-3 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" /> {errors.images}</p>}
                    </div>
                    <div className="p-5 border-t border-gray-100">
                      <button type="submit" form="donate-form" disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#108c4b] to-emerald-500 text-white py-4 px-6 rounded-xl hover:from-[#0d7a40] hover:to-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center font-bold text-base shadow-lg shadow-green-200">
                        {isSubmitting ? (
                          <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Processing...</>
                        ) : (
                          <><Heart className="h-5 w-5 mr-2" />Donate Item</>
                        )}
                      </button>
                      <p className="text-xs text-gray-400 text-center mt-3">100% of donations go to verified recipients.</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* NGO Donation Modal */}
      {selectedNGOForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all relative" onClick={(e) => e.stopPropagation()}>
             {/* Header */}
             <div className="bg-gray-50 border-b border-gray-100 p-5 flex items-center justify-between">
               <h3 className="text-xl font-bold text-gray-900">Donate to {selectedNGOForModal.name}</h3>
               <button onClick={() => setSelectedNGOForModal(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
                 <X className="h-5 w-5" />
               </button>
             </div>

             {ngoSubmitSuccess ? (
                <div className="p-10 text-center">
                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <CheckCircle className="h-8 w-8 text-green-600" />
                   </div>
                   <h4 className="text-2xl font-bold text-gray-900 mb-2">Donation Request Sent!</h4>
                   <p className="text-gray-500 mb-6">Thank you for your generosity. The NGO will contact you shortly to arrange the donation.</p>
                   <button onClick={() => setSelectedNGOForModal(null)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition">
                      Close
                   </button>
                </div>
             ) : (
                <form onSubmit={handleNgoSubmit} className="p-6">
                  {ngoSubmitError && (
                    <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                      {ngoSubmitError}
                    </div>
                  )}

                  <div className="space-y-4">
                     {/* Donation Type */}
                     <div>
                       <label className="block text-sm font-semibold text-gray-800 mb-2">Donation Type</label>
                       <div className="flex items-center gap-6">
                         <label className="flex items-center gap-2 cursor-pointer">
                           <input type="radio" name="donationType" value="monetary" checked={ngoFormData.donationType === 'monetary'} onChange={handleNgoInputChange} className="w-4 h-4 text-indigo-600 cursor-pointer" />
                           <span className="text-sm font-medium text-gray-900">Monetary Donation</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer">
                           <input type="radio" name="donationType" value="clothing" checked={ngoFormData.donationType === 'clothing'} onChange={handleNgoInputChange} className="w-4 h-4 text-indigo-600 cursor-pointer" />
                           <span className="text-sm font-medium text-gray-900">Clothing Donation</span>
                         </label>
                       </div>
                     </div>

                     {/* Describe Clothes */}
                     {ngoFormData.donationType === 'clothing' && (
                       <div>
                         <label className="block text-sm font-semibold text-gray-800 mb-1">Describe the Clothes <span className="text-red-500">*</span></label>
                         <textarea name="clothesDescription" value={ngoFormData.clothesDescription} onChange={handleNgoInputChange} rows={3}
                           className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-sm resize-none"
                           placeholder="Eg., 5 t-shirts, 3 jeans, 2 dresses - all in good condition" />
                       </div>
                     )}

                     {/* Phone & Name */}
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-semibold text-gray-800 mb-1">Phone Number <span className="text-red-500">*</span></label>
                         <input type="tel" name="phoneNumber" value={ngoFormData.phoneNumber} onChange={handleNgoInputChange}
                           className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-sm" placeholder="+91..." />
                       </div>
                       <div>
                         <label className="block text-sm font-semibold text-gray-800 mb-1">Your Name <span className="text-red-500">*</span></label>
                         <input type="text" name="name" value={ngoFormData.name} onChange={handleNgoInputChange}
                           className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-sm" />
                       </div>
                     </div>

                     {/* Email */}
                     <div>
                       <label className="block text-sm font-semibold text-gray-800 mb-1">Your Email <span className="text-red-500">*</span></label>
                       <input type="email" name="email" value={ngoFormData.email} onChange={handleNgoInputChange}
                         className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-sm" />
                     </div>

                     {/* Message */}
                     <div>
                       <label className="block text-sm font-semibold text-gray-800 mb-1">Additional Message (Optional)</label>
                       <textarea name="message" value={ngoFormData.message} onChange={handleNgoInputChange} rows={2}
                         className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-sm resize-none"
                         placeholder="Any specific instructions..." />
                     </div>
                  </div>

                  <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                     <button type="button" onClick={() => setSelectedNGOForModal(null)} className="px-5 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition text-sm">
                       Cancel
                     </button>
                     <button type="submit" disabled={ngoIsSubmitting} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition flex items-center shadow-sm shadow-indigo-200 disabled:opacity-70 text-sm">
                       {ngoIsSubmitting ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" /> : null}
                       Submit Donation Request
                     </button>
                  </div>
                </form>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Donate;
