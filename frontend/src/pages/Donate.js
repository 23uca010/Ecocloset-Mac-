import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Gift, 
  Users, 
  Heart, 
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
  TrendingUp
} from 'lucide-react';
import { generateRealisticNGOImage } from '../assets/realistic-ngo-images';

const Donate = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock NGO data
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
      impact: "50,000+ clothes recycled"
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
      impact: "100,000+ people helped"
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
      impact: "25,000+ women trained"
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
      impact: "75,000+ rural families supported"
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
      impact: "200,000+ children supported"
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
      impact: "30,000+ kg textiles recycled"
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
      // Redirect to login or show login modal
      alert('Please login to donate items');
      return;
    }
    // Proceed with donation process
    alert(`Donating to ${selectedNGO.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Donate Pre-Loved Items
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Give your clothes a second life. Donate to verified NGOs and make a difference in someone's life.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">50K+</div>
                <div className="text-blue-100">Items Donated</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">100+</div>
                <div className="text-blue-100">Partner NGOs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">10K+</div>
                <div className="text-blue-100">Lives Impacted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search NGOs by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* NGO List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Verified NGOs</h2>
            
            {filteredNGOs.map((ngo) => (
              <div
                key={ngo.id}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-200 ${
                  selectedNGO?.id === ngo.id ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-xl'
                }`}
                onClick={() => handleSelectNGO(ngo)}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={generateRealisticNGOImage(ngo.name)} 
                      alt={ngo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{ngo.name}</h3>
                      {ngo.verified && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {ngo.category}
                      </span>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {ngo.location}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{ngo.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="font-semibold">{ngo.rating}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {(ngo.totalDonations ?? 0).toLocaleString()} donations
                        </div>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        {ngo.impact}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected NGO Details */}
          <div className="lg:col-span-1">
            {selectedNGO ? (
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">NGO Details</h3>
                
                <div className="w-full h-48 rounded-lg overflow-hidden shadow-md mb-4">
                  <img 
                    src={generateRealisticNGOImage(selectedNGO.name)} 
                    alt={selectedNGO.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{selectedNGO.name}</h4>
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mt-1">
                      {selectedNGO.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600">{selectedNGO.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {selectedNGO.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {selectedNGO.phone}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {selectedNGO.email}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Rating</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="font-semibold">{selectedNGO.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Total Donations</span>
                      <span className="font-semibold">{(selectedNGO.totalDonations ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Impact</span>
                      <span className="font-semibold text-green-600">{selectedNGO.impact}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleDonate}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
                  >
                    <Gift className="h-5 w-5 mr-2" />
                    Donate Items
                  </button>
                  
                  {isAuthenticated && (
                    <Link
                      to="/add-donation"
                      className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center font-medium"
                    >
                      <Package className="h-5 w-5 mr-2" />
                      Schedule Pickup
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <div className="text-center py-8">
                  <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an NGO</h3>
                  <p className="text-gray-600 text-sm">
                    Choose an NGO from the list to view details and donate items.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="bg-white py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Donation Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to donate your pre-loved items to those in need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Choose NGO</h3>
              <p className="text-gray-600">Browse and select a verified NGO that aligns with your values.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Pack Items</h3>
              <p className="text-gray-600">Pack your pre-loved items in good condition for donation.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Schedule Pickup</h3>
              <p className="text-gray-600">Arrange for pickup or drop-off at the NGO location.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Make Impact</h3>
              <p className="text-gray-600">Track your donation and see the positive impact you create.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Collective Impact</h2>
            <p className="text-xl text-gray-600">Together we're making a difference in sustainable fashion.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Items Donated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
              <div className="text-gray-600">Partner NGOs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">5M+</div>
              <div className="text-gray-600">kg CO₂ Saved</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
