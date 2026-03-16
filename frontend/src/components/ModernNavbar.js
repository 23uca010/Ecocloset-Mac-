import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Heart, 
  Menu, 
  X, 
  Leaf,
  Bell,
  Plus,
  LogOut,
  Settings,
  Shield,
  LayoutDashboard,
  ChevronDown,
  ShoppingCart,
  Recycle,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Cart from './Cart';

const ModernNavbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsSellOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18" style={{height: '72px'}}>
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/home" className="flex items-center gap-2.5">
              <div className="bg-[#108c4b] p-1.5 rounded-lg">
                <Leaf className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[1.35rem] font-bold text-gray-900 tracking-tight">EcoCloset</span>
            </Link>
          </div>

          {/* Search Bar - Centered */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" style={{height:'18px',width:'18px'}} />
              <input
                type="text"
                placeholder="Search for clothes, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#108c4b] focus:outline-none focus:ring-2 focus:ring-green-100 transition-all text-gray-700 text-sm"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link 
              to="/home" 
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/home') || isActive('/') ? 'text-[#108c4b] bg-green-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            <Link 
              to="/browse" 
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/browse') ? 'text-[#108c4b] bg-green-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Browse
            </Link>

            {/* Sell/Swap Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSellOpen(!isSellOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/sell') || isActive('/swap') || isActive('/add-listing') ? 'text-[#108c4b] bg-green-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Plus className="h-4 w-4" />
                Sell/Swap
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isSellOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSellOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <Link to="/sell" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsSellOpen(false)}>
                    <ShoppingCart className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium">Sell Item</div>
                      <div className="text-xs text-gray-400">List with a price</div>
                    </div>
                  </Link>
                  <Link to="/swap" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsSellOpen(false)}>
                    <Recycle className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium">Swap Item</div>
                      <div className="text-xs text-gray-400">Trade for another</div>
                    </div>
                  </Link>
                  <div className="h-px bg-gray-100 my-1" />
                  <Link to="/add-listing" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsSellOpen(false)}>
                    <Plus className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Add Listing</div>
                      <div className="text-xs text-gray-400">All options</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link 
              to="/donate" 
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/donate') ? 'text-[#108c4b] bg-green-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Heart className="h-4 w-4" />
              Donate
            </Link>

            {/* Divider */}
            <div className="h-5 w-px bg-gray-200 mx-1" />

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#108c4b] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-bold">
                  {user?.firstName?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {!isAuthenticated ? (
                    <div className="px-3 py-2 space-y-2">
                      <Link to="/login" className="block w-full text-center bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800" onClick={() => setIsProfileOpen(false)}>Log In</Link>
                      <Link to="/register" className="block w-full text-center border border-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50" onClick={() => setIsProfileOpen(false)}>Sign Up</Link>
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.firstName || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                      </div>
                      {user?.role !== 'admin' && (
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsProfileOpen(false)}>
                          <LayoutDashboard className="h-4 w-4 text-gray-400" /> Dashboard
                        </Link>
                      )}
                      {user?.role === 'admin' && (
                        <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-indigo-600 font-semibold hover:bg-indigo-50" onClick={() => setIsProfileOpen(false)}>
                          <Shield className="h-4 w-4" /> Admin Panel
                        </Link>
                      )}
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsProfileOpen(false)}>
                        <Settings className="h-4 w-4 text-gray-400" /> Settings
                      </Link>
                      <div className="h-px bg-gray-100 my-1" />
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleCart} className="relative p-2 text-gray-600">
              <ShoppingBag className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#108c4b] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600 hover:text-gray-900">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="px-4 pt-3 pb-2">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 text-sm"
              />
            </form>
          </div>
          <div className="px-3 pb-4 space-y-0.5">
            <Link to="/home" className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
              <Home className="h-5 w-5 text-[#108c4b]" /> Home
            </Link>
            <Link to="/browse" className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
              <ShoppingBag className="h-5 w-5 text-[#108c4b]" /> Browse
            </Link>
            <Link to="/sell" className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
              <ShoppingCart className="h-5 w-5 text-green-600" /> Sell Item
            </Link>
            <Link to="/swap" className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
              <Recycle className="h-5 w-5 text-blue-600" /> Swap Item
            </Link>
            <Link to="/donate" className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
              <Heart className="h-5 w-5 text-red-500" /> Donate
            </Link>
            {isAuthenticated && user?.role !== 'admin' && (
              <Link to="/dashboard" className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                <LayoutDashboard className="h-5 w-5 text-gray-500" /> Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-3 text-base font-medium text-indigo-600 rounded-lg hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>
                <Shield className="h-5 w-5" /> Admin Panel
              </Link>
            )}
            {isAuthenticated ? (
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex items-center gap-3 px-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                    {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user?.firstName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-3 py-3 text-base font-medium text-red-600 rounded-lg hover:bg-red-50">
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-100 pt-3 mt-3 space-y-2 px-3">
                <Link to="/login" className="block w-full text-center bg-gray-900 text-white py-3 rounded-xl font-medium" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                <Link to="/register" className="block w-full text-center border border-gray-200 text-gray-900 py-3 rounded-xl font-medium" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
      <Cart />
    </nav>
  );
};

export default ModernNavbar;
