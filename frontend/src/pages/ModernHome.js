import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Users, 
  TrendingUp, 
  Star, 
  Gift, 
  Recycle, 
  Leaf, 
  Globe, 
  ArrowRight,
  Sparkles,
  Award,
  TreePine,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ModernHome = () => {
  const navigate = useNavigate();
  const [showThankYou, setShowThankYou] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { items, totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredItems, setFeaturedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalUsers: 0,
    totalNGOs: 0,
    totalDonations: 0,
    itemsSwapped: 0,
    co2Saved: 0
  });

  const handleDonateClick = () => {
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
    }, 3000);
  };

  useEffect(() => {
    // Load featured items
    const loadFeaturedItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        const data = await response.json();
        if (response.ok && data.success) {
          setFeaturedItems(data.data.slice(0, 8)); // Limit to top 8
        }
      } catch (error) {
        console.error('Error loading featured items:', error);
      }
    };

    // Load stats
    const loadStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stats');
        const data = await response.json();
        if (response.ok && data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedItems();
    loadStats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Thank You Message */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 transform scale-100 transition-transform">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your Interest!</h2>
              <p className="text-gray-600 mb-4">
                We appreciate your willingness to support sustainable fashion. Our team will contact you soon with more information about donation opportunities.
              </p>
              <button
                onClick={() => setShowThankYou(false)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-4 py-2 mb-6">
                <Leaf className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Sustainable Fashion Marketplace</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Swap, Sell & 
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {" "}Donate
                </span>
                <br />
                Fashion Sustainably
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of eco-conscious fashion lovers. Give your clothes a second life, 
                discover unique pieces, and make a positive impact on the planet.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/items"
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Browse Items
                </Link>
                <Link
                  to="/sell-swap"
                  className="px-8 py-4 border-2 border-green-600 text-green-600 rounded-full font-semibold hover:bg-green-50 transition-colors flex items-center justify-center"
                >
                  <Recycle className="h-5 w-5 mr-2" />
                  List Items
                </Link>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search for clothes, brands, or styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-200">
                    <div className="w-full h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-4"></div>
                    <h3 className="font-semibold text-gray-900">Summer Collection</h3>
                    <p className="text-sm text-gray-600">Light & breezy pieces</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-200">
                    <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg mb-4"></div>
                    <h3 className="font-semibold text-gray-900">Denim Classics</h3>
                    <p className="text-sm text-gray-600">Timeless styles</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-200">
                    <div className="w-full h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg mb-4"></div>
                    <h3 className="font-semibold text-gray-900">Eco Essentials</h3>
                    <p className="text-sm text-gray-600">Sustainable basics</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-200">
                    <div className="w-full h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg mb-4"></div>
                    <h3 className="font-semibold text-gray-900">Vintage Finds</h3>
                    <p className="text-sm text-gray-600">Retro treasures</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 animate-pulse">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <ShoppingBag className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{(stats.totalItems ?? 0).toLocaleString()}</h3>
                <p className="text-gray-600">Items Available</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{(stats.totalUsers ?? 0).toLocaleString()}</h3>
                <p className="text-gray-600">Active Users</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <Recycle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{(stats.itemsSwapped ?? 0).toLocaleString()}</h3>
                <p className="text-gray-600">Items Swapped</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <TreePine className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{(stats.co2Saved ?? 0).toLocaleString()}</h3>
                <p className="text-gray-600">kg CO₂ Saved</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose EcoCloset?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing fashion with sustainability, community, and style at the heart of everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-6">
                <Recycle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Swap & Exchange</h3>
              <p className="text-gray-600 mb-4">
                Trade clothes with other fashion lovers. Find unique pieces while giving your items a new home.
              </p>
              <Link to="/swaps" className="text-green-600 hover:text-green-700 font-medium flex items-center">
                Start Swapping <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-6">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sell Pre-Loved</h3>
              <p className="text-gray-600 mb-4">
                Make money from clothes you no longer wear. Set your prices and connect with buyers.
              </p>
              <Link to="/sell-swap" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                Start Selling <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-6">
                <Gift className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Donate to Causes</h3>
              <p className="text-gray-600 mb-4">
                Support environmental and social causes by donating clothes to verified NGOs and charities.
              </p>
              <button 
                onClick={handleDonateClick}
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
              >
                Donate Now <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-6">
                <Leaf className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Eco-Friendly</h3>
              <p className="text-gray-600 mb-4">
                Every swap, sale, and donation reduces fashion waste and carbon footprint. Join the movement.
              </p>
              <Link to="/about" className="text-orange-600 hover:text-orange-700 font-medium flex items-center">
                Learn More <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full mb-6">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trusted Community</h3>
              <p className="text-gray-600 mb-4">
                Connect with verified users, read reviews, and trade safely within our secure platform.
              </p>
              <Link to="/about" className="text-pink-600 hover:text-pink-700 font-medium flex items-center">
                Join Community <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-6">
                <Award className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Earn Rewards</h3>
              <p className="text-gray-600 mb-4">
                Get points for every swap, sale, and donation. Unlock exclusive perks and recognition.
              </p>
              <Link to="/rewards" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
                View Rewards <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Items</h2>
              <p className="text-xl text-gray-600">Discover the most popular items on EcoCloset</p>
            </div>
            <Link
              to="/items"
              className="text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <div key={item.id} className="group">
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                    <img 
                      src={item.images?.[0] || 'https://via.placeholder.com/300x300'} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">
                      <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                    </button>
                  </div>
                  {item.type === 'swap' && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                        Swap
                      </span>
                    </div>
                  )}
                  {item.type === 'donation' && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">
                        Donate
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Join the Sustainable Fashion Revolution?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of users making a positive impact on the environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-green-600 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Login to Get Started
            </Link>
            <Link
              to="/items"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-green-600 transition-colors flex items-center justify-center"
            >
              <Package className="h-5 w-5 mr-2" />
              Browse Items
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernHome;
