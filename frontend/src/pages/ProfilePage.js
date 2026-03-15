import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Package, 
  Heart, 
  Star, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  Settings,
  Camera,
  Edit,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Award
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Sarah Mitchell',
    email: user?.email || 'sarah.mitchell@email.com',
    phone: user?.phone || '+1 (555) 123-4567',
    location: user?.location || 'New York, NY',
    bio: 'Sustainable fashion advocate. Love finding unique pieces and giving them a second life.',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=200&h=200&fit=crop&crop=center'
  });

  const [userListings, setUserListings] = useState([
    {
      id: 1,
      title: 'Vintage Denim Jacket',
      price: 45,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop&crop=center',
      category: 'Outerwear',
      condition: 'Good',
      type: 'sell',
      status: 'active',
      views: 156,
      likes: 23,
      listed: '2 days ago'
    },
    {
      id: 2,
      title: 'Floral Summer Dress',
      price: 35,
      image: 'https://images.unsplash.com/photo-1469334933656-a20f5b9a6c6d?w=300&h=300&fit=crop&crop=center',
      category: 'Dresses',
      condition: 'Like New',
      type: 'sell',
      status: 'active',
      views: 89,
      likes: 15,
      listed: '1 week ago'
    },
    {
      id: 3,
      title: 'Classic White Sneakers',
      price: 25,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center',
      category: 'Shoes',
      condition: 'New',
      type: 'swap',
      status: 'active',
      views: 234,
      likes: 31,
      listed: '3 days ago'
    }
  ]);

  const [userStats, setUserStats] = useState({
    totalListings: 12,
    activeListings: 8,
    soldItems: 3,
    swappedItems: 2,
    donatedItems: 1,
    totalEarnings: 245,
    averageRating: 4.8,
    totalReviews: 47,
    responseRate: 95,
    responseTime: '2 hours'
  });

  const [savedItems, setSavedItems] = useState([
    {
      id: 1,
      title: 'Leather Handbag',
      price: 55,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center',
      seller: 'Lisa K.',
      category: 'Accessories',
      condition: 'Excellent',
      saved: '3 days ago'
    },
    {
      id: 2,
      title: 'Wool Winter Coat',
      price: 65,
      image: 'https://images.unsplash.com/photo-1544966669-7e5b5c8dd0c5?w=300&h=300&fit=crop&crop=center',
      seller: 'David L.',
      category: 'Outerwear',
      condition: 'Good',
      saved: '1 week ago'
    }
  ]);

  const handleProfileEdit = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const saveProfile = () => {
    setIsEditing(false);
    // Simulate API call
    setTimeout(() => {
      alert('Profile updated successfully!');
    }, 500);
  };

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: Package, count: userStats.activeListings },
    { id: 'saved', label: 'Saved Items', icon: Heart, count: savedItems.length },
    { id: 'stats', label: 'Statistics', icon: TrendingUp, count: null },
    { id: 'settings', label: 'Settings', icon: Settings, count: null }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isEditing ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Save</span>
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Edit Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleProfileEdit('name', e.target.value)}
                    className="text-xl font-bold text-gray-900 mb-2 text-center border-b border-gray-300 focus:outline-none focus:border-green-500"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{user?.name || profileData.name}</h2>
                )}
                
                <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                  <Shield className="h-4 w-4 text-green-600 mr-1" />
                  <span>Verified Seller</span>
                </div>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileEdit('email', e.target.value)}
                        className="flex-1 border-b border-gray-300 focus:outline-none focus:border-green-500"
                      />
                    ) : (
                      <span>{user?.email || profileData.email}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleProfileEdit('phone', e.target.value)}
                        className="flex-1 border-b border-gray-300 focus:outline-none focus:border-green-500"
                      />
                    ) : (
                      <span>{user?.phone || profileData.phone}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleProfileEdit('location', e.target.value)}
                        className="flex-1 border-b border-gray-300 focus:outline-none focus:border-green-500"
                      />
                    ) : (
                      <span>{user?.location || profileData.location}</span>
                    )}
                  </div>
                </div>
                
                {isEditing && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleProfileEdit('bio', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                )}
                
                {!isEditing && (
                  <div className="mt-6 text-left">
                    <p className="text-sm text-gray-600">{profileData.bio}</p>
                  </div>
                )}
                
                {isEditing && (
                  <button
                    onClick={saveProfile}
                    className="w-full mt-6 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stats Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userStats.totalListings}</div>
                  <div className="text-sm text-gray-600">Total Listings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userStats.soldItems}</div>
                  <div className="text-sm text-gray-600">Items Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userStats.swappedItems}</div>
                  <div className="text-sm text-gray-600">Items Swapped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">{formatCurrency(userStats.totalEarnings)}</div>
                  <div className="text-sm text-gray-600">Total Earnings</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-green-600 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                      {tab.count !== null && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* My Listings Tab */}
                {activeTab === 'listings' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Active Listings</h4>
                    {userListings.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900">{item.title}</h5>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span className="font-medium text-green-600">{formatCurrency(item.price)}</span>
                            <span>{item.category}</span>
                            <span>{item.condition}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.type === 'sell' ? 'bg-green-100 text-green-800' :
                              item.type === 'swap' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {item.type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                            <span className="flex items-center">
                              <Package className="h-3 w-3 mr-1" />
                              {item.views} views
                            </span>
                            <span className="flex items-center">
                              <Heart className="h-3 w-3 mr-1" />
                              {item.likes} likes
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {item.listed}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Saved Items Tab */}
                {activeTab === 'saved' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Saved Items</h4>
                    {savedItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900">{item.title}</h5>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span className="font-medium text-green-600">{formatCurrency(item.price)}</span>
                            <span>{item.category}</span>
                            <span>{item.condition}</span>
                            <span>Seller: {item.seller}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            Saved {item.saved}
                          </div>
                        </div>
                        <button className="text-red-400 hover:text-red-600">
                          <Heart className="h-5 w-5 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Statistics Tab */}
                {activeTab === 'stats' && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Statistics</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">Seller Rating</h5>
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{userStats.averageRating}</div>
                        <div className="text-sm text-gray-600">{userStats.totalReviews} reviews</div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">Response Rate</h5>
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{userStats.responseRate}%</div>
                        <div className="text-sm text-gray-600">Avg. response: {userStats.responseTime}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">Items Sold</h5>
                          <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{userStats.soldItems}</div>
                        <div className="text-sm text-gray-600">This month: 2</div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">Items Swapped</h5>
                          <Award className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{userStats.swappedItems}</div>
                        <div className="text-sm text-gray-600">This month: 1</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">Email Notifications</h5>
                          <p className="text-sm text-gray-600">Receive updates about your listings</p>
                        </div>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                          Enabled
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">Push Notifications</h5>
                          <p className="text-sm text-gray-600">Get instant updates on your device</p>
                        </div>
                        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                          Disabled
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">Profile Visibility</h5>
                          <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                        </div>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                          Public
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">Two-Factor Authentication</h5>
                          <p className="text-sm text-gray-600">Add an extra layer of security</p>
                        </div>
                        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                          Not Set Up
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
