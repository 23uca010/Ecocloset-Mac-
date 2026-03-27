import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Heart, ArrowLeft, MapPin, Sparkles, Star, Tag, MessageCircle, Send, ShoppingCart, ShoppingBag, X, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatItemPrice } from '../utils/formatters';

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
  const [selectedUserItem, setSelectedUserItem] = useState(null);
  const [isSubmittingSwap, setIsSubmittingSwap] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [swapError, setSwapError] = useState('');
  const [isSubmittingSell, setIsSubmittingSell] = useState(false);
  const [sellSuccess, setSellSuccess] = useState(false);
  const [sellError, setSellError] = useState('');

  useEffect(() => {
    fetchItemDetail();
    if (isAuthenticated) {
      fetchUserItems();
    }
  }, [id, isAuthenticated, user]);

  const fetchItemDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/items/${id}`);
      const data = response.data;
      
      if (response.status === 200 && data.success) {
        const itemData = data.data;
        // Map backend fields to frontend expected structure
        const mappedItem = {
          ...itemData,
          images: itemData.image ? [`http://localhost:5001/${itemData.image.replace(/\\/g, '/')}`] : [],
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
      const response = await api.get('/items/my-items');
      const items = response.data?.data || [];
      console.log('DEBUG: Fetched user items:', items);
      setUserItems(items);
    } catch (error) {
      console.error('Error fetching user items:', error);
      setUserItems([]);
    }
  };

  // Send a sell / purchase request (no item to offer)
  const handleSellRequest = async () => {
    setSellError('');
    setIsSubmittingSell(true);
    try {
      await api.post('/swaps', {
        itemRequestedId: Number(id),
        type: 'sell',
        message: `I'd like to purchase your item.`
      });
      setSellSuccess(true);
      setTimeout(() => setSellSuccess(false), 4000);
    } catch (error) {
      setSellError(
        error.response?.data?.message ||
        'Failed to send purchase request. Please try again.'
      );
    } finally {
      setIsSubmittingSell(false);
    }
  };

  const handleSwapRequest = async () => {
    // Inline validation — no alert()
    if (!selectedUserItem) {
      setSwapError('Please select one of your items to offer for this swap.');
      return;
    }

    setSwapError('');
    setIsSubmittingSwap(true);
    try {
      await api.post('/swaps', {
        itemOfferedId: Number(selectedUserItem.id),
        itemRequestedId: Number(id),
        message: swapMessage
      });

      // Reset and show success
      setShowSwapModal(false);
      setSelectedUserItem(null);
      setSwapMessage('');
      setSwapError('');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Swap request error:', error);
      setSwapError(
        error.response?.data?.message ||
        'Failed to send swap request. Please try again.'
      );
    } finally {
      setIsSubmittingSwap(false);
    }
  };

  const closeSwapModal = () => {
    setShowSwapModal(false);
    setSelectedUserItem(null);
    setSwapMessage('');
    setSwapError('');
  };

  const toggleLike = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      await api.post(`/items/${id}/like`);
      setIsLiked(!isLiked);
      setItem(prev => ({
        ...prev,
        likes: isLiked 
          ? prev.likes.filter(lk => lk.user !== user.id)
          : [...(prev.likes || []), { user: user.id, createdAt: new Date() }]
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
      const response = await api.delete(`/items/${id}`, {
        data: {
          user_id: user?.id,
          requester_id: user?.id,
          requester_role: user?.role || 'user',
        }
      });
      if (!response.data.success) throw new Error(response.data.message || 'Failed to delete item');
      setShowDeleteModal(false);
      navigate('/browse');
    } catch (err) {
      setDeleteError(err.response?.data?.message || err.message || 'Could not delete item. Please try again.');
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
                src={item?.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80'}
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
            {item?.images?.length > 1 && (
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
              {formatItemPrice(item)}
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

                {/* Sell success / error feedback */}
                {sellSuccess && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Purchase request sent! The owner will respond from their dashboard.
                  </div>
                )}
                {sellError && (
                  <div className="flex items-center justify-between gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      {sellError}
                    </div>
                    <button onClick={() => setSellError('')}><X className="h-4 w-4" /></button>
                  </div>
                )}

                {/* Purchase (sell) request — for items listed for sale */}
                {isAuthenticated && user && item.user_id !== user.id && (
                  (item.listingType === 'sell' || item.listingType === 'both' || item.type === 'sell') && (
                    <button
                      onClick={handleSellRequest}
                      disabled={isSubmittingSell || sellSuccess}
                      className="w-full bg-purple-600 text-white py-4 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 font-bold text-lg shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmittingSell ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                      ) : (
                        <ShoppingCart className="h-5 w-5" />
                      )}
                      <span>{isSubmittingSell ? 'Sending...' : sellSuccess ? 'Request Sent!' : 'Request to Purchase'}</span>
                    </button>
                  )
                )}

                {/* Swap request */}
                {isAuthenticated && user && item.user_id !== user.id && item.status === 'available' &&
                  (item.listingType === 'swap' || item.listingType === 'both' || item.listingType === 'swap_only') && (
                  <button
                    onClick={() => setShowSwapModal(true)}
                    className="w-full bg-white text-gray-900 border-2 border-gray-200 py-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 font-bold text-lg"
                  >
                    <Tag className="h-5 w-5" />
                    <span>Request Swap</span>
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
              {/* Close button */}
              <button
                onClick={closeSwapModal}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                aria-label="Close swap modal"
              >
                <X className="h-6 w-6" />
              </button>

              <h3 className="text-2xl font-extrabold text-gray-900 mb-1">Request Swap</h3>
              <p className="text-gray-500 font-medium mb-6">Select one of your items to offer in exchange.</p>

              {/* Inline API / validation error banner */}
              {swapError && (
                <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl px-4 py-3">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{swapError}</span>
                </div>
              )}

              {/* User items list */}
              {userItems.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto mb-6 pr-1">
                  {userItems.map(userItem => {
                    const isSelected = selectedUserItem?.id === userItem.id;
                    const imgSrc = userItem.image
                      ? (userItem.image.startsWith('http')
                          ? userItem.image
                          : `http://localhost:5001/${userItem.image.replace(/\\/g, '/')}`)
                      : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=150&q=80';

                    return (
                      <div
                        key={userItem.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => { setSelectedUserItem(userItem); setSwapError(''); }}
                        onKeyDown={e => e.key === 'Enter' && setSelectedUserItem(userItem)}
                        className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-center select-none ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                            : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="h-16 w-16 rounded-xl bg-gray-100 mr-4 overflow-hidden border border-gray-100 shrink-0">
                          <img
                            src={imgSrc}
                            alt={userItem.title}
                            className="w-full h-full object-cover"
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=150&q=80'; }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-start gap-2">
                            <p className="font-bold text-gray-900 truncate">{userItem.title}</p>
                            <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-bold uppercase shrink-0">
                              {userItem.listingType || 'item'}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">
                            {userItem.category}{userItem.size ? ` • ${userItem.size}` : ''}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="ml-3 text-indigo-600 shrink-0">
                            <CheckCircle2 size={22} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Tag className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium mb-4 px-6">You don't have any items listed yet.</p>
                  <Link
                    to="/sell-swap"
                    className="bg-[#108c4b] text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors inline-block"
                    onClick={closeSwapModal}
                  >
                    Add an Item
                  </Link>
                </div>
              )}

              {/* Optional message */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Message to Seller <span className="normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  value={swapMessage}
                  onChange={e => setSwapMessage(e.target.value)}
                  placeholder="Hi, I'd love to swap my item for yours!"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:bg-white transition-all resize-none"
                  rows={3}
                />
              </div>

              {/* Hint when no item selected */}
              {!selectedUserItem && userItems.length > 0 && !swapError && (
                <p className="text-center text-xs text-gray-400 font-medium mb-3">
                  ↑ Select an item above to enable the button
                </p>
              )}

              {/* Submit button */}
              <button
                type="button"
                onClick={handleSwapRequest}
                disabled={isSubmittingSwap || userItems.length === 0}
                className="w-full bg-indigo-600 text-white py-4 rounded-[1.25rem] font-black text-lg transition-all shadow-xl shadow-indigo-100
                  hover:bg-indigo-700 active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isSubmittingSwap ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending Request...
                  </span>
                ) : !selectedUserItem ? (
                  'Select an Item First'
                ) : (
                  'Send Swap Request'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div className="bg-white rounded-[2rem] max-w-sm w-full p-8 shadow-2xl text-center transform transition-all animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 mb-8 font-medium">Your swap request has been sent to the seller.</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-[#108c4b] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-100"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ItemDetail;
