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

const ICON_MAP = {
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
};

const InnovativeDashboard = () => {
  const { user, api } = useAuth();
  const [stats, setStats] = useState({
    totalItems: 0,
    activeSwaps: 0,
    completedSwaps: 0,
    donations: 0,
    ecoScore: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [recentSwaps, setRecentSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    if (user?.id) {
      fetchDashboardData();
    }
    
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
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching dashboard data for user:', user.id);
      console.log('API baseURL:', api.defaults.baseURL);
      const response = await api.get(`dashboard/user/${user.id}`);
      console.log('Dashboard response:', response.data);
      const { success, data, message } = response.data;

      if (!success) {
        throw new Error(message || 'Failed to fetch dashboard data');
      }

      setStats(data.stats);
      setRecentItems(data.recentItems);
      setRecentSwaps(data.recentSwaps);
      
      // Map icons for achievements
      const mappedAchievements = data.achievements.map(ach => ({
        ...ach,
        icon: ICON_MAP[ach.icon] || Trophy,
        unlocked: true
      }));
      setAchievements(mappedAchievements);

      // Map icons for badges
      const mappedBadges = data.badges.map(badge => ({
        ...badge,
        icon: ICON_MAP[badge.icon] || Medal,
        unlocked: true
      }));
      setBadges(mappedBadges);

      // User Gamification
      setUserLevel(data.user.level);
      setUserXP(data.user.xp);
      setNextLevelXP(data.user.next_level_xp);
      setDailyStreak(data.user.streak);
      setEcoScore(data.user.eco_score);

      // Static placeholder for challenges and leaderboard for now
      setChallenges([
        { id: 1, title: 'Swap 3 Items', progress: data.stats.totalItems % 3, total: 3, reward: 50, icon: Recycle },
        { id: 2, title: 'Donate 5 Items', progress: data.stats.donations % 5, total: 5, reward: 100, icon: Gift },
      ]);
      
      setLeaderboard([
        { rank: 1, name: 'EcoWarrior', score: 2450, avatar: '🌟' },
        { rank: 2, name: 'FashionHero', score: 2100, avatar: '👑' },
        { rank: 3, name: data.user.firstName || 'You', score: data.user.eco_score, avatar: '🌱', isUser: true },
      ]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading your sustainable universe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
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
          </div>
        </div>

        {/* Gamification Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Active Challenge */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center mb-4">
              <Target className="h-8 w-8 mr-2" />
              <h2 className="text-xl font-bold">Active Challenge</h2>
            </div>
            {activeChallenge && (
              <div>
                <h3 className="text-lg font-semibold mb-2">{activeChallenge.title}</h3>
                <div className="bg-white/20 rounded-lg p-3 mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{activeChallenge.progress}/{activeChallenge.total}</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(activeChallenge.progress / activeChallenge.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reward: {activeChallenge.reward} XP</span>
                  <activeChallenge.icon className="h-5 w-5" />
                </div>
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Trophy className="h-8 w-8 mr-2 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {achievements.slice(0, 4).map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'border-yellow-400 bg-yellow-50' 
                      : 'border-gray-200 bg-gray-50 opacity-50'
                  }`}
                >
                  <achievement.icon className={`h-6 w-6 mb-1 ${
                    achievement.unlocked ? 'text-yellow-500' : 'text-gray-400'
                  }`} />
                  <p className="text-xs font-medium text-gray-900">{achievement.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Medal className="h-8 w-8 mr-2 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">Your Badges</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div 
                  key={badge.id}
                  className={`p-3 rounded-lg text-center transition-all duration-300 ${
                    badge.unlocked 
                      ? `${badge.color} text-white transform hover:scale-105` 
                      : 'bg-gray-100 text-gray-400 opacity-50'
                  }`}
                >
                  <badge.icon className="h-6 w-6 mx-auto mb-1" />
                  <p className="text-xs font-medium">{badge.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Crown className="h-8 w-8 mr-2 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
              </div>
              <span className="text-sm text-gray-500">This Week</span>
            </div>
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div 
                  key={user.rank}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                    user.isUser 
                      ? 'bg-green-100 border-2 border-green-500' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      user.rank === 1 ? 'bg-yellow-500 text-white' :
                      user.rank === 2 ? 'bg-gray-400 text-white' :
                      user.rank === 3 ? 'bg-orange-600 text-white' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {user.rank}
                    </div>
                    <span className="ml-3 text-lg">{user.avatar}</span>
                    <span className="ml-2 font-medium text-gray-900">{user.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{user.score}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Rocket className="h-8 w-8 mr-2 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/sell-swap"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 text-center"
              >
                <Plus className="h-6 w-6 mx-auto mb-2" />
                <p className="font-medium">List Item</p>
              </Link>
              <Link
                to="/items"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-center"
              >
                <ShoppingBag className="h-6 w-6 mx-auto mb-2" />
                <p className="font-medium">Browse</p>
              </Link>
              <Link
                to="/donate"
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-center"
              >
                <Gift className="h-6 w-6 mx-auto mb-2" />
                <p className="font-medium">Donate</p>
              </Link>
              <Link
                to="/swaps"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 text-center"
              >
                <Heart className="h-6 w-6 mx-auto mb-2" />
                <p className="font-medium">Swaps</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 mr-2 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            <Link to="/profile" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Profile
            </Link>
          </div>
          <div className="space-y-4">
            {recentItems.length === 0 && recentSwaps.length === 0 && (
              <p className="text-center text-gray-500 py-4 italic">No recent activity found. Start your journey by listing an item!</p>
            )}
            
            {recentItems.map((item) => (
              <div key={`item-${item.id}`} className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <ShoppingBag className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New Item Listed</p>
                  <p className="text-xs text-gray-600">{item.title} - ₹{item.price}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}

            {recentSwaps.map((swap) => (
              <div key={`swap-${swap.id}`} className="flex items-center p-3 bg-green-50 rounded-lg">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <Recycle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Swap {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}</p>
                  <p className="text-xs text-gray-600">
                    {swap.item_a_title} ⇋ {swap.item_b_title}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(swap.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InnovativeDashboard;
