import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ConnectionTest from '../components/ConnectionTest';
import QuickFix from '../components/QuickFix';
import SampleDataLoader from '../components/SampleDataLoader';
import AuthTest from '../components/AuthTest';
import { 
  Search, 
  Gift, 
  Recycle, 
  User, 
  ShoppingCart, 
  Package, 
  ArrowRight 
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { items, totalItems, totalPrice } = useCart();
  const [searchParams] = useSearchParams();
  const [showConnectionTest, setShowConnectionTest] = useState(false);
  const [showQuickFix, setShowQuickFix] = useState(false);
  const [showSampleLoader, setShowSampleLoader] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeUsername, setWelcomeUsername] = useState('');
  
  useEffect(() => {
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
    
    console.log('Home component mounted, searchParams:', searchParams.toString());
    if (searchParams.get('welcome') === 'true') {
      console.log('Welcome parameter detected, showing welcome banner');
      setShowWelcome(true);
      // Remove the welcome parameter from URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Connection Test Button */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-800">Test your Supabase connection and fix any issues</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSampleLoader(!showSampleLoader)}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium"
              >
                {showSampleLoader ? 'Hide Samples' : 'Add Items'}
              </button>
              <button
                onClick={() => setShowQuickFix(!showQuickFix)}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
              >
                {showQuickFix ? 'Hide Fix' : 'Quick Fix'}
              </button>
              <button
                onClick={() => setShowConnectionTest(!showConnectionTest)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              >
                {showConnectionTest ? 'Hide Test' : 'Run Test'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Data Loader */}
      {showSampleLoader && (
        <div className="bg-purple-50 border-b border-purple-200">
          <SampleDataLoader />
        </div>
      )}

      {/* QuickFix Component */}
      {showQuickFix && (
        <div className="bg-orange-50 border-b border-orange-200">
          <QuickFix />
        </div>
      )}

      {/* Connection Test Component */}
      {showConnectionTest && (
        <div className="bg-gray-100 border-b border-gray-200">
          <ConnectionTest />
        </div>
      )}

      {/* Welcome Banner */}
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
                  <p className="text-sm text-green-700">Account Logged in Successfully! Start exploring sustainable fashion today.</p>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => setShowWelcome(false)}
                  className="bg-green-100 rounded-md p-2 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              EcoCloset
              <span className="block text-2xl md:text-3xl text-green-100 mt-2">Sustainable Fashion Marketplace</span>
            </h1>
            <p className="text-xl text-green-50 mb-8 max-w-3xl mx-auto">
              Browse, donate, and swap pre-loved fashion items. Join the eco-fashion revolution and reduce fashion waste.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Empty */}
          <div className="lg:col-span-2 space-y-8">
            {/* Content removed - only User Profile section remains */}
          </div>

          {/* Right Column - User Profile Only */}
          <div className="space-y-8">
            
            {/* User Profile Section */}
            {isAuthenticated && user ? (
              <section className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <User className="h-8 w-8 text-green-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-green-600 capitalize">{user.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-gray-900">0</div>
                    <div className="text-xs text-gray-600">My Items</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-gray-900">0</div>
                    <div className="text-xs text-gray-600">Swaps</div>
                  </div>
                </div>
                <Link 
                  to="/dashboard" 
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm font-medium"
                >
                  View Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </section>
            ) : (
              <section className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <User className="h-8 w-8 text-green-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Join EcoCloset</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Sign up to start browsing, donating, and swapping sustainable fashion items.
                </p>
                {isAuthenticated ? (
                  <Link 
                    to="/sell-swap" 
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center font-medium"
                  >
                    <Recycle className="h-5 w-5 mr-2" />
                    List Your Items
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center font-medium"
                  >
                    <Recycle className="h-5 w-5 mr-2" />
                    Login to Sell/Swap
                  </Link>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
      
      {/* Comprehensive Auth Test Component */}
      <AuthTest />
    </div>
  );
};

export default Home;
