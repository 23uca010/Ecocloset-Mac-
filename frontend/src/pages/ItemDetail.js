import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Heart, ArrowLeft, MapPin, Sparkles, Star, Tag, MessageCircle, Send, ShoppingCart, ShoppingBag, X, Trash2, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const ItemDetail = () => {
  const { id } = useParams();
  const { api, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
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
            firstName: itemData.owner_name || "User",
            lastName: "",
            createdAt: new Date().toISOString(),
            avatar: itemData.owner_avatar
          },
          status: 'available',
          likes: [],
          location: itemData.owner_location || 'Community',
          sustainabilityScore: itemData.sustainabilityScore || 8
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
      setShowSwapModal(true);
    } catch (error) {
      console.error('Error initiating swap:', error);
    }
  };

  const initiateDonation = async () => {
    try {
      const response = await api.post('/donations', {
        item: id,
        ngo: null, 
        donationType: 'pickup',
        estimatedValue: 0,
        taxReceipt: { requested: false }
      });
    } catch (error) {
      console.error('Error initiating donation:', error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      const response = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          requester_id: user?.id,
          requester_role: user?.role || 'user',
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete item');
      setShowDeleteModal(false);
      navigate('/browse');
    } catch (err) {
      setDeleteError(err.message || 'Could not delete item. Please try again.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h2>
          <p className="text-gray-600 mb-8">The item you're looking for doesn't exist or has been removed.</p>
          <Link to="/browse" className="bg-[#108c4b] text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition">
            Browse Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link to="/home" className="hover:text-green-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/browse" className="hover:text-green-600 transition-colors">Browse</Link>
          <span className="mx-2">/</span>
          <span className="capitalize">{item.category}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">{item.title}</span>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Column: Images */}
          <div className="lg:w-1/2 p-4 lg:p-8 bg-white border-r border-gray-100 flex flex-col">
            <div className="relative w-full aspect-[4/5] sm:aspect-square bg-gray-100 rounded-[1.5rem] overflow-hidden mb-4">
              <img
                src={item.images[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={toggleLike}
                disabled={!isAuthenticated}
                className={`absolute top-6 right-6 p-4 rounded-full shadow-md backdrop-blur-md ${
                  isLiked
                    ? 'bg-red-50 text-red-500'
                    : 'bg-white/80 text-gray-400 hover:text-red-500'
                } transition-colors disabled:opacity-50`}
              >
                <Heart className="h-6 w-6" fill={isLiked ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            {/* Image Thumbnails */}
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {item.images.map((image, index) => (
                  <button key={index} className="aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-transparent hover:border-green-500 transition-colors">
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="lg:w-1/2 p-6 lg:p-12 flex flex-col">
            
            <div className="mb-6 flex items-center gap-3">
              <span className={`px-4 py-2 text-sm font-bold xl:text-base rounded-lg ${
                  item.type === 'sell' ? 'bg-[#108c4b]/10 text-[#108c4b]' :
                  item.type === 'swap_only' ? 'bg-indigo-100 text-indigo-800' :
                  item.type === 'donation' ? 'bg-purple-100 text-purple-800' :
                  'bg-[#108c4b]/10 text-[#108c4b]'
                }`}>
                  {item.type === 'sell' ? 'For Sale' : item.type === 'swap_only' ? 'Swap Only' : item.type === 'donation' ? 'Donation' : 'Sale or Swap'}
              </span>
              <span className="flex items-center text-gray-500 text-sm xl:text-base">
                 <Heart className="w-4 h-4 mr-1"/> {item.likes?.length || 0} Likes
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{item.title}</h1>
            
            <div className="text-4xl font-extrabold text-[#108c4b] mb-6">
              {formatCurrency(item.price)}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm xl:text-base font-semibold">
                <Sparkles className="h-4 w-4 mr-2" />
                {item.condition}
              </div>
              <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm xl:text-base font-semibold">
                Size: {item.size}
              </div>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              {item.description || "Beautiful piece looking for a new home. In great condition and ready to wear!"}
            </p>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12">
              <div>
                 <p className="text-sm text-gray-500 mb-1">Category</p>
                 <p className="font-semibold text-gray-900 capitalize">{item.category}</p>
              </div>
              <div>
                 <p className="text-sm text-gray-500 mb-1">Brand</p>
                 <p className="font-semibold text-gray-900">{item.brand || 'Unbranded / Vintage'}</p>
              </div>
              <div>
                 <p className="text-sm text-gray-500 mb-1">Color</p>
                 <p className="font-semibold text-gray-900">{item.color || 'Not specified'}</p>
              </div>
              <div>
                 <p className="text-sm text-gray-500 mb-1">Material</p>
                 <p className="font-semibold text-gray-900">{item.materials?.join(', ') || 'Not specified'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 mb-10 mt-auto">
                <button
                  onClick={() => addToCart(item)}
                  className="w-full bg-[#108c4b] text-white py-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-bold text-lg shadow-sm"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                
                {isAuthenticated && user && item.user_id !== user.id && item.status === 'available' && (
                  <button
                    onClick={() => setShowSwapModal(true)}
                    className="w-full bg-white text-gray-900 border-2 border-gray-200 py-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 font-bold text-lg"
                  >
                    <Tag className="h-5 w-5" />
                    <span>Make an Offer / Request Swap</span>
                  </button>
                )}
            </div>

            {/* Seller Box */}
            <div className="bg-[#f8f9fa] border border-gray-200 rounded-2xl p-6">
               <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Listed By</h3>
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {item.owner.avatar ? (
                       <img src={item.owner.avatar} alt={item.owner.firstName} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-14 h-14 bg-[#108c4b] rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow-sm">
                        {item.owner.firstName?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{item.owner.firstName} {item.owner.lastName}</p>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1" /> {item.location}
                        <span className="mx-2">•</span>
                        <Star className="h-3.5 w-3.5 text-yellow-500 mr-1 fill-current" /> 4.8 
                      </div>
                    </div>
                  </div>
                  {isAuthenticated && user && item.user_id !== user.id && (
                     <Link
                       to={`/messages?user_id=${item.user_id}&item_id=${item._id}`}
                       className="hidden sm:flex bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-xl hover:bg-gray-50 transition-colors items-center space-x-2 font-bold text-sm shadow-sm"
                     >
                       <MessageCircle className="h-4 w-4" />
                       <span>Message</span>
                     </Link>
                  )}
               </div>
               {isAuthenticated && user && item.user_id !== user.id && (
                  <Link
                    to={`/messages?user_id=${item.user_id}&item_id=${item._id}`}
                    className="w-full sm:hidden mt-4 bg-white text-gray-700 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 font-bold text-sm shadow-sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Message Seller</span>
                  </Link>
               )}
            </div>

            {/* Owner / Admin Actions */}
            {isAuthenticated && user && (item.user_id === user.id || item.owner._id === user._id || user.role === 'admin') && (
              <div className={`mt-4 rounded-2xl p-5 border ${user.role === 'admin' && item.user_id !== user.id ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                <p className={`text-sm font-semibold mb-3 flex items-center gap-2 ${user.role === 'admin' && item.user_id !== user.id ? 'text-red-800' : 'text-amber-800'}`}>
                  <Tag className="h-4 w-4" />
                  {user.role === 'admin' && item.user_id !== user.id ? '⚑ Admin — Manage Listing' : 'This is your listing'}
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Listing
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Delete Listing?</h3>
                <p className="text-gray-500 text-sm">
                  This will permanently remove <strong className="text-gray-800">&ldquo;{item.title}&rdquo;</strong> from EcoCloset. This action cannot be undone.
                </p>
              </div>

              {deleteError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 flex items-center gap-2">
                  <X className="h-4 w-4 shrink-0" /> {deleteError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteError(''); }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Deleting...</>
                  ) : (
                    <><Trash2 className="h-4 w-4" /> Yes, Delete</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Swap Modal */}
         {showSwapModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl relative">
              <button onClick={() => setShowSwapModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900">
                 <X className="h-6 w-6"/>
              </button>
              
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Request Swap</h3>
              <p className="text-gray-600 mb-6">Select one of your items to offer for this swap.</p>
              
              {userItems.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto mb-6 pr-2">
                  {userItems.map(userItem => (
                    <div key={userItem._id} className="border border-gray-200 rounded-xl p-4 hover:border-green-500 cursor-pointer transition-colors flex items-center">
                        <img
                          src={userItem.images[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=150&q=80'}
                          alt={userItem.title}
                          className="w-16 h-16 object-cover rounded-lg mr-4 bg-gray-100"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{userItem.title}</p>
                          <p className="text-sm text-gray-500">{userItem.category} • {userItem.size}</p>
                        </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                     <Tag className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium mb-4">You don't have any items available for swap.</p>
                  <Link to="/sell-swap" className="bg-[#108c4b] text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors inline-block">
                    Add an Item
                  </Link>
                </div>
              )}

              <div className="mb-6">
                <label className="block font-bold text-gray-900 mb-2">
                  Message to Seller (optional)
                </label>
                <textarea
                  value={swapMessage}
                  onChange={(e) => setSwapMessage(e.target.value)}
                  placeholder="Hi, I'd love to swap..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  rows="3"
                />
              </div>

              <button
                onClick={() => {
                  setShowSwapModal(false);
                }}
                className="w-full bg-[#108c4b] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={userItems.length === 0}
              >
                Send Swap Request
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ItemDetail;
