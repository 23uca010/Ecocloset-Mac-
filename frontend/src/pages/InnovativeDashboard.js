import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatItemPrice } from '../utils/formatters';
import {
  ShoppingBag, Heart, Plus, TrendingUp, Users, Gift, X,
  Trophy, Leaf, Recycle, Activity, User, Package, Star,
  ArrowRight, Settings, MessageSquare, BarChart3, Calendar,
  Bell, CheckCircle, XCircle, Clock, Tag, Repeat, ShoppingCart,
  ChevronDown, ChevronUp, AlertTriangle
} from 'lucide-react';

const ICON_MAP = { ShoppingBag, Heart, Plus, TrendingUp, Users, Gift, X, Trophy, Leaf, Recycle };

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    pending:   { color: 'bg-amber-100 text-amber-700 border-amber-200',  icon: Clock,        label: 'Pending'   },
    accepted:  { color: 'bg-green-100 text-green-700 border-green-200',  icon: CheckCircle,  label: 'Accepted'  },
    rejected:  { color: 'bg-red-100 text-red-700 border-red-200',        icon: XCircle,      label: 'Rejected'  },
    completed: { color: 'bg-blue-100 text-blue-700 border-blue-200',     icon: CheckCircle,  label: 'Completed' },
    cancelled: { color: 'bg-gray-100 text-gray-500 border-gray-200',     icon: X,            label: 'Cancelled' },
  };
  const { color, icon: Icon, label } = cfg[status] || cfg.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${color}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

// ─── Type Badge ───────────────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  if (type === 'sell') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
        <ShoppingCart className="h-3 w-3" /> Purchase Request
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
      <Repeat className="h-3 w-3" /> Swap Request
    </span>
  );
};

// ─── Request Card ─────────────────────────────────────────────────────────────
const RequestCard = ({ req, onRespond }) => {
  const [responding, setResponding] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleRespond = async (status) => {
    setResponding(true);
    await onRespond(req.id, status);
    setResponding(false);
  };

  const senderInitial = (req.sender_name || req.sender_email || '?').charAt(0).toUpperCase();
  const date = new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      {/* Card Header */}
      <div className="flex items-start gap-4 p-5">
        {/* Sender Avatar */}
        <div className="w-11 h-11 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shrink-0">
          {senderInitial}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="font-bold text-gray-900 text-sm leading-snug">
                {req.sender_name || req.sender_email}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {date}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <TypeBadge type={req.type} />
              <StatusBadge status={req.status} />
            </div>
          </div>

          {/* Item Info */}
          <div className="mt-3 flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <div className="shrink-0">
              <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                {req.item_image ? (
                  <img
                    src={req.item_image.startsWith('http') ? req.item_image : `http://localhost:5001/${req.item_image.replace(/\\/g, '/')}`}
                    alt={req.item_title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <Package className="h-5 w-5 text-gray-400 m-auto mt-2.5" />
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                {req.type === 'sell' ? 'Wants to buy' : 'Wants to swap for'}
              </p>
              <p className="font-semibold text-gray-800 text-sm truncate">{req.item_title}</p>
              {req.type === 'swap' && req.offered_item_title && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Offering: <span className="font-semibold text-gray-700">{req.offered_item_title}</span>
                </p>
              )}
            </div>
          </div>

          {/* Message (expandable) */}
          {req.message && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {expanded ? 'Hide message' : 'View message'}
            </button>
          )}
          {expanded && req.message && (
            <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-800 italic">
              "{req.message}"
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons (only for pending) */}
      {req.status === 'pending' && (
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => handleRespond('accepted')}
            disabled={responding}
            id={`accept-request-${req.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-green-100"
          >
            {responding ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Accept
          </button>
          <button
            onClick={() => handleRespond('rejected')}
            disabled={responding}
            id={`reject-request-${req.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-red-50 text-red-600 border-2 border-red-200 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {responding ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const InnovativeDashboard = () => {
  const { user, api } = useAuth();
  const [stats, setStats] = useState({ totalItems: 0, activeSwaps: 0, completedSwaps: 0, donations: 0, ecoScore: 0, inboxPending: 0 });
  const [recentItems, setRecentItems] = useState([]);
  const [recentSwaps, setRecentSwaps] = useState([]);
  const [inboxRequests, setInboxRequests] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeUsername, setWelcomeUsername] = useState('');
  const [activeTab, setActiveTab] = useState('activity'); // 'activity' | 'inbox'
  const [respondError, setRespondError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/dashboard/user/${user.id}`);
      const { success, data, message, detail } = response.data;
      if (!success) throw new Error(detail || message || 'Server returned unsuccessful response');

      setStats(data.stats || { totalItems: 0, activeSwaps: 0, completedSwaps: 0, donations: 0, ecoScore: 0, inboxPending: 0 });
      setRecentItems(data.recentItems || []);
      setRecentSwaps(data.recentSwaps || []);
      setInboxRequests(data.inboxRequests || []);

      const mappedAchievements = (data.achievements || []).map(ach => ({
        ...ach, icon: ICON_MAP[ach.icon] || Trophy, unlocked: true
      }));
      setAchievements(mappedAchievements);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user?.id, api]);

  useEffect(() => {
    if (user?.id) fetchDashboardData();
    else setLoading(false);

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

  // Handle Accept / Reject from dashboard
  const handleRespond = async (requestId, status) => {
    try {
      setRespondError('');
      await api.put(`/swaps/${requestId}/respond`, { status });
      // Optimistic update
      setInboxRequests(prev =>
        prev.map(r => r.id === requestId ? { ...r, status } : r)
      );
      setStats(prev => ({
        ...prev,
        inboxPending: Math.max(0, prev.inboxPending - 1)
      }));
    } catch (err) {
      setRespondError(err.response?.data?.message || 'Failed to update request. Please try again.');
    }
  };

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

  const pendingCount = inboxRequests.filter(r => r.status === 'pending').length;

  const statCards = [
    { label: 'My Listings',    value: stats.totalItems,     icon: ShoppingBag, color: 'bg-green-100 text-green-700',  trend: 'Active items' },
    { label: 'Active Swaps',   value: stats.activeSwaps,    icon: Recycle,     color: 'bg-blue-100 text-blue-700',   trend: 'Pending' },
    { label: 'Completed',      value: stats.completedSwaps, icon: TrendingUp,  color: 'bg-purple-100 text-purple-700', trend: 'Swaps done' },
    { label: 'Donations',      value: stats.donations,      icon: Gift,        color: 'bg-rose-100 text-rose-700',   trend: 'Items given' },
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
              <p className="text-sm font-medium text-green-900">
                Welcome back, <strong>{welcomeUsername}</strong>! Ready to continue your sustainable fashion journey?
              </p>
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
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-400" />
                    <span className="text-green-300 text-sm font-medium">
                      Eco Score: <strong className="text-white">{stats.ecoScore || 0}</strong>
                    </span>
                  </div>
                  {pendingCount > 0 && (
                    <div
                      className="flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-full px-3 py-1 cursor-pointer"
                      onClick={() => setActiveTab('inbox')}
                    >
                      <Bell className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                      <span className="text-amber-200 text-xs font-bold">
                        {pendingCount} pending request{pendingCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
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
          {/* Left Panel — Tabbed: Activity | Inbox */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Tab Bar */}
              <div className="flex items-center border-b border-gray-100">
                <button
                  id="tab-activity"
                  onClick={() => setActiveTab('activity')}
                  className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors ${
                    activeTab === 'activity'
                      ? 'border-[#108c4b] text-[#108c4b]'
                      : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <Activity className="h-4 w-4" /> Recent Activity
                </button>
                <button
                  id="tab-inbox"
                  onClick={() => setActiveTab('inbox')}
                  className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors relative ${
                    activeTab === 'inbox'
                      ? 'border-[#108c4b] text-[#108c4b]'
                      : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <Bell className="h-4 w-4" /> Requests Inbox
                  {pendingCount > 0 && (
                    <span className="absolute top-2 right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </div>

              {/* ── Activity Tab ── */}
              {activeTab === 'activity' && (
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
              )}

              {/* ── Inbox Tab ── */}
              {activeTab === 'inbox' && (
                <div className="p-6">
                  {/* Error banner */}
                  {respondError && (
                    <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl px-4 py-3">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      {respondError}
                      <button onClick={() => setRespondError('')} className="ml-auto">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {inboxRequests.length === 0 ? (
                    <div className="text-center py-14">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Bell className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="text-gray-500 font-semibold text-base">No requests yet</p>
                      <p className="text-gray-400 text-sm mt-1">When someone requests a swap or purchase on your item, it'll appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inboxRequests.map((req) => (
                        <RequestCard key={req.id} req={req} onRespond={handleRespond} />
                      ))}
                    </div>
                  )}
                </div>
              )}
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
                  { to: '/sell',     icon: ShoppingBag,   label: 'Sell',     color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                  { to: '/swap',     icon: Recycle,       label: 'Swap',     color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                  { to: '/donate',   icon: Heart,         label: 'Donate',   color: 'bg-rose-50 text-rose-700 hover:bg-rose-100' },
                  { to: '/browse',   icon: Package,       label: 'Browse',   color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                  { to: '/messages', icon: MessageSquare, label: 'Messages', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
                  { to: '/profile',  icon: User,          label: 'Profile',  color: 'bg-gray-50 text-gray-700 hover:bg-gray-100' },
                ].map(action => (
                  <Link key={action.to} to={action.to}
                    className={`${action.color} flex flex-col items-center gap-1.5 p-3.5 rounded-xl text-center transition-colors`}>
                    <action.icon className="h-5 w-5" />
                    <span className="text-xs font-semibold">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Inbox Summary Card */}
            {inboxRequests.length > 0 && (
              <div
                className="bg-gradient-to-br from-[#0f1c14] to-[#1a3020] rounded-2xl p-5 text-white cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => setActiveTab('inbox')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-amber-300" />
                    <h3 className="font-bold text-sm">Requests Inbox</h3>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-amber-300">{pendingCount}</div>
                    <div className="text-xs text-gray-400">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-green-300">
                      {inboxRequests.filter(r => r.status === 'accepted').length}
                    </div>
                    <div className="text-xs text-gray-400">Accepted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-gray-300">
                      {inboxRequests.filter(r => r.status === 'rejected').length}
                    </div>
                    <div className="text-xs text-gray-400">Rejected</div>
                  </div>
                </div>
              </div>
            )}

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
