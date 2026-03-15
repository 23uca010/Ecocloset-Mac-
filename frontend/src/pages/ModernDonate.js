import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  Gift, 
  Users, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  Package,
  Truck,
  Building,
  CheckCircle,
  Clock,
  TrendingUp,
  Sparkles,
  Filter,
  ChevronDown,
  ArrowRight,
  Globe,
  Target,
  Award,
  Shield,
  Zap,
  Calendar,
  Eye
} from 'lucide-react';

const ModernDonate = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredNGO, setHoveredNGO] = useState(null);

  // Enhanced NGO data with realistic images
  const ngos = [
    {
      id: 1,
      name: "Green Earth Foundation",
      category: "Environment",
      location: "Mumbai, Maharashtra",
      phone: "+91 98765 43210",
      email: "contact@greenearth.org",
      rating: 4.8,
      totalDonations: 15420,
      description: "Leading environmental organization focused on sustainable fashion and textile recycling.",
      verified: true,
      impact: "50,000+ clothes recycled",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3b819a5b?w=600&h=400&fit=crop",
      founded: 2010,
      projects: 127,
      beneficiaries: 15000
    },
    {
      id: 2,
      name: "Helping Hands NGO",
      category: "Social Welfare",
      location: "Delhi, NCR",
      phone: "+91 98765 43211",
      email: "info@helpinghands.org",
      rating: 4.9,
      totalDonations: 23100,
      description: "Dedicated to providing clothing to underprivileged communities across India.",
      verified: true,
      impact: "100,000+ people helped",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a5a?w=600&h=400&fit=crop",
      founded: 2008,
      projects: 89,
      beneficiaries: 25000
    },
    {
      id: 3,
      name: "Women Empowerment Initiative",
      category: "Women Empowerment",
      location: "Bangalore, Karnataka",
      phone: "+91 98765 43212",
      email: "contact@womenempower.org",
      rating: 4.7,
      totalDonations: 12300,
      description: "Empowering women through sustainable fashion and skill development programs.",
      verified: true,
      impact: "25,000+ women trained",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop",
      founded: 2015,
      projects: 67,
      beneficiaries: 12000
    },
    {
      id: 4,
      name: "Rural Development Trust",
      category: "Rural Development",
      location: "Pune, Maharashtra",
      phone: "+91 98765 43213",
      email: "info@ruraltrust.org",
      rating: 4.6,
      totalDonations: 18900,
      description: "Working towards sustainable development in rural communities through fashion initiatives.",
      verified: true,
      impact: "75,000+ rural families supported",
      image: "https://images.unsplash.com/photo-1488520578282-53a7b62436b7?w=600&h=400&fit=crop",
      founded: 2012,
      projects: 156,
      beneficiaries: 50000
    },
    {
      id: 5,
      name: "Children's Future Foundation",
      category: "Children Welfare",
      location: "Chennai, Tamil Nadu",
      phone: "+91 98765 43214",
      email: "contact@childrensfuture.org",
      rating: 4.9,
      totalDonations: 31200,
      description: "Providing clothing and education support to underprivileged children.",
      verified: true,
      impact: "200,000+ children supported",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop",
      founded: 2011,
      projects: 78,
      beneficiaries: 8000
    },
    {
      id: 6,
      name: "Sustainable Fashion Collective",
      category: "Environment",
      location: "Kolkata, West Bengal",
      phone: "+91 98765 43215",
      email: "info@sustainablefashion.org",
      rating: 4.5,
      totalDonations: 8900,
      description: "Promoting sustainable fashion practices and textile recycling initiatives.",
      verified: true,
      impact: "30,000+ kg textiles recycled",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd1d488?w=600&h=400&fit=crop",
      founded: 2016,
      projects: 45,
      beneficiaries: 5000
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Environment', label: 'Environment' },
    { value: 'Social Welfare', label: 'Social Welfare' },
    { value: 'Women Empowerment', label: 'Women Empowerment' },
    { value: 'Rural Development', label: 'Rural Development' },
    { value: 'Children Welfare', label: 'Children Welfare' }
  ];

  const filteredNGOs = ngos.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ngo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ngo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectNGO = (ngo) => {
    setSelectedNGO(ngo);
  };

  const handleDonate = () => {
    if (!isAuthenticated) {
      alert('Please login to donate items');
      return;
    }
    alert(`Donating to ${selectedNGO.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Heart className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Donate Pre-Loved Items
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Give your clothes a second life. Donate to verified NGOs and make a difference in someone's life.
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-blue-100">Items Donated</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
                <div className="text-4xl font-bold mb-2">100+</div>
                <div className="text-blue-100">Partner NGOs</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-blue-100">Lives Impacted</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white bg-opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white bg-opacity-5 rounded-full blur-2xl"></div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search NGOs by name, location, or cause..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-lg"
              />
            </div>
            <div className="w-full lg:w-80">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-10 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-lg appearance-none"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* NGO List */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="h-8 w-8 mr-3 text-green-600" />
                Verified NGOs
              </h2>
              <div className="flex items-center text-sm text-gray-600">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  {filteredNGOs.length} Found
                </span>
              </div>
            </div>
            
            {filteredNGOs.map((ngo) => (
              <div
                key={ngo.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group ${
                  selectedNGO?.id === ngo.id ? 'ring-4 ring-purple-500 shadow-2xl' : ''
                }`}
                onClick={() => handleSelectNGO(ngo)}
                onMouseEnter={() => setHoveredNGO(ngo.id)}
                onMouseLeave={() => setHoveredNGO(null)}
              >
                <div className="relative">
                  {/* Background Image */}
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 relative overflow-hidden">
                    <img 
                      src={ngo.image} 
                      alt={ngo.name}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Verified Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center space-x-2 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-medium text-gray-800">Verified</span>
                      </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    {hoveredNGO === ngo.id && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-white text-center">
                          <Eye className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">View Details</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {ngo.name}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                          {ngo.category}
                        </span>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {ngo.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(ngo.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium text-gray-700 ml-1">{ngo.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{ngo.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{(ngo.totalDonations / 1000).toFixed(1)}K</div>
                      <div className="text-xs text-gray-600">Donations</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{ngo.projects}</div>
                      <div className="text-xs text-gray-600">Projects</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{(ngo.beneficiaries / 1000).toFixed(1)}K</div>
                      <div className="text-xs text-gray-600">Helped</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm font-medium text-green-600 flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      {ngo.impact}
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected NGO Details */}
          <div className="xl:col-span-1">
            {selectedNGO ? (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-8">
                {/* Header Image */}
                <div className="h-56 relative">
                  <img 
                    src={selectedNGO.image} 
                    alt={selectedNGO.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-medium text-gray-800">Verified</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(selectedNGO.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-medium text-gray-700 ml-1">{selectedNGO.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedNGO.name}</h3>
                    <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedNGO.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">{selectedNGO.description}</p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="font-medium">{selectedNGO.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="font-medium">{selectedNGO.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Mail className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="font-medium">{selectedNGO.email}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="font-medium">Founded: {selectedNGO.founded}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{(selectedNGO.totalDonations / 1000).toFixed(1)}K</div>
                      <div className="text-sm text-gray-600">Total Donations</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-1">{selectedNGO.projects}</div>
                      <div className="text-sm text-gray-600">Active Projects</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-lg mb-4">
                    <div className="flex items-center text-white mb-2">
                      <Target className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Impact</span>
                    </div>
                    <div className="text-2xl font-bold">{selectedNGO.impact}</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-lg mb-4">
                    <div className="flex items-center text-white mb-2">
                      <Users className="h-5 w-5 mr-2" />
                      <span className="font-semibold">{(selectedNGO.beneficiaries / 1000).toFixed(1)}K+</span>
                    </div>
                    <div className="text-lg">Lives Impacted</div>
                  </div>
                  
                  <button
                    onClick={handleDonate}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center font-semibold text-lg"
                  >
                    <Gift className="h-6 w-6 mr-3" />
                    Donate Items
                  </button>
                  
                  {isAuthenticated && (
                    <Link
                      to="/add-donation"
                      className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center font-semibold text-lg mt-3"
                    >
                      <Package className="h-6 w-6 mr-3" />
                      Schedule Pickup
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Select an NGO</h3>
                <p className="text-gray-600 mb-6">
                  Choose an NGO from the list to view details and donate items.
                </p>
                
                <div className="space-y-4 text-left">
                  <div className="flex items-center text-gray-700">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span>All NGOs are verified and trusted</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>Secure donation process</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <Zap className="h-4 w-4 text-purple-600" />
                    </div>
                    <span>Track your donation impact</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Donation Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to donate your pre-loved items to those in need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Search className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Choose NGO</h3>
              <p className="text-gray-600">Browse and select a verified NGO that aligns with your values.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Package className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Pack Items</h3>
              <p className="text-gray-600">Pack your pre-loved items in good condition for donation.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Truck className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Schedule Pickup</h3>
              <p className="text-gray-600">Arrange for pickup or drop-off at the NGO location.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Make Impact</h3>
              <p className="text-gray-600">Track your donation and see the positive impact you create.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Collective Impact</h2>
            <p className="text-xl text-gray-600">Together we're making a difference in sustainable fashion.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Items Donated</div>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
              <div className="text-gray-600">Partner NGOs</div>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">Lives Impacted</div>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">5M+</div>
              <div className="text-gray-600">kg CO₂ Saved</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernDonate;
