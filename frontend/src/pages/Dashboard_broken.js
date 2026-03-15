import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  ArrowRight, 
  Heart, 
  Plus, 
  TrendingUp, 
  Users, 
  Gift, 
  X, 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Award, 
  Flame, 
  Leaf, 
  Recycle,
  Calendar,
  Clock,
  BarChart3,
  Activity,
  Sparkles,
  Medal,
  Crown,
  Gem,
  Rocket,
  Compass,
  MapPin,
  HeartHandshake,
  TreePine,
  Globe,
  BadgeCheck
} from 'lucide-react';

const Dashboard = () => {
  const { user, api } = useAuth();
  const [stats, setStats] = useState({
    totalItems: 0,
    activeSwaps: 0,
    completedSwaps: 0,
    donations: 0,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [recentSwaps, setRecentSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeUsername, setWelcomeUsername] = useState('');
  
  // Gamification State
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);
  const [nextLevelXP, setNextLevelXP] = useState(100);
  const [achievements, setAchievements] = useState([]);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [ecoScore, setEcoScore] = useState(0);
  const [badges, setBadges] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    initializeGamification();
    
    // Check if user just logged in
    const loginSuccess = localStorage.getItem('loginSuccess');
    const username = localStorage.getItem('username');
    
    if (loginSuccess === 'true' && username) {
      setShowWelcome(true);
      setWelcomeUsername(username);
      
      // Clear the login success flag
      localStorage.removeItem('loginSuccess');
      localStorage.removeItem('username');
      
      // Hide welcome message after 5 seconds
      setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
    }
  }, []);

  // Initialize gamification data
  const initializeGamification = () => {
    // Mock gamification data
    setUserLevel(3);
    setUserXP(250);
    setNextLevelXP(500);
    setDailyStreak(7);
    setEcoScore(850);
    
    setAchievements([
      { id: 1, name: 'First Swap', icon: Trophy, unlocked: true, description: 'Complete your first swap' },
      { id: 2, name: 'Eco Warrior', icon: Leaf, unlocked: true, description: 'Donate 10 items' },
      { id: 3, name: 'Social Butterfly', icon: Users, unlocked: false, description: 'Connect with 20 users' },
      { id: 4, name: 'Fashion Icon', icon: Star, unlocked: false, description: 'List 50 items' },
    ]);
    
    setBadges([
      { id: 1, name: 'Green Hero', icon: BadgeCheck, color: 'bg-green-500', unlocked: true },
      { id: 2, name: 'Swap Master', icon: Medal, color: 'bg-blue-500', unlocked: true },
      { id: 3, name: 'Donation Champion', icon: Heart, color: 'bg-red-500', unlocked: false },
      { id: 4, name: 'Trendsetter', icon: Sparkles, color: 'bg-purple-500', unlocked: false },
    ]);
    
    setChallenges([
      { id: 1, title: 'Swap 3 Items', progress: 2, total: 3, reward: 50, icon: Recycle },
      { id: 2, title: 'Donate 5 Items', progress: 3, total: 5, reward: 100, icon: Gift },
      { id: 3, title: 'Complete Profile', progress: 80, total: 100, reward: 25, icon: Users },
    ]);
    
    setLeaderboard([
      { rank: 1, name: 'EcoWarrior', score: 2450, avatar: '🌟' },
      { rank: 2, name: 'FashionHero', score: 2100, avatar: '👑' },
      { rank: 3, name: user?.firstName || 'You', score: ecoScore, avatar: '🌱', isUser: true },
      { rank: 4, name: 'GreenQueen', score: 1800, avatar: '👸' },
      { rank: 5, name: 'SwapKing', score: 1650, avatar: '🤴' },
    ]);
    
    setActiveChallenge(challenges[0]);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's items
      const itemsResponse = await api.get('/items/user/my-items?limit=5');
      setRecentItems(itemsResponse.data.data.items);

      // Fetch user's swap requests
      const swapsResponse = await api.get('/swaps?type=all&limit=5');
      setRecentSwaps(swapsResponse.data.data.swapRequests);

      // Calculate stats
      const items = itemsResponse.data.data.items;
      const swaps = swapsResponse.data.data.swapRequests;
      
      setStats({
        totalItems: items.length,
        activeSwaps: swaps.filter(s => s.status === 'pending' || s.status === 'accepted').length,
        completedSwaps: swaps.filter(s => s.status === 'completed').length,
        donations: items.filter(i => i.type === 'donation' || i.type === 'both').length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: <Plus className="h-5 w-5" />,
      title: 'Add New Item',
      description: 'List a clothing item for swap or donation',
      link: '/items/new',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      title: 'Browse Items',
      description: 'Discover items available for swap and donation',
      link: '/items',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: 'My Favorites',
      description: 'View your liked items',
      link: '/dashboard/favorites',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      icon: <Gift className="h-5 w-5" />,
      title: 'Make Donation',
      description: 'Donate items to NGOs',
      link: '/donations/new',
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Login Success Banner */}
      {showWelcome && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-900">Welcome {welcomeUsername}!</h3>
                  <p className="text-sm text-green-700">Account Logged in Successfully! Start managing your sustainable fashion journey.</p>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => setShowWelcome(false)}
                  className="bg-green-100 rounded-md p-2 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <X className="h-5 w-5 text-green-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section with Gamification */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center">
                  <Crown className="h-8 w-8 mr-3 text-yellow-300" />
                  Welcome back, {user?.firstName}!
                </h1>
                <p className="text-green-100 mb-4">Your sustainable fashion adventure continues!</p>
                
                {/* Level Progress */}
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Level {userLevel} Eco Warrior</span>
                    <span className="text-sm">{userXP}/{nextLevelXP} XP</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(userXP / nextLevelXP) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 flex flex-col items-center space-y-4">
                <div className="text-center">
                  <div className="text-5xl font-bold">{ecoScore}</div>
                  <div className="text-sm text-green-100">Eco Score</div>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Flame className="h-5 w-5 text-orange-300" />
                  <span className="font-medium">{dailyStreak} Day Streak</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards with Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalItems}</p>
                <p className="text-xs text-green-600 mt-1">+12% this month</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Swaps</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeSwaps}</p>
                <p className="text-xs text-blue-600 mt-1">3 pending</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Swaps</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedSwaps}</p>
                <p className="text-xs text-purple-600 mt-1">Great job!</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Donations</p>
                <p className="text-3xl font-bold text-gray-900">{stats.donations}</p>
                <p className="text-xs text-orange-600 mt-1">5 this month</p>
              </div>
              <div className="bg-orange-100 rounded-lg p-3">
                <Gift className="h-6 w-6 text-orange-600" />
              </div>
            </div>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No items yet</p>
                  <Link
                    to="/items/new"
                    className="btn-primary"
                  >
                    Add Your First Item
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Swaps */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Swap Requests</h2>
                <Link
                  to="/swaps"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentSwaps.length > 0 ? (
                <div className="space-y-4">
                  {recentSwaps.map((swap) => (
                    <div key={swap._id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          Swap for "{swap.itemRequested?.title}"
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          swap.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : swap.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : swap.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {swap.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        With {swap.itemOffered?.owner?.firstName} • {swap.createdAt?.split('T')[0]}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No swap requests yet</p>
                  <Link
                    to="/items"
                    className="btn-primary"
                  >
                    Browse Items to Swap
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Environmental Impact</h2>
              <p className="text-gray-600">
                By participating in EcoCloset, you've helped save approximately{' '}
                <span className="font-semibold text-green-600">
                  {stats.completedSwaps * 7}kg CO₂
                </span>{' '}
                and reduced fashion waste.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {stats.completedSwaps + stats.donations}
              </div>
              <div className="text-sm text-gray-600">Items Recycled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
