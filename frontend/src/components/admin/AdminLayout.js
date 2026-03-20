import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, Users, ShoppingBag, Repeat, 
  AlertTriangle, Tags, Settings, LogOut, 
  Menu, X, Shield, Bell, Search, Heart,
  ShoppingCart, MessageSquare, PieChart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'listings', label: 'Listings', icon: <ShoppingBag size={20} /> },
    { id: 'swaps', label: 'Swap Requests', icon: <Repeat size={20} /> },
    { id: 'donations', label: 'Donations', icon: <Heart size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
    { id: 'reports', label: 'Reports', icon: <AlertTriangle size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <PieChart size={20} /> },
  ];

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Shield size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">EcoCloset</span>
            </div>
            <button 
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${activeTab === item.id 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-100">
               <button
                onClick={() => setActiveTab('settings')}
                className={`
                  flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${activeTab === 'settings' 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <Settings size={20} />
                Settings
              </button>
            </div>
          </nav>

          {/* User Profile Hook */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Eco Admin'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-rose-600 font-semibold text-sm hover:bg-rose-50 rounded-xl transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
             <button 
                className="lg:hidden p-2 text-gray-400 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-bold text-gray-900 capitalize lg:ml-0 ml-2">
                {menuItems.find(i => i.id === activeTab)?.label || activeTab}
              </h2>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden md:flex relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm"
              />
            </div>
            
            <button className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-px bg-gray-200"></div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-gray-900">Eco Admin</p>
                <p className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 rounded-full inline-block">Online</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
