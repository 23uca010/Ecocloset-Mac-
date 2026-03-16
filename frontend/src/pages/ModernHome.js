import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingBag, Heart, Users, Recycle, Leaf, ArrowRight,
  Gift, Star, ShoppingCart, Package, TrendingUp, Shirt
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { name: 'Tops', emoji: '👕', color: 'bg-gray-100', bg: 'bg-white', text: 'text-gray-900' },
  { name: 'Bottoms', emoji: '👖', color: 'bg-gray-100', bg: 'bg-white', text: 'text-gray-900' },
  { name: 'Dresses', emoji: '👗', color: 'bg-gray-100', bg: 'bg-white', text: 'text-gray-900' },
  { name: 'Outerwear', emoji: '🧥', color: 'bg-gray-100', bg: 'bg-white', text: 'text-gray-900' },
  { name: 'Shoes', emoji: '👟', color: 'bg-gray-100', bg: 'bg-white', text: 'text-gray-900' },
  { name: 'Accessories', emoji: '👜', color: 'bg-gray-100', bg: 'bg-white', text: 'text-gray-900' },
];

const ModernHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredItems, setFeaturedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0, totalUsers: 0, itemsSwapped: 0, co2Saved: 0
  });

  useEffect(() => {
    const loadFeaturedItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        const data = await response.json();
        if (response.ok && data.success) {
          const mapped = data.data.slice(0, 8).map(item => ({
            ...item,
            image: item.image
              ? (item.image.startsWith('http') ? item.image : `http://localhost:5000/${item.image}`)
              : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80'
          }));
          setFeaturedItems(mapped);
        }
      } catch (error) {
        console.error('Error loading featured items:', error);
      }
    };

    const loadStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stats');
        const data = await response.json();
        if (response.ok && data.success) setStats(data.data);
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
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* ── Hero Section ── */}
      <section className="relative bg-white border-b border-gray-100 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-4 py-2 mb-6">
                <Leaf className="h-4 w-4 text-green-600" />
                <span className="text-green-700 text-sm font-medium">Sustainable Fashion Marketplace</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4 text-gray-900">
                Swap, Sell &{' '}
                <span className="text-green-600">
                  Donate
                </span>
                <br />
                Fashion Sustainably
              </h1>

              <p className="text-base text-gray-600 mb-8 max-w-lg leading-relaxed">
                Join thousands of eco-conscious fashion lovers. Give your clothes a second life, 
                discover unique pieces, and make a positive impact on the planet.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/browse"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors">
                  <ShoppingBag className="h-5 w-5" />
                  Browse Items
                </Link>
                <Link to="/add-listing"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md font-medium transition-colors">
                  <Recycle className="h-5 w-5" />
                  List Your Item
                </Link>
              </div>


            </div>

            {/* Feature Cards Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { label: 'Swap & Exchange', desc: 'Trade clothes you love', icon: Recycle, color: 'bg-blue-50 text-blue-600', border: 'border-gray-200' },
                { label: 'Sell Pre-Loved', desc: 'Earn from old wardrobe', icon: ShoppingCart, color: 'bg-green-50 text-green-600', border: 'border-gray-200' },
                { label: 'Donate to NGOs', desc: 'Support good causes', icon: Heart, color: 'bg-rose-50 text-rose-600', border: 'border-gray-200' },
                { label: 'Go Eco-Friendly', desc: 'Reduce fashion waste', icon: Leaf, color: 'bg-emerald-50 text-emerald-600', border: 'border-gray-200' },
              ].map((card) => (
                <div key={card.label} className="bg-white border top-0 border-gray-200 shadow-sm rounded-lg p-5 hover:border-gray-300 transition-colors">
                  <div className={`inline-flex p-2 rounded-md ${card.color} mb-3`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-gray-900 font-medium mb-1 text-base">{card.label}</h3>
                  <p className="text-gray-500 text-sm">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-900 text-center">
            {[
              { label: 'Items Available', value: (stats.totalItems ?? 0).toLocaleString(), icon: Package },
              { label: 'Active Users', value: (stats.totalUsers ?? 0).toLocaleString(), icon: Users },
              { label: 'Items Swapped', value: (stats.itemsSwapped ?? 0).toLocaleString(), icon: Recycle },
              { label: 'kg CO₂ Saved', value: (stats.co2Saved ?? 0).toLocaleString(), icon: Leaf },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <stat.icon className="h-5 w-5 text-green-600 mb-1" />
                <div className="text-2xl font-bold">{isLoading ? '—' : stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Browsing ── */}
      <section className="py-16 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Browse by Category</h2>
            <p className="text-gray-500 mt-2">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/browse?category=${cat.name}`}
                className={`group flex flex-col items-center gap-3 ${cat.bg} rounded-lg p-5 text-center shadow-sm hover:shadow transition-all border border-gray-200`}
              >
                <div className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center text-xl`}>
                  {cat.emoji}
                </div>
                <span className={`text-sm font-bold ${cat.text}`}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Items ── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Featured Items</h2>
              <p className="text-gray-500 mt-1">Discover the most popular items on EcoCloset</p>
            </div>
            <Link to="/browse" className="flex items-center gap-1.5 text-green-600 hover:text-green-700 font-medium transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredItems.length === 0 && !isLoading ? (
            <div className="text-center py-12 bg-white border border-gray-200 shadow-sm rounded-lg">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No items yet. Be the first to list one!</p>
              <Link to="/add-listing" className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700">
                <Recycle className="h-4 w-4" /> Add Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(isLoading ? Array(8).fill(null) : featuredItems).map((item, idx) => (
                isLoading ? (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                    <div className="h-56 bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
                    </div>
                  </div>
                ) : (
                  <Link to={`/items/${item.id}`} key={item.id} className="group block">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all shadow-sm">
                      <div className="relative h-56 overflow-hidden bg-gray-50 border-b border-gray-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80'; }}
                        />
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="p-1.5 bg-white rounded-full shadow hover:shadow-md transition-all"
                          >
                            <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                            item.listingType === 'sell' ? 'bg-white text-gray-900 border border-gray-200 shadow-sm' :
                            item.listingType === 'swap' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-green-50 text-green-700 border border-green-200'
                          }`}>
                            {item.listingType === 'sell' ? 'For Sale' : item.listingType === 'swap' ? 'Swap' : 'Donate'}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1 truncate">{item.title}</h3>
                        <p className="text-xs text-gray-500 mb-2">{item.category}{item.size ? ` • Size ${item.size}` : ''}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-green-700">
                            {item.listingType === 'sell' ? `₹${(item.price || 0).toLocaleString('en-IN')}` : 
                             item.listingType === 'swap' ? 'Swap' : 'Free'}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">4.5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">How EcoCloset Works</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">Three simple ways to give your clothes a second life</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Sell', desc: 'List your pre-loved items at your price. Connect with buyers who appreciate sustainable fashion.', icon: ShoppingCart, iconBg: 'bg-green-50', border: 'border-green-200', iconColor: 'text-green-600', link: '/sell', cta: 'Start Selling' },
              { title: 'Swap', desc: 'Exchange clothing with other users. Find unique pieces while clearing your closet for free.', icon: Recycle, iconBg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-600', link: '/swap', cta: 'Start Swapping' },
              { title: 'Donate', desc: 'Give clothes to verified NGOs or users in need. Make a real difference in your community.', icon: Gift, iconBg: 'bg-rose-50', border: 'border-rose-200', iconColor: 'text-rose-600', link: '/donate', cta: 'Donate Now' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow transition-all">
                <div className={`inline-flex p-2 border ${item.border} ${item.iconBg} rounded-md mb-4`}>
                  <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 mb-5 leading-relaxed">{item.desc}</p>
                <Link to={item.link} className={`inline-flex items-center gap-1.5 text-sm font-semibold ${item.iconColor} hover:gap-2.5 transition-all`}>
                  {item.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-green-50 border border-green-100 rounded-lg p-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            Ready to Join the Sustainable Fashion Revolution?
          </h2>
          <p className="text-gray-600 text-base mb-8 max-w-xl mx-auto">
            Join thousands of users making a positive impact on the environment through conscious fashion choices.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/browse" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors">
              <ShoppingBag className="h-5 w-5" /> Browse Items
            </Link>
            <Link to="/add-listing" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
              <Recycle className="h-5 w-5" /> List Your First Item
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernHome;
