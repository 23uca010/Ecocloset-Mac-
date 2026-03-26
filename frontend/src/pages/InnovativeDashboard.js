import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatItemPrice } from '../utils/formatters';
import { 
  ShoppingBag, Heart, Plus, TrendingUp, Users, Gift, X,
  Trophy, Leaf, Recycle, Activity, User, Package, Star,
  ArrowRight, Settings, MessageSquare, BarChart3, Calendar
} from 'lucide-react';

const ICON_MAP = { ShoppingBag, Heart, Plus, TrendingUp, Users, Gift, X, Trophy, Leaf, Recycle };

const InnovativeDashboard = () => {
  const { user, api } = useAuth();
  const [stats, setStats] = useState({ totalItems: 0, activeSwaps: 0, completedSwaps: 0, donations: 0, ecoScore: 0 });
  const [recentItems, setRecentItems] = useState([]);
  const [recentSwaps, setRecentSwaps] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeUsername, setWelcomeUsername] = useState('');

  // ── Declare fetch function FIRST so useEffect can reference it ───────────
  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) {
      console.warn('[Dashboard] fetchDashboardData called without a valid user.id — skipping');
      setLoading(false);
      return;
    }
    console.log('[Dashboard] Fetching data for user.id:', user.id);
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/dashboard/user/${user.id}`);
      console.log('[Dashboard] Response status:', response.status);
      const { success, data, message, detail } = response.data;
      if (!success) throw new Error(detail || message || 'Server returned unsuccessful response');
      setStats(data.stats || { totalItems: 0, activeSwaps: 0, completedSwaps: 0, donations: 0, ecoScore: 0 });
      setRecentItems(data.recentItems || []);
      setRecentSwaps(data.recentSwaps || []);
      const mappedAchievements = (data.achievements || []).map(ach => ({
        ...ach,
        icon: ICON_MAP[ach.icon] || Trophy,
        unlocked: true
      }));
      setAchievements(mappedAchievements);
    } catch (error) {
      console.error('[Dashboard] Fetch error:', error);
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user?.id, api]);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
    const loginSuccess = localStorage.getItem('loginSuccess');
    const username = localStorage.getItem('username');
    if (loginSuccess === 'true' && username) {
      setShowWelcome(true);
      setWelcomeUsername(username);
      localStorage.removeItem('loginSuccess');
      localStorage.removeItem('username');
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, [user?.id, fetchDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#108c4b] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md text-center shadow-sm">
          <X className="h-10 w-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Couldn't load dashboard</h2>
          <p className="text-gray-500 mb-6 text-sm break-words">{error}</p>
          <button
            onClick={() => { setError(null); setLoading(true); fetchDashboardData(); }}
            className="bg-[#108c4b] text-white px-6 py-2.5 rounded-xl hover:bg-[#0d7a40] transition-colors font-semibold text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'My Listings', value: stats.totalItems, icon: ShoppingBag, color: 'bg-green-100 text-green-700', trend: 'Active items' },
    { label: 'Active Swaps', value: stats.activeSwaps, icon: Recycle, color: 'bg-blue-100 text-blue-700', trend: 'Pending' },
    { label: 'Completed', value: stats.completedSwaps, icon: TrendingUp, color: 'bg-purple-100 text-purple-700', trend: 'Swaps done' },
    { label: 'Donations', value: stats.donations, icon: Gift, color: 'bg-rose-100 text-rose-700', trend: 'Items given' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Welcome Banner */}
      {showWelcome && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm font-medium text-green-900">Welcome back, <strong>{welcomeUsername}</strong>! Ready to continue your sustainable fashion journey?</p>
            </div>
            <button onClick={() => setShowWelcome(false)} className="text-green-600 hover:text-green-800 p-1">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#0f1c14] to-[#1a3020] rounded-2xl p-6 md:p-8 mb-6 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center font-extrabold text-2xl text-white shadow-lg">
                {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold">Welcome back, {user?.firstName}!</h1>
                <p className="text-gray-400 text-sm mt-0.5">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Leaf className="h-4 w-4 text-green-400" />
                  <span className="text-green-300 text-sm font-medium">Eco Score: <strong className="text-white">{stats.ecoScore || 0}</strong></span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/add-listing" className="flex items-center gap-2 px-5 py-2.5 bg-[#108c4b] hover:bg-[#0d7a40] text-white rounded-xl font-semibold text-sm transition-colors">
                <Plus className="h-4 w-4" /> Add Listing
              </Link>
              <Link to="/profile" className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm transition-colors border border-white/20">
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-gray-400">{card.trend}</span>
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-0.5">{card.value}</div>
              <div className="text-sm text-gray-500">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                </div>
                <Link to="/profile" className="text-sm text-[#108c4b] font-medium hover:underline">View All</Link>
              </div>
              <div className="p-6">
                {recentItems.length === 0 && recentSwaps.length === 0 ? (
                  <div className="text-center py-10">
                    <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm font-medium">No activity yet</p>
                    <p className="text-gray-400 text-xs mt-1">Start by listing an item!</p>
                    <Link to="/add-listing" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#108c4b] text-white rounded-lg text-sm font-semibold hover:bg-[#0d7a40]">
                      <Plus className="h-4 w-4" /> Add Listing
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentItems.map((item) => (
                      <div key={`item-${item.id}`} className="flex items-center gap-4 p-3.5 bg-green-50 rounded-xl border border-green-100">
                        <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                          <ShoppingBag className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">Item Listed</p>
                          <p className="text-xs text-gray-500 truncate">{item.title} • {formatItemPrice(item)}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {recentSwaps.map((swap) => (
                      <div key={`swap-${swap.id}`} className="flex items-center gap-4 p-3.5 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                          <Recycle className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">Swap {swap.status?.charAt(0)?.toUpperCase() + swap.status?.slice(1)}</p>
                          <p className="text-xs text-gray-500 truncate">{swap.item_a_title} ⇋ {swap.item_b_title}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                          <Calendar className="h-3 w-3" />
                          {new Date(swap.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 p-5 border-b border-gray-100">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <h2 className="text-base font-bold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {[
                  { to: '/sell', icon: ShoppingBag, label: 'Sell', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                  { to: '/swap', icon: Recycle, label: 'Swap', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                  { to: '/donate', icon: Heart, label: 'Donate', color: 'bg-rose-50 text-rose-700 hover:bg-rose-100' },
                  { to: '/browse', icon: Package, label: 'Browse', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                  { to: '/messages', icon: MessageSquare, label: 'Messages', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
                  { to: '/profile', icon: User, label: 'Profile', color: 'bg-gray-50 text-gray-700 hover:bg-gray-100' },
                ].map(action => (
                  <Link key={action.to} to={action.to}
                    className={`${action.color} flex flex-col items-center gap-1.5 p-3.5 rounded-xl text-center transition-colors`}>
                    <action.icon className="h-5 w-5" />
                    <span className="text-xs font-semibold">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Achievements */}
            {achievements.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 p-5 border-b border-gray-100">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-base font-bold text-gray-900">Achievements</h2>
                </div>
                <div className="p-4 grid grid-cols-2 gap-2">
                  {achievements.slice(0, 4).map((ach) => (
                    <div key={ach.id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
                      <ach.icon className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-gray-800 leading-tight">{ach.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnovativeDashboard;
