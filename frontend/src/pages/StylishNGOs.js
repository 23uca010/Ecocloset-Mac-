import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  Heart, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users, 
  Award,
  CheckCircle,
  Building,
  HandHeart,
  Sparkles,
  TrendingUp,
  Calendar,
  Target,
  Shield
} from 'lucide-react';

const StylishNGOs = () => {
  const { api, isAuthenticated } = useAuth();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredNGO, setHoveredNGO] = useState(null);
  
  const categories = [
    { value: 'all', label: 'All NGOs' },
    { value: 'environment', label: 'Environment' },
    { value: 'education', label: 'Education' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'women', label: 'Women Empowerment' },
    { value: 'children', label: 'Children Welfare' },
    { value: 'animal', label: 'Animal Welfare' }
  ];

  // Sample NGO data with realistic images
  const sampleNGOs = [
    {
      _id: '1',
      name: 'Green Earth Foundation',
      category: 'environment',
      description: 'Dedicated to environmental conservation and sustainable development through community engagement and education.',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb869093?w=600&h=400&fit=crop',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face',
      verified: true,
      rating: 4.9,
      reviews: 156,
      location: 'Mumbai, Maharashtra',
      founded: 2010,
      employees: 45,
      projects: 127,
      beneficiaries: 15000,
      website: 'www.greenearth.org',
      phone: '+91 22 2345 6789',
      email: 'contact@greenearth.org',
      impact: {
        trees: 50000,
        water: 1000000, // liters saved
        co2: 250000 // kg reduced
      },
      tags: ['environment', 'conservation', 'sustainability']
    },
    {
      _id: '2',
      name: 'Education First Initiative',
      category: 'education',
      description: 'Providing quality education to underprivileged children and empowering them for a better future.',
      image: 'https://images.unsplash.com/photo-1509062273977-6fe2f3c4a5e3?w=600&h=400&fit=crop',
      logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
      verified: true,
      rating: 4.8,
      reviews: 203,
      location: 'Delhi, NCR',
      founded: 2012,
      employees: 67,
      projects: 89,
      beneficiaries: 25000,
      website: 'www.educationfirst.org',
      phone: '+91 11 2345 6789',
      email: 'info@educationfirst.org',
      impact: {
        students: 25000,
        schools: 45,
        books: 100000
      },
      tags: ['education', 'children', 'empowerment']
    },
    {
      _id: '3',
      name: 'Women Empowerment Network',
      category: 'women',
      description: 'Empowering women through skill development, financial literacy, and entrepreneurial support.',
      image: 'https://images.unsplash.com/photo-1573497620053-ea530f97430a?w=600&h=400&fit=crop',
      logo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      verified: true,
      rating: 4.7,
      reviews: 142,
      location: 'Bangalore, Karnataka',
      founded: 2015,
      employees: 38,
      projects: 67,
      beneficiaries: 12000,
      website: 'www.womenempower.org',
      phone: '+91 80 2345 6789',
      email: 'contact@womenempower.org',
      impact: {
        women: 12000,
        businesses: 450,
        loans: 25000000 // rupees
      },
      tags: ['women', 'empowerment', 'entrepreneurship']
    },
    {
      _id: '4',
      name: 'Healthcare Heroes',
      category: 'healthcare',
      description: 'Providing affordable healthcare services to rural and underserved communities across India.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
      logo: 'https://images.unsplash.com/photo-1559839734-5b6aeb71f2ed?w=100&h=100&fit=crop&crop=face',
      verified: true,
      rating: 4.9,
      reviews: 267,
      location: 'Chennai, Tamil Nadu',
      founded: 2008,
      employees: 89,
      projects: 156,
      beneficiaries: 50000,
      website: 'www.healthcareheroes.org',
      phone: '+91 44 2345 6789',
      email: 'info@healthcareheroes.org',
      impact: {
        patients: 50000,
        camps: 500,
        doctors: 150
      },
      tags: ['healthcare', 'medical', 'rural']
    },
    {
      _id: '5',
      name: 'Children Welfare Society',
      category: 'children',
      description: 'Working towards creating a safe and nurturing environment for orphaned and abandoned children.',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop',
      logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      verified: true,
      rating: 4.8,
      reviews: 189,
      location: 'Kolkata, West Bengal',
      founded: 2011,
      employees: 52,
      projects: 78,
      beneficiaries: 8000,
      website: 'www.childrenwelfare.org',
      phone: '+91 33 2345 6789',
      email: 'contact@childrenwelfare.org',
      impact: {
        children: 8000,
        shelters: 12,
        meals: 2920000
      },
      tags: ['children', 'orphanage', 'welfare']
    },
    {
      _id: '6',
      name: 'Animal Rescue India',
      category: 'animal',
      description: 'Rescuing and rehabilitating stray animals while promoting animal welfare and conservation.',
      image: 'https://images.unsplash.com/photo-1601758228042-b3d0b899b98b?w=600&h=400&fit=crop',
      logo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      verified: true,
      rating: 4.6,
      reviews: 98,
      location: 'Pune, Maharashtra',
      founded: 2016,
      employees: 28,
      projects: 45,
      beneficiaries: 5000,
      website: 'www.animalrescue.in',
      phone: '+91 20 2345 6789',
      email: 'rescue@animalrescue.in',
      impact: {
        animals: 5000,
        shelters: 8,
        adoptions: 1200
      },
      tags: ['animals', 'rescue', 'welfare']
    }
  ];

  useEffect(() => {
    // Simulate API call with sample data
    setTimeout(() => {
      setNgos(sampleNGOs);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const filteredNGOs = ngos.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ngo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ngo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                <Building className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Verified NGO Partners
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with trusted non-profit organizations making a real difference in communities across India
            </p>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search NGOs by name, cause, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
              />
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 p-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full hover:shadow-lg transition-all duration-200"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* NGOs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNGOs.map((ngo) => (
              <div 
                key={ngo._id} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                onMouseEnter={() => setHoveredNGO(ngo._id)}
                onMouseLeave={() => setHoveredNGO(null)}
              >
                {/* Header Image */}
                <div className="relative">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={ngo.image} 
                      alt={ngo.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Verified Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Verified</span>
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                      {categories.find(c => c.value === ngo.category)?.label}
                    </span>
                  </div>
                  
                  {/* Logo Overlay */}
                  {hoveredNGO === ngo._id && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-center">
                        <img 
                          src={ngo.logo} 
                          alt={ngo.name}
                          className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-white"
                        />
                        <p className="text-white font-medium">{ngo.name}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  {/* NGO Name and Rating */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                        {ngo.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{ngo.rating}</span>
                        </div>
                        <span className="text-sm text-gray-400">({ngo.reviews} reviews)</span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {ngo.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {ngo.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {ngo.location}
                  </div>
                  
                  {/* Impact Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {ngo.category === 'environment' && (
                      <>
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{(ngo.impact.trees / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-600">Trees</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{(ngo.impact.water / 1000000).toFixed(1)}M</div>
                          <div className="text-xs text-gray-600">Liters Saved</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">{(ngo.impact.co2 / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-600">kg CO₂</div>
                        </div>
                      </>
                    )}
                    {ngo.category === 'education' && (
                      <>
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{(ngo.impact.students / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-600">Students</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{ngo.impact.schools}</div>
                          <div className="text-xs text-gray-600">Schools</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">{(ngo.impact.books / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-600">Books</div>
                        </div>
                      </>
                    )}
                    {ngo.category === 'women' && (
                      <>
                        <div className="text-center p-2 bg-pink-50 rounded-lg">
                          <div className="text-lg font-bold text-pink-600">{(ngo.impact.women / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-600">Women</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">{ngo.impact.businesses}</div>
                          <div className="text-xs text-gray-600">Businesses</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{(ngo.impact.loans / 1000000).toFixed(1)}M</div>
                          <div className="text-xs text-gray-600">Loans ₹</div>
                        </div>
                      </>
                    )}
                    {ngo.category === 'healthcare' && (
                      <>
                        <div className="text-center p-2 bg-red-50 rounded-lg">
                          <div className="text-lg font-bold text-red-600">{(ngo.impact.patients / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-600">Patients</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{ngo.impact.camps}</div>
                          <div className="text-xs text-gray-600">Camps</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{ngo.impact.doctors}</div>
                          <div className="text-xs text-gray-600">Doctors</div>
                        </div>
                      </>
                    )}
                    {ngo.category === 'children' && (
                      <>
                        <div className="text-center p-2 bg-yellow-50 rounded-lg">
                          <div className="text-lg font-bold text-yellow-600">{(ngo.impact.children / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-600">Children</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{ngo.impact.shelters}</div>
                          <div className="text-xs text-gray-600">Shelters</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{(ngo.impact.meals / 1000000).toFixed(1)}M</div>
                          <div className="text-xs text-gray-600">Meals</div>
                        </div>
                      </>
                    )}
                    {ngo.category === 'animal' && (
                      <>
                        <div className="text-center p-2 bg-orange-50 rounded-lg">
                          <div className="text-lg font-bold text-orange-600">{(ngo.impact.animals / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-600">Animals</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{ngo.impact.shelters}</div>
                          <div className="text-xs text-gray-600">Shelters</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{(ngo.impact.adoptions / 1000).toFixed(1)}K</div>
                          <div className="text-xs text-gray-600">Adoptions</div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{ngo.employees} staff</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      <span>{ngo.projects} projects</span>
                    </div>
                    <div className="flex items-center">
                      <HandHeart className="h-4 w-4 mr-1" />
                      <span>{(ngo.beneficiaries / 1000).toFixed(0)}K helped</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button className="flex-1 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center">
                      <HandHeart className="h-4 w-4 mr-2" />
                      Donate
                    </button>
                    <button className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredNGOs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No NGOs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StylishNGOs;
