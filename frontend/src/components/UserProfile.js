import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Calendar,
  Star,
  TrendingUp,
  Package,
  Settings,
  LogOut,
  Edit,
  Camera
} from 'lucide-react';

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || 'John',
    lastName: user?.name?.split(' ')[1] || 'Doe',
    username: user?.email?.split('@')[0] || 'johndoe123',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+1 234 567 8900',
    location: user?.location || 'New York, USA',
    memberSince: 'January 2024',
    bio: 'Fashion enthusiast | Sustainable shopping advocate | Love vintage finds',
    profileImage: user?.avatar || null
  });

  // Update profileData if user becomes available (e.g. after refresh/load)
  React.useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || prev.firstName,
        lastName: user.name?.split(' ')[1] || prev.lastName,
        username: user.email?.split('@')[0] || prev.username,
        email: user.email,
        phone: user.phone || prev.phone,
        location: user.location || prev.location,
        profileImage: user.avatar || prev.profileImage
      }));
    }
  }, [user]);

  const stats = {
    itemsListed: 12,
    itemsSold: 8,
    itemsSwapped: 4,
    averageRating: 4.8,
    totalReviews: 23
  };

  const recentActivity = [
    { id: 1, type: 'listed', item: 'Vintage Denim Jacket', date: '2 days ago', price: '₹3,750' },
    { id: 2, type: 'sold', item: 'Summer Floral Dress', date: '1 week ago', price: '₹2,650' },
    { id: 3, type: 'swapped', item: 'Leather Boots', date: '2 weeks ago', price: 'Swap' }
  ];

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save profile logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EC</span>
                </div>
                <span className="text-xl font-bold text-gray-900">EcoCloset</span>
              </Link>
              <span className="text-gray-500">|</span>
              <span className="text-gray-600">Profile</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-200">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Last Name"
                    />
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Username"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900">{profileData.firstName} {profileData.lastName}</h2>
                    <p className="text-gray-600">@{profileData.username}</p>
                  </>
                )}
                
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{stats.averageRating}</span>
                  <span className="text-sm text-gray-400">({stats.totalReviews} reviews)</span>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{profileData.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{profileData.location}</span>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600 text-sm">{profileData.bio}</p>
                )}
              </div>

              {/* Edit/Save Button */}
              <button
                onClick={isEditing ? handleSaveProfile : handleEditProfile}
                className="w-full mt-6 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
              >
                {isEditing ? (
                  <>
                    Save Profile
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.itemsListed}</div>
                  <div className="text-sm text-gray-600">Items Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.itemsSold}</div>
                  <div className="text-sm text-gray-600">Items Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.itemsSwapped}</div>
                  <div className="text-sm text-gray-600">Items Swapped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}</div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Recent Activity</h3>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'listed' ? 'bg-green-100' :
                        activity.type === 'sold' ? 'bg-blue-100' :
                        'bg-purple-100'
                      }`}>
                        {activity.type === 'listed' ? (
                          <Package className="h-5 w-5 text-green-600" />
                        ) : activity.type === 'sold' ? (
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        ) : (
                          <ShoppingBag className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{activity.item}</div>
                        <div className="text-sm text-gray-500">{activity.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        activity.type === 'listed' ? 'text-green-600' :
                        activity.type === 'sold' ? 'text-blue-600' :
                        'text-purple-600'
                      }`}>
                        {activity.price}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">{activity.type}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Activity Button */}
              <button className="w-full mt-6 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                View All Activity
              </button>
            </div>

            {/* My Listings Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-900">My Listings</h3>
                <Link to="/dashboard" className="text-green-600 hover:text-green-700 font-medium">
                  View All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-32 bg-gray-200"></div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900">Vintage Denim Jacket</h4>
                    <p className="text-green-600 font-semibold">₹3,750</p>
                    <p className="text-sm text-gray-500">Listed 2 days ago</p>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-32 bg-gray-200"></div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900">Summer Floral Dress</h4>
                    <p className="text-blue-600 font-semibold">Swap</p>
                    <p className="text-sm text-gray-500">Listed 1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
