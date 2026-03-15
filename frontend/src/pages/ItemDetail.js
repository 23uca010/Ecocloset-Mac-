import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Heart, ArrowLeft, MapPin, Eye, Calendar, User, MessageCircle, Send, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const ItemDetail = () => {
  const { id } = useParams();
  const { api, isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [userItems, setUserItems] = useState([]);

  useEffect(() => {
    fetchItemDetail();
    if (isAuthenticated) {
      fetchUserItems();
    }
  }, [id, isAuthenticated, user]);

  const fetchItemDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/items/${id}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        const itemData = data.data;
        // Map backend fields to frontend expected structure
        const mappedItem = {
          ...itemData,
          images: itemData.image ? [`http://localhost:5000/${itemData.image.replace(/\\/g, '/')}`] : [],
          owner: {
            _id: itemData.user_id,
            firstName: "User", // Placeholder or fetch user name
            lastName: itemData.user_id,
            createdAt: new Date().toISOString()
          },
          status: 'available',
          likes: []
        };
        setItem(mappedItem);
      } else {
        setError('Item not found');
      }
    } catch (error) {
      setError('Item not found');
      console.error('Error fetching item detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserItems = async () => {
    try {
      const response = await api.get('/items/user/my-items?status=available');
      setUserItems(response.data.data.items);
    } catch (error) {
      console.error('Error fetching user items:', error);
    }
  };

  const toggleLike = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      await api.post(`/items/${id}/like`);
      setIsLiked(!isLiked);
      setItem(prev => ({
        ...prev,
        likes: isLiked 
          ? prev.likes.filter(like => like.user !== user._id)
          : [...prev.likes, { user: user._id, createdAt: new Date() }]
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const initiateSwap = async () => {
    if (!swapMessage.trim()) return;
    
    try {
      // This would open a modal to select which item to offer for swap
      // For now, we'll just show the modal
      setShowSwapModal(true);
    } catch (error) {
      console.error('Error initiating swap:', error);
    }
  };

  const initiateDonation = async () => {
    try {
      const response = await api.post('/donations', {
        item: id,
        ngo: null, // User would select an NGO
        donationType: 'pickup',
        estimatedValue: 0,
        taxReceipt: { requested: false }
      });
      // Handle success
    } catch (error) {
      console.error('Error initiating donation:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h2>
          <p className="text-gray-600 mb-8">The item you're looking for doesn't exist or has been removed.</p>
          <Link to="/items" className="btn-primary">
            Browse Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/items" className="inline-flex items-center text-gray-600 hover:text-green-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Items
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={item.images[0] || '/placeholder-item.jpg'}
                alt={item.title}
                className="w-full h-96 object-cover"
              />
            </div>
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${item.title} ${index + 2}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Title and Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="capitalize">{item.category}</span>
                    <span className="uppercase">{item.size}</span>
                    <span>{item.condition.replace('_', ' ')}</span>
                  </div>
                </div>
                <button
                  onClick={toggleLike}
                  disabled={!isAuthenticated}
                  className={`p-3 rounded-full ${
                    isLiked
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } transition-colors disabled:opacity-50`}
                >
                  <Heart className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
                </button>
              </div>

              <p className="text-gray-700 mb-6">{item.description}</p>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    item.type === 'swap' 
                      ? 'bg-blue-100 text-blue-800'
                      : item.type === 'donation'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {item.type === 'both' ? 'Swap & Donate' : item.type}
                  </span>
                  <div className="flex items-center text-gray-500">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{item.views} views</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>{item.likes?.length || 0} likes</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(item.price)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(item)}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-medium">Add to Cart</span>
                </button>
                
                {isAuthenticated && user && item.owner._id !== user._id && item.status === 'available' && (
                  <div className="space-y-3">
                    {item.type !== 'donation' && (
                      <button
                        onClick={initiateSwap}
                        className="w-full btn-primary"
                      >
                        Request Swap
                      </button>
                    )}
                    {item.type !== 'swap' && (
                      <button
                        onClick={initiateDonation}
                        className="w-full btn-outline"
                      >
                        Request Donation
                      </button>
                    )}
                  </div>
                )}

                {user && item.owner._id === user._id && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">This is your item. You can edit or manage it from your dashboard.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {item.owner.firstName?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {item.owner.firstName} {item.owner.lastName}
                  </p>
                  <p className="text-sm text-gray-600">Member since {new Date(item.owner.createdAt).getFullYear()}</p>
                </div>
              </div>
              {item.owner.address?.city && (
                <div className="flex items-center mt-3 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {item.owner.address.city}, {item.owner.address.state}
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
              <div className="space-y-3">
                {item.brand && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand</span>
                    <span className="font-medium">{item.brand}</span>
                  </div>
                )}
                {item.materials && item.materials.length > 0 && (
                  <div>
                    <span className="text-gray-600">Materials</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {item.materials.map((material, index) => (
                        <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {item.careInstructions && (
                  <div>
                    <span className="text-gray-600">Care Instructions</span>
                    <p className="mt-1 text-sm">{item.careInstructions}</p>
                  </div>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div>
                    <span className="text-gray-600">Tags</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="bg-green-100 px-2 py-1 rounded text-sm text-green-800">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-medium">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sustainability Score</span>
                  <div className="flex items-center">
                    <span className="font-medium">{item.sustainabilityScore}/10</span>
                    <div className="ml-2 flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full mx-0.5 ${
                            i < Math.floor(item.sustainabilityScore / 2)
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Modal */}
        {showSwapModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Swap</h3>
              <p className="text-gray-600 mb-4">
                Select one of your items to offer for this swap:
              </p>
              
              {userItems.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                  {userItems.map(userItem => (
                    <div key={userItem._id} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <img
                          src={userItem.images[0] || '/placeholder-item.jpg'}
                          alt={userItem.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{userItem.title}</p>
                          <p className="text-xs text-gray-500">{userItem.category} • {userItem.size}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 mb-4">
                  <p className="text-gray-600 mb-4">You don't have any items available for swap.</p>
                  <Link to="/dashboard" className="btn-primary">
                    Add an Item
                  </Link>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optional)
                </label>
                <textarea
                  value={swapMessage}
                  onChange={(e) => setSwapMessage(e.target.value)}
                  placeholder="Add a message to the owner..."
                  className="input-field"
                  rows="3"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSwapModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle swap request submission
                    setShowSwapModal(false);
                  }}
                  className="flex-1 btn-primary"
                  disabled={userItems.length === 0}
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;
