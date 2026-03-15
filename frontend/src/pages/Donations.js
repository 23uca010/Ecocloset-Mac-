import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Gift, Calendar, MapPin, Check, Clock, X, Search, Filter } from 'lucide-react';

const Donations = () => {
  const { api, user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showNewDonationModal, setShowNewDonationModal] = useState(false);
  const [userItems, setUserItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [donationType, setDonationType] = useState('pickup');
  const [donationDetails, setDonationDetails] = useState({
    pickupAddress: '',
    contactPerson: '',
    contactPhone: '',
    specialInstructions: '',
    estimatedValue: '',
    taxReceipt: false
  });

  useEffect(() => {
    fetchDonations();
    if (user?.role === 'ngo') {
      fetchNGOs();
    }
  }, [filter]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const type = user?.role === 'ngo' ? 'received' : 'donated';
      const response = await api.get(`/donations?type=${type}`);
      setDonations(response.data.data.donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNGOs = async () => {
    try {
      // This would fetch NGOs from the API
      // For now, we'll use a mock array
      setNgos([
        { _id: '1', username: 'goodwill', firstName: 'Goodwill', lastName: 'Foundation' },
        { _id: '2', username: 'salvation', firstName: 'Salvation', lastName: 'Army' },
        { _id: '3', username: 'redcross', firstName: 'Red', lastName: 'Cross' },
      ]);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
    }
  };

  const fetchUserItems = async () => {
    try {
      const response = await api.get('/items/user/my-items?status=available');
      setUserItems(response.data.data.items.filter(item => 
        item.type === 'donation' || item.type === 'both'
      ));
    } catch (error) {
      console.error('Error fetching user items:', error);
    }
  };

  const createDonation = async () => {
    if (!selectedItem || !selectedNGO) return;

    try {
      await api.post('/donations', {
        item: selectedItem._id,
        ngo: selectedNGO._id,
        donationType,
        pickupDetails: donationType === 'pickup' ? {
          address: donationDetails.pickupAddress,
          contactPerson: donationDetails.contactPerson,
          phone: donationDetails.contactPhone,
          specialInstructions: donationDetails.specialInstructions
        } : undefined,
        estimatedValue: parseFloat(donationDetails.estimatedValue) || 0,
        taxReceipt: { requested: donationDetails.taxReceipt }
      });

      setShowNewDonationModal(false);
      setSelectedItem(null);
      setSelectedNGO(null);
      setDonationDetails({
        pickupAddress: '',
        contactPerson: '',
        contactPhone: '',
        specialInstructions: '',
        estimatedValue: '',
        taxReceipt: false
      });
      fetchDonations();
    } catch (error) {
      console.error('Error creating donation:', error);
    }
  };

  const respondToDonation = async (donationId, status) => {
    try {
      await api.put(`/donations/${donationId}/respond`, { status });
      fetchDonations();
    } catch (error) {
      console.error('Error responding to donation:', error);
    }
  };

  const scheduleDonation = async (donationId) => {
    try {
      await api.put(`/donations/${donationId}/schedule`, {
        scheduledDate: new Date(),
        scheduledTime: '10:00 AM',
        location: 'NGO Office'
      });
      fetchDonations();
    } catch (error) {
      console.error('Error scheduling donation:', error);
    }
  };

  const completeDonation = async (donationId) => {
    try {
      await api.put(`/donations/${donationId}/complete`, {
        impact: {
          category: 'clothing',
          beneficiaries: 5,
          story: 'These clothes helped families in need'
        }
      });
      fetchDonations();
    } catch (error) {
      console.error('Error completing donation:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'scheduled_pickup':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-indigo-100 text-indigo-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const DonationCard = ({ donation }) => {
    const isDonor = donation.donor._id === user._id;
    const isNGO = donation.ngo._id === user._id;
    const canRespond = isNGO && donation.status === 'pending';
    const canSchedule = isNGO && donation.status === 'accepted';
    const canComplete = isNGO && (donation.status === 'scheduled_pickup' || donation.status === 'accepted');

    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${getStatusColor(donation.status)}`}>
                <Gift className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isDonor ? 'Your Donation' : 'Donation from ' + donation.donor.firstName}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(donation.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(donation.status)}`}>
              {donation.status.replace('_', ' ')}
            </span>
          </div>

          {/* Item */}
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={donation.item.images[0] || '/placeholder-item.jpg'}
              alt={donation.item.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <p className="font-medium text-gray-900">{donation.item.title}</p>
              <p className="text-sm text-gray-500">{donation.item.category} • {donation.item.condition}</p>
            </div>
          </div>

          {/* NGO/Donor Info */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {(isDonor ? donation.ngo : donation.donor).firstName?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {isDonor ? donation.ngo.firstName : donation.donor.firstName} {isDonor ? donation.ngo.lastName : donation.donor.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {isDonor ? 'NGO Organization' : 'Donor'}
                </p>
              </div>
            </div>
          </div>

          {/* Donation Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Gift className="h-4 w-4 mr-2" />
              Type: <span className="font-medium ml-1 capitalize">{donation.donationType.replace('_', ' ')}</span>
            </div>
            {donation.estimatedValue > 0 && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">Estimated Value: ${donation.estimatedValue}</span>
              </div>
            )}
            {donation.taxReceipt?.requested && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">Tax Receipt Requested</span>
              </div>
            )}
          </div>

          {/* Pickup/Dropoff Details */}
          {donation.pickupDetails && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Pickup Details</span>
              </div>
              {donation.pickupDetails.scheduledDate && (
                <p className="text-sm text-blue-800">
                  Scheduled: {new Date(donation.pickupDetails.scheduledDate).toLocaleDateString()}
                </p>
              )}
              {donation.pickupDetails.address && (
                <p className="text-sm text-blue-800">
                  Address: {donation.pickupDetails.address.street}, {donation.pickupDetails.address.city}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            {canRespond && (
              <>
                <button
                  onClick={() => respondToDonation(donation._id, 'accepted')}
                  className="flex-1 btn-primary"
                >
                  Accept
                </button>
                <button
                  onClick={() => respondToDonation(donation._id, 'cancelled')}
                  className="flex-1 btn-secondary"
                >
                  Decline
                </button>
              </>
            )}
            
            {canSchedule && (
              <button
                onClick={() => scheduleDonation(donation._id)}
                className="flex-1 btn-primary"
              >
                Schedule Pickup
              </button>
            )}
            
            {canComplete && (
              <button
                onClick={() => completeDonation(donation._id)}
                className="flex-1 btn-primary"
              >
                Mark as Completed
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user?.role === 'ngo' ? 'Donation Management' : 'My Donations'}
            </h1>
            <p className="text-gray-600">
              {user?.role === 'ngo' 
                ? 'Manage donation requests and track pickups.'
                : 'Track your clothing donations and their impact.'
              }
            </p>
          </div>
          {user?.role !== 'ngo' && (
            <button
              onClick={() => {
                fetchUserItems();
                setShowNewDonationModal(true);
              }}
              className="btn-primary"
            >
              <Gift className="h-4 w-4 mr-2" />
              New Donation
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-4">
            {['all', 'pending', 'accepted', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : donations.length > 0 ? (
          <div className="space-y-6">
            {donations.map(donation => (
              <DonationCard key={donation._id} donation={donation} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Gift className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
            <p className="text-gray-600 mb-4">
              {user?.role === 'ngo'
                ? "No donation requests received yet."
                : "You haven't made any donations yet."
              }
            </p>
            {user?.role !== 'ngo' && (
              <button
                onClick={() => {
                  fetchUserItems();
                  setShowNewDonationModal(true);
                }}
                className="btn-primary"
              >
                Make Your First Donation
              </button>
            )}
          </div>
        )}

        {/* New Donation Modal */}
        {showNewDonationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Donation</h3>
              
              {/* Select Item */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Item to Donate</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                  {userItems.map(item => (
                    <div
                      key={item._id}
                      onClick={() => setSelectedItem(item)}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedItem?._id === item._id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.images[0] || '/placeholder-item.jpg'}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.category} • {item.size}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Select NGO */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select NGO</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ngos.map(ngo => (
                    <div
                      key={ngo._id}
                      onClick={() => setSelectedNGO(ngo)}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedNGO?._id === ngo._id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <p className="font-medium">{ngo.firstName} {ngo.lastName}</p>
                      <p className="text-sm text-gray-500">@{ngo.username}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donation Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Donation Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="pickup"
                      checked={donationType === 'pickup'}
                      onChange={(e) => setDonationType(e.target.value)}
                      className="mr-2"
                    />
                    Pickup Request
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="dropoff"
                      checked={donationType === 'dropoff'}
                      onChange={(e) => setDonationType(e.target.value)}
                      className="mr-2"
                    />
                    Dropoff
                  </label>
                </div>
              </div>

              {/* Donation Details */}
              {donationType === 'pickup' && (
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address</label>
                    <textarea
                      value={donationDetails.pickupAddress}
                      onChange={(e) => setDonationDetails(prev => ({ ...prev, pickupAddress: e.target.value }))}
                      placeholder="Enter pickup address"
                      className="input-field"
                      rows="2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                      <input
                        type="text"
                        value={donationDetails.contactPerson}
                        onChange={(e) => setDonationDetails(prev => ({ ...prev, contactPerson: e.target.value }))}
                        placeholder="Contact person name"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                      <input
                        type="tel"
                        value={donationDetails.contactPhone}
                        onChange={(e) => setDonationDetails(prev => ({ ...prev, contactPhone: e.target.value }))}
                        placeholder="Phone number"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                    <textarea
                      value={donationDetails.specialInstructions}
                      onChange={(e) => setDonationDetails(prev => ({ ...prev, specialInstructions: e.target.value }))}
                      placeholder="Any special instructions for pickup"
                      className="input-field"
                      rows="2"
                    />
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Value (Optional)</label>
                  <input
                    type="number"
                    value={donationDetails.estimatedValue}
                    onChange={(e) => setDonationDetails(prev => ({ ...prev, estimatedValue: e.target.value }))}
                    placeholder="0.00"
                    className="input-field"
                  />
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={donationDetails.taxReceipt}
                    onChange={(e) => setDonationDetails(prev => ({ ...prev, taxReceipt: e.target.checked }))}
                    className="mr-2"
                  />
                  Request tax receipt
                </label>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowNewDonationModal(false);
                    setSelectedItem(null);
                    setSelectedNGO(null);
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={createDonation}
                  disabled={!selectedItem || !selectedNGO}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  Create Donation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donations;
