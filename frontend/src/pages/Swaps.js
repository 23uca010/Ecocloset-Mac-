import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Calendar, MapPin, MessageCircle, Check, X, Clock, User } from 'lucide-react';

const Swaps = () => {
  const { api, user } = useAuth();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    fetchSwaps();
  }, [filter]);

  const fetchSwaps = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/swaps?type=${filter}`);
      setSwaps(response.data.data.swapRequests);
    } catch (error) {
      console.error('Error fetching swaps:', error);
    } finally {
      setLoading(false);
    }
  };

  const respondToSwap = async (swapId, status) => {
    try {
      await api.put(`/swaps/${swapId}/respond`, {
        status,
        responseMessage
      });
      fetchSwaps();
      setSelectedSwap(null);
      setResponseMessage('');
    } catch (error) {
      console.error('Error responding to swap:', error);
    }
  };

  const completeSwap = async (swapId) => {
    try {
      await api.put(`/swaps/${swapId}/complete`);
      fetchSwaps();
    } catch (error) {
      console.error('Error completing swap:', error);
    }
  };

  const cancelSwap = async (swapId) => {
    try {
      await api.put(`/swaps/${swapId}/cancel`);
      fetchSwaps();
    } catch (error) {
      console.error('Error cancelling swap:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <Check className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      case 'completed':
        return <Check className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const SwapCard = ({ swap }) => {
    const isRequester = swap.requester._id === user._id;
    const canRespond = !isRequester && swap.status === 'pending';
    const canComplete = (isRequester || !isRequester) && swap.status === 'accepted';
    const canCancel = swap.status === 'pending' || swap.status === 'accepted';

    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${getStatusColor(swap.status)}`}>
                {getStatusIcon(swap.status)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isRequester ? 'Your Swap Request' : 'Swap Request from ' + swap.requester.firstName}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(swap.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(swap.status)}`}>
              {swap.status.replace('_', ' ')}
            </span>
          </div>

          {/* Items */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">You're offering:</p>
              <div className="flex items-center space-x-3">
                <img
                  src={swap.itemOffered.images[0] || '/placeholder-item.jpg'}
                  alt={swap.itemOffered.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium text-gray-900">{swap.itemOffered.title}</p>
                  <p className="text-sm text-gray-500">{swap.itemOffered.category} • {swap.itemOffered.size}</p>
                </div>
              </div>
            </div>
            
            <ArrowRight className="h-5 w-5 text-gray-400" />
            
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">You're requesting:</p>
              <div className="flex items-center space-x-3">
                <img
                  src={swap.itemRequested.images[0] || '/placeholder-item.jpg'}
                  alt={swap.itemRequested.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium text-gray-900">{swap.itemRequested.title}</p>
                  <p className="text-sm text-gray-500">{swap.itemRequested.category} • {swap.itemRequested.size}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          {swap.message && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <MessageCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                <p className="text-sm text-gray-700">{swap.message}</p>
              </div>
            </div>
          )}

          {/* Response Message */}
          {swap.responseMessage && (
            <div className="bg-green-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-800">
                <strong>Response:</strong> {swap.responseMessage}
              </p>
            </div>
          )}

          {/* Meeting Details */}
          {swap.confirmedMeeting && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Meeting Details</span>
              </div>
              <p className="text-sm text-blue-800">
                {new Date(swap.confirmedMeeting.date).toLocaleDateString()} at {swap.confirmedMeeting.location}
              </p>
              {swap.confirmedMeeting.notes && (
                <p className="text-sm text-blue-700 mt-1">{swap.confirmedMeeting.notes}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            {canRespond && (
              <>
                <button
                  onClick={() => setSelectedSwap(swap)}
                  className="flex-1 btn-primary"
                >
                  Accept & Schedule
                </button>
                <button
                  onClick={() => respondToSwap(swap._id, 'rejected')}
                  className="flex-1 btn-secondary"
                >
                  Decline
                </button>
              </>
            )}
            
            {canComplete && (
              <button
                onClick={() => completeSwap(swap._id)}
                className="flex-1 btn-primary"
              >
                Mark as Completed
              </button>
            )}
            
            {canCancel && (
              <button
                onClick={() => cancelSwap(swap._id)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Requests</h1>
          <p className="text-gray-600">Manage your clothing swap requests and track their progress.</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-4">
            {['all', 'sent', 'received'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === type
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All Requests' : type === 'sent' ? 'Sent by You' : 'Received by You'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : swaps.length > 0 ? (
          <div className="space-y-6">
            {swaps.map(swap => (
              <SwapCard key={swap._id} swap={swap} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ArrowRight className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No swap requests found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'sent' 
                ? "You haven't sent any swap requests yet."
                : filter === 'received'
                ? "You haven't received any swap requests yet."
                : "No swap requests found."
              }
            </p>
            <a href="/items" className="btn-primary">
              Browse Items to Swap
            </a>
          </div>
        )}

        {/* Response Modal */}
        {selectedSwap && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Accept Swap Request</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Swap with {selectedSwap.requester.firstName}:</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium">{selectedSwap.itemRequested.title}</p>
                  <p className="text-sm text-gray-500">for {selectedSwap.itemOffered.title}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Message (optional)
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Add a message for the requester..."
                  className="input-field"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Details (optional)
                </label>
                <input
                  type="date"
                  className="input-field mb-2"
                  placeholder="Meeting date"
                />
                <input
                  type="text"
                  className="input-field mb-2"
                  placeholder="Meeting location"
                />
                <textarea
                  className="input-field"
                  placeholder="Meeting notes (optional)"
                  rows="2"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedSwap(null);
                    setResponseMessage('');
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => respondToSwap(selectedSwap._id, 'accepted')}
                  className="flex-1 btn-primary"
                >
                  Accept Swap
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Swaps;
