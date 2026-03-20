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
  Camera,
  Activity
} from 'lucide-react';

const UserProfile = () => {
  const { user, isAuthenticated, api } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || 'User',
    lastName: user?.name?.split(' ')[1] || '',
    username: user?.email?.split('@')[0] || 'user',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    memberSince: 'January 2024',
    bio: 'Fashion enthusiast | Sustainable shopping advocate | Love vintage finds',
    profileImage: user?.avatar || null
  });

  useEffect(() => {
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
      fetchUserItems(user.id);
    }
  }, [user]);

  const fetchUserItems = async (userId) => {
    try {
      setLoading(true);
      const res = await api.get(`/items/user/${userId}`);
      if (res.data?.success) {
        setUserItems(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Future: Call API to update profile
  };

  // Dynamic Stats Calculation
  const itemsListed = userItems.length;
  const itemsSold = userItems.filter(i => i.status === 'sold').length;
  const itemsSwapped = userItems.filter(i => i.status === 'swapped' || i.status === 'swapped_completed').length;
  const averageRating = 4.8; // Placeholder: Real review system not integrated yet
  const totalReviews = 23;

  // Derive recent activity from actual user items (sorting descending by created_at)
  const sortedItems = [...userItems].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const recentActivity = sortedItems.slice(0, 5).map(item => ({
    id: item.id,
    type: item.status === 'sold' ? 'sold' : item.status === 'swapped' ? 'swapped' : 'listed',
    item: item.title,
    date: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    price: item.listingType === 'swap' || item.listingType === 'donate' ? 'Swap / Donate' : `₹${item.price}`,
    original: item
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/home" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EC</span>
                </div>
                <span className="text-xl font-bold text-gray-900">EcoCloset</span>
              </Link>
              <span className="text-gray-500">|</span>
              <span className="text-gray-600">Profile</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="h-5 w-5" />
              </Link>
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
                  {profileData.profileImage ? (
                    <img src={profileData.profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover shadow-sm border-4 border-white" />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-4xl font-extrabold shadow-sm border-4 border-white">
                      {profileData.firstName?.charAt(0)}
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
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
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900">{profileData.firstName} {profileData.lastName}</h2>
                    <p className="text-gray-600">@{profileData.username}</p>
                  </>
                )}
                
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-700">{averageRating}</span>
                  <span className="text-sm text-gray-400">({totalReviews} reviews)</span>
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
                  <span className="text-sm">{profileData.location || 'Location not set'}</span>
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
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{profileData.bio}</p>
                )}
              </div>

              {/* Edit/Save Button */}
              <button
                onClick={isEditing ? handleSaveProfile : handleEditProfile}
                className="w-full mt-6 bg-green-600 text-white py-2.5 px-4 rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center shadow-sm"
              >
                {isEditing ? 'Save Profile' : <><Edit className="h-4 w-4 mr-2" /> Edit Profile</>}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-2xl font-bold text-green-600">{itemsListed}</div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">Items Listed</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">{itemsSold}</div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">Items Sold</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-2xl font-bold text-purple-600">{itemsSwapped}</div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">Items Swapped</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-2xl font-bold text-yellow-500">{averageRating}</div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activity & My Listings */}
          <div className="lg:col-span-2">
            
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5 text-indigo-500" />
                <h3 className="font-bold text-lg text-gray-900">Recent Activity</h3>
              </div>
              
              {loading ? (
                 <div className="flex justify-center py-6">
                    <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                 </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent activity found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:shadow-sm transition-all">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          activity.type === 'listed' ? 'bg-green-100 text-green-600' :
                          activity.type === 'sold' ? 'bg-blue-100 text-blue-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {activity.type === 'listed' ? <Package className="h-5 w-5" /> : 
                           activity.type === 'sold' ? <TrendingUp className="h-5 w-5" /> : 
                           <ShoppingBag className="h-5 w-5" />}
                        </div>
                        <div className="min-w-0">
                          <Link to={`/item/${activity.id}`} className="font-semibold text-gray-900 hover:text-green-600 transition-colors truncate block">{activity.item}</Link>
                          <div className="text-xs font-medium text-gray-500 mt-0.5">{activity.date}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className={`font-bold text-sm ${
                          activity.type === 'listed' ? 'text-green-600' :
                          activity.type === 'sold' ? 'text-blue-600' :
                          'text-purple-600'
                        }`}>
                          {activity.price}
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{activity.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Listings Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-rose-500" />
                  <h3 className="font-bold text-lg text-gray-900">My Listings</h3>
                </div>
                {userItems.length > 0 && (
                  <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{userItems.length} Total</span>
                )}
              </div>
              
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                       <div className="h-40 bg-gray-200" />
                       <div className="p-4 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                       </div>
                    </div>
                   ))}
                </div>
              ) : userItems.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">You haven't listed any items yet.</h3>
                  <p className="text-gray-500 text-sm mb-6">Start your sustainable fashion journey by adding your first listing.</p>
                  <Link to="/sell-swap" className="inline-flex items-center gap-2 bg-[#108c4b] text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition">
                    Create Listing
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userItems.map(item => (
                    <Link key={item.id} to={`/item/${item.id}`} className="group block rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-green-200 transition-all bg-white relative">
                      <div className="aspect-square bg-gray-100 overflow-hidden relative">
                        {item.image ? (
                          <img src={`http://localhost:5001/${item.image.replace(/\\/g, '/')}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm backdrop-blur-md bg-white/90 ${
                            item.status === 'active' ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-900 truncate pr-2 group-hover:text-green-600 transition-colors">{item.title}</h4>
                        </div>
                        <p className="text-sm font-extrabold text-gray-900 mb-2">
                          {item.listingType === 'swap' || item.listingType === 'donate' ? (
                            <span className="text-blue-600 capitalize">{item.listingType}</span>
                          ) : (
                             `₹${item.price}`
                          )}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          Listed {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
