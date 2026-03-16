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
      <section className="relative bg-gradient-to-br from-[#0f1c14] via-[#1a3020] to-[#112218] text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#108c4b]/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-400/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#108c4b]/30 border border-[#108c4b]/40 rounded-full px-4 py-2 mb-8">
                <Leaf className="h-4 w-4 text-green-400" />
                <span className="text-green-300 text-sm font-medium">Sustainable Fashion Marketplace</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
                Swap, Sell &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34d399] to-[#22c55e]">
                  Donate
                </span>
                <br />
                Fashion Sustainably
              </h1>

              <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
                Join thousands of eco-conscious fashion lovers. Give your clothes a second life, 
                discover unique pieces, and make a positive impact on the planet.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link to="/browse"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#108c4b] hover:bg-[#0d7a40] text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-green-900/30 hover:-translate-y-0.5">
                  <ShoppingBag className="h-5 w-5" />
                  Browse Items
                </Link>
                <Link to="/add-listing"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-all hover:-translate-y-0.5">
                  <Recycle className="h-5 w-5" />
                  List Your Item
                </Link>
              </div>

              {/* Search */}
              <form onSubmit={handleSearch} className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clothes, brands, styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-14 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:bg-white/15 transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#108c4b] rounded-lg hover:bg-[#0d7a40] transition-colors">
                  <Search className="h-4 w-4 text-white" />
                </button>
              </form>
            </div>

            {/* Feature Cards Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { label: 'Swap & Exchange', desc: 'Trade clothes you love', icon: Recycle, color: 'bg-blue-500/20 text-blue-300', grad: 'from-blue-900/40 to-blue-800/20' },
                { label: 'Sell Pre-Loved', desc: 'Earn from old wardrobe', icon: ShoppingCart, color: 'bg-green-500/20 text-green-300', grad: 'from-green-900/40 to-green-800/20' },
                { label: 'Donate to NGOs', desc: 'Support good causes', icon: Heart, color: 'bg-rose-500/20 text-rose-300', grad: 'from-rose-900/40 to-rose-800/20' },
                { label: 'Go Eco-Friendly', desc: 'Reduce fashion waste', icon: Leaf, color: 'bg-emerald-500/20 text-emerald-300', grad: 'from-emerald-900/40 to-emerald-800/20' },
              ].map((card) => (
                <div key={card.label} className={`bg-gradient-to-br ${card.grad} border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all hover:-translate-y-1`}>
                  <div className={`inline-flex p-2.5 rounded-xl ${card.color} mb-4`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{card.label}</h3>
                  <p className="text-gray-400 text-sm">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-[#108c4b] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
            {[
              { label: 'Items Available', value: (stats.totalItems ?? 0).toLocaleString(), icon: Package },
              { label: 'Active Users', value: (stats.totalUsers ?? 0).toLocaleString(), icon: Users },
              { label: 'Items Swapped', value: (stats.itemsSwapped ?? 0).toLocaleString(), icon: Recycle },
              { label: 'kg CO₂ Saved', value: (stats.co2Saved ?? 0).toLocaleString(), icon: Leaf },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <stat.icon className="h-6 w-6 text-green-200 mb-1" />
                <div className="text-3xl font-extrabold">{isLoading ? '—' : stat.value}</div>
                <div className="text-green-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
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
