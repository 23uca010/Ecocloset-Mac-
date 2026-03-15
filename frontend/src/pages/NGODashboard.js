import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Gift, Users, Calendar, MapPin, TrendingUp, Package, Heart, Settings } from 'lucide-react';

const NGODashboard = () => {
  const { api, user } = useAuth();
  const [stats, setStats] = useState({
    totalDonations: 0,
    pendingDonations: 0,
    acceptedDonations: 0,
    completedDonations: 0,
    scheduledPickups: 0,
    itemsReceived: 0,
    totalImpact: { total: 0, beneficiaries: 0 }
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [donations, setDonations] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [upcomingPickups, setUpcomingPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNGOData = useCallback(async () => {
    try {
      setLoading(true);
      
      switch (activeTab) {
        case 'overview':
          const dashboardResponse = await api.get('/ngo/dashboard');
          setStats(dashboardResponse.data.data.overview);
          break;
        case 'donations':
          const donationsResponse = await api.get('/ngo/donations');
          setDonations(donationsResponse.data.data.donations);
          break;
        case 'items':
          const itemsResponse = await api.get('/ngo/items/available');
          setAvailableItems(itemsResponse.data.data.items);
          break;
        case 'pickups':
          const pickupsResponse = await api.get('/ngo/pickups');
          setUpcomingPickups(pickupsResponse.data.data.pickups);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching NGO data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, api]);

  useEffect(() => {
    fetchNGOData();
  }, [activeTab, fetchNGOData]);

  const respondToDonation = async (donationId, status) => {
    try {
      await api.put(`/donations/${donationId}/respond`, { status });
      fetchNGOData();
    } catch (error) {
      console.error('Error responding to donation:', error);
    }
  };

  const schedulePickup = async (donationId) => {
    try {
      await api.put(`/donations/${donationId}/schedule`, {
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        scheduledTime: '10:00 AM',
        location: 'NGO Office'
      });
      fetchNGOData();
    } catch (error) {
      console.error('Error scheduling pickup:', error);
    }
  };

  const completeDonation = async (donationId) => {
    try {
      await api.put(`/donations/${donationId}/complete`, {
        impact: {
          category: 'clothing',
          beneficiaries: Math.floor(Math.random() * 10) + 1,
          story: 'These clothes helped families in need'
        }
      });
      fetchNGOData();
    } catch (error) {
      console.error('Error completing donation:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'donations', label: 'Donations', icon: <Gift className="h-4 w-4" /> },
    { id: 'items', label: 'Available Items', icon: <Package className="h-4 w-4" /> },
    { id: 'pickups', label: 'Pickups', icon: <Calendar className="h-4 w-4" /> },
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <Gift className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingDonations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Items Received</p>
              <p className="text-2xl font-bold text-gray-900">{stats.itemsReceived}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">People Helped</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalImpact.beneficiaries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Donations</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* This would show recent donations - for now showing placeholder */}
              <p className="text-gray-500">No recent donation activity</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Pickups</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* This would show upcoming pickups - for now showing placeholder */}
              <p className="text-gray-500">No upcoming pickups scheduled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.totalImpact.total || 0}
            </div>
            <div className="text-sm text-gray-600">Total Value (₹)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalImpact.beneficiaries || 0}
            </div>
            <div className="text-sm text-gray-600">People Helped</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.completedDonations}
            </div>
            <div className="text-sm text-gray-600">Completed Donations</div>
          </div>
        </div>
      </div>
    </div>
  );

  const DonationsTab = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Donation Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {donation.donor?.firstName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {donation.donor?.firstName} {donation.donor?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{donation.donor?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={donation.item?.images?.[0] || '/placeholder-item.jpg'}
                      alt={donation.item?.title}
                      className="w-10 h-10 object-cover rounded mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{donation.item?.title}</div>
                      <div className="text-sm text-gray-500">{donation.item?.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {donation.donationType.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    donation.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : donation.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : donation.status === 'scheduled_pickup'
                      ? 'bg-blue-100 text-blue-800'
                      : donation.status === 'picked_up'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {donation.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(donation.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {donation.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => respondToDonation(donation._id, 'accepted')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => respondToDonation(donation._id, 'cancelled')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                  {donation.status === 'accepted' && (
                    <button
                      onClick={() => schedulePickup(donation._id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Schedule
                    </button>
                  )}
                  {donation.status === 'scheduled_pickup' && (
                    <button
                      onClick={() => completeDonation(donation._id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ItemsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {availableItems.map((item) => (
        <div key={item._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="relative">
            <img
              src={item.images[0] || '/placeholder-item.jpg'}
              alt={item.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              Available
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <span className="capitalize">{item.category}</span>
              <span className="uppercase">{item.size}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                by {item.owner?.firstName} {item.owner?.lastName}
              </div>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                Request
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const PickupsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Scheduled Pickups</h3>
        </div>
        <div className="p-6">
          {upcomingPickups.length > 0 ? (
            <div className="space-y-4">
              {upcomingPickups.map((pickup) => (
                <div key={pickup._id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{pickup.item?.title}</h4>
                      <p className="text-sm text-gray-500">
                        From {pickup.donor?.firstName} {pickup.donor?.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {new Date(pickup.pickupDetails?.scheduledDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">{pickup.pickupDetails?.scheduledTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {pickup.pickupDetails?.address?.street}, {pickup.pickupDetails?.address?.city}
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="btn-primary">Complete Pickup</button>
                    <button className="btn-outline">Reschedule</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No pickups scheduled</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pickup Calendar</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Calendar view coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NGO Dashboard</h1>
          <p className="text-gray-600">Manage donations, pickups, and track your organization's impact.</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'donations' && <DonationsTab />}
            {activeTab === 'items' && <ItemsTab />}
            {activeTab === 'pickups' && <PickupsTab />}
          </div>
        )}
      </div>
    </div>
  );
};

export default NGODashboard;
