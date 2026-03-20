import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingBag, Heart, Users, Recycle, Leaf, ArrowRight,
  Gift, Star, ShoppingCart, Package, TrendingUp, Shirt
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { name: 'Tops', emoji: '👕', color: 'from-rose-400 to-pink-500', bg: 'bg-rose-50', text: 'text-rose-700' },
  { name: 'Bottoms', emoji: '👖', color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50', text: 'text-blue-700' },
  { name: 'Dresses', emoji: '👗', color: 'from-purple-400 to-violet-500', bg: 'bg-purple-50', text: 'text-purple-700' },
  { name: 'Outerwear', emoji: '🧥', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-700' },
  { name: 'Shoes', emoji: '👟', color: 'from-teal-400 to-cyan-500', bg: 'bg-teal-50', text: 'text-teal-700' },
  { name: 'Accessories', emoji: '👜', color: 'from-green-400 to-emerald-500', bg: 'bg-green-50', text: 'text-green-700' },
];

const ModernHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredItems, setFeaturedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadFeaturedItems = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/items');
        const data = await response.json();
        if (response.ok && data.success) {
          const mapped = data.data.slice(0, 8).map(item => ({
            ...item,
            image: item.image
              ? (item.image.startsWith('http') ? item.image : `http://localhost:5001/${item.image}`)
              : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80'
          }));
          setFeaturedItems(mapped);
        }
      } catch (error) {
        console.error('Error loading featured items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedItems();
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
      <section className="relative bg-[#f7f9f7] text-gray-900 overflow-hidden py-24 sm:py-32">
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-2 mb-8 shadow-sm">
                <Leaf className="h-4 w-4 text-[#108c4b]" />
                <span className="text-[#108c4b] text-sm font-semibold tracking-wide uppercase">Sustainable Fashion Marketplace</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-8">
                <span className="block text-gray-900 mb-2">Reduce Waste.</span>
                <span className="block text-[#108c4b]">Reimagine Fashion.</span>
              </h1>

              <div className="space-y-2 mb-10 text-xl text-gray-600 font-medium">
                <p>Buy, Sell and Swap pre-loved fashion.</p>
                <p>Sustainable style made simple.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/browse"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#108c4b] hover:bg-[#0d7a40] text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-green-900/10 hover:-translate-y-0.5 text-lg">
                  <ShoppingBag className="h-5 w-5" />
                  Browse Items
                </Link>
                <Link to="/add-listing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-green-50 text-[#108c4b] border-[2px] border-[#108c4b] rounded-xl font-bold transition-all hover:-translate-y-0.5 text-lg shadow-sm">
                  <Recycle className="h-5 w-5" />
                  List Your Item
                </Link>
              </div>
            </div>

            {/* Right Side Cards 2x2 Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-6 relative">
              {[
                { label: 'Swap & Exchange', desc: 'Trade clothes you love', icon: Recycle },
                { label: 'Sell Pre-Loved', desc: 'Earn from old wardrobe', icon: ShoppingCart },
                { label: 'Donate to NGOs', desc: 'Support good causes', icon: Heart },
                { label: 'Go Eco-Friendly', desc: 'Reduce fashion waste', icon: Leaf },
              ].map((card, idx) => (
                <div key={card.label} className={`bg-white rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 transition-all duration-300 hover:-translate-y-1 ${idx % 2 === 1 ? 'mt-12' : ''}`}>
                  <div className="inline-flex p-3 rounded-2xl bg-green-50 mb-6 text-[#108c4b]">
                    <card.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl mb-2">{card.label}</h3>
                  <p className="text-gray-500 font-medium">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Browsing ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">Browse by Category</h2>
            <p className="text-gray-500 mt-2">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/browse?category=${cat.name}`}
                className={`group flex flex-col items-center gap-3 ${cat.bg} rounded-2xl p-5 text-center hover:shadow-md transition-all hover:-translate-y-1 border border-transparent hover:border-gray-200`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                  {cat.emoji}
                </div>
                <span className={`text-sm font-bold ${cat.text}`}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Items ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Featured Items</h2>
              <p className="text-gray-500 mt-1">Discover the most popular items on EcoCloset</p>
            </div>
            <Link to="/browse" className="flex items-center gap-1.5 text-[#108c4b] hover:text-[#0d7a40] font-semibold transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredItems.length === 0 && !isLoading ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No items yet. Be the first to list one!</p>
              <Link to="/add-listing" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#108c4b] text-white rounded-xl text-sm font-semibold hover:bg-[#0d7a40]">
                <Recycle className="h-4 w-4" /> Add Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(isLoading ? Array(8).fill(null) : featuredItems).map((item, idx) => (
                isLoading ? (
                  <div key={idx} className="bg-gray-100 rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-56 bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
                    </div>
                  </div>
                ) : (
                  <Link to={`/items/${item.id}`} key={item.id} className="group block">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80'; }}
                        />
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110"
                          >
                            <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                            item.listingType === 'sell' ? 'bg-white/90 text-gray-900' :
                            item.listingType === 'swap' ? 'bg-blue-600 text-white' :
                            'bg-[#108c4b] text-white'
                          }`}>
                            {item.listingType === 'sell' ? 'For Sale' : item.listingType === 'swap' ? 'Swap' : 'Donate'}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-1 truncate">{item.title}</h3>
                        <p className="text-xs text-gray-500 mb-3">{item.category}{item.size ? ` • Size ${item.size}` : ''}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-extrabold text-[#108c4b]">
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">How EcoCloset Works</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">Three simple ways to give your clothes a second life</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Sell', desc: 'List your pre-loved items at your price. Connect with buyers who appreciate sustainable fashion.', icon: ShoppingCart, iconBg: 'bg-green-100', iconColor: 'text-green-700', link: '/sell', cta: 'Start Selling' },
              { title: 'Swap', desc: 'Exchange clothing with other users. Find unique pieces while clearing your closet for free.', icon: Recycle, iconBg: 'bg-blue-100', iconColor: 'text-blue-700', link: '/swap', cta: 'Start Swapping' },
              { title: 'Donate', desc: 'Give clothes to verified NGOs or users in need. Make a real difference in your community.', icon: Gift, iconBg: 'bg-rose-100', iconColor: 'text-rose-700', link: '/donate', cta: 'Donate Now' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className={`inline-flex p-3 ${item.iconBg} rounded-xl mb-5`}>
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
      <section className="py-16 bg-gradient-to-r from-[#108c4b] to-[#0f7a43]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to Join the Sustainable Fashion Revolution?
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of users making a positive impact on the environment through conscious fashion choices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[#108c4b] rounded-xl font-bold hover:bg-green-50 transition-colors shadow">
              <ShoppingBag className="h-5 w-5" /> Browse Items
            </Link>
            <Link to="/add-listing" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
              <Recycle className="h-5 w-5" /> List Your First Item
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernHome;
