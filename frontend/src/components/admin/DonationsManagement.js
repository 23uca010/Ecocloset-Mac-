import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Heart, Search, Filter, CheckCircle, XCircle, Clock, Package,
  Truck, ChevronDown, RefreshCw, Eye, AlertTriangle, Trash2, X
} from 'lucide-react';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'bg-amber-100 text-amber-800 border-amber-200' },
  approved:  { label: 'Approved',  color: 'bg-blue-100 text-blue-800 border-blue-200' },
  collected: { label: 'Collected', color: 'bg-green-100 text-green-700 border-green-200' },
  rejected:  { label: 'Rejected',  color: 'bg-red-100 text-red-700 border-red-200' },
};

const DonationsManagement = () => {
  const { api } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');

  const fetchDonations = async () => {
    setLoading(true);
    setError('');
    try {
      const query = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const res = await api.get(`/admin/donations${query}`);
      setDonations(res.data.data.donations || []);
    } catch (e) {
      setError('Failed to load donations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, [statusFilter]);

  const updateStatus = async (id, status) => {
    setActionLoading(id + status);
    try {
      await api.patch(`/admin/donations/${id}`, { status });
      setDonations(prev => prev.map(d => d.id === id ? { ...d, status } : d));
      if (selectedDonation?.id === id) setSelectedDonation(prev => ({ ...prev, status }));
    } catch (e) {
      alert('Failed to update status.');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteDonation = async (id) => {
    if (!window.confirm('Delete this donation record?')) return;
    setActionLoading('del' + id);
    try {
      await api.delete(`/admin/donations/${id}`);
      setDonations(prev => prev.filter(d => d.id !== id));
      if (selectedDonation?.id === id) setSelectedDonation(null);
    } catch (e) {
      alert('Failed to delete donation.');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = donations.filter(d =>
    !searchTerm || 
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.ngoName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const counts = {
    all: donations.length,
    pending: donations.filter(d => d.status === 'pending').length,
    approved: donations.filter(d => d.status === 'approved').length,
    collected: donations.filter(d => d.status === 'collected').length,
    rejected: donations.filter(d => d.status === 'rejected').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
            <Heart className="h-5 w-5 text-rose-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Donations Management</h2>
            <p className="text-sm text-gray-500">{donations.length} total donation requests</p>
          </div>
        </div>
        <button onClick={fetchDonations} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {Object.entries(counts).map(([key, count]) => (
          <button key={key} onClick={() => setStatusFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              statusFilter === key ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Search by name, email or NGO..."
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-sm" />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No donations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Donor', 'NGO', 'Type', 'Phone', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(donation => {
                  const sc = STATUS_CONFIG[donation.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={donation.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">{donation.name}</p>
                        <p className="text-xs text-gray-400">{donation.email}</p>
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-700">{donation.ngoName}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          donation.donationType === 'clothing' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {donation.donationType === 'clothing' ? 'Clothing' : 'Monetary'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{donation.phoneNumber}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${sc.color}`}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(donation.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelectedDonation(donation)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Details">
                            <Eye className="h-4 w-4" />
                          </button>
                          {donation.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(donation.id, 'approved')} disabled={!!actionLoading}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Approve">
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button onClick={() => updateStatus(donation.id, 'rejected')} disabled={!!actionLoading}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {donation.status === 'approved' && (
                            <button onClick={() => updateStatus(donation.id, 'collected')} disabled={!!actionLoading}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Mark Collected">
                              <Truck className="h-4 w-4" />
                            </button>
                          )}
                          <button onClick={() => deleteDonation(donation.id)} disabled={!!actionLoading}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Donation Details #{selectedDonation.id}</h3>
              <button onClick={() => setSelectedDonation(null)} className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Donor Name', val: selectedDonation.name },
                  { label: 'Email', val: selectedDonation.email },
                  { label: 'Phone', val: selectedDonation.phoneNumber },
                  { label: 'NGO', val: selectedDonation.ngoName },
                  { label: 'Type', val: selectedDonation.donationType === 'clothing' ? 'Clothing Donation' : 'Monetary Donation' },
                  { label: 'Status', val: STATUS_CONFIG[selectedDonation.status]?.label || selectedDonation.status },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-sm text-gray-900 font-medium">{val || '—'}</p>
                  </div>
                ))}
              </div>
              {selectedDonation.clothesDescription && (
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Clothes Description</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{selectedDonation.clothesDescription}</p>
                </div>
              )}
              {selectedDonation.message && (
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Message</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{selectedDonation.message}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Submitted</p>
                <p className="text-sm text-gray-700">{new Date(selectedDonation.createdAt).toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex gap-3 flex-wrap">
              {selectedDonation.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus(selectedDonation.id, 'approved')} disabled={!!actionLoading}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                    <CheckCircle className="h-4 w-4" /> Approve
                  </button>
                  <button onClick={() => updateStatus(selectedDonation.id, 'rejected')} disabled={!!actionLoading}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </>
              )}
              {selectedDonation.status === 'approved' && (
                <button onClick={() => updateStatus(selectedDonation.id, 'collected')} disabled={!!actionLoading}
                  className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                  <Truck className="h-4 w-4" /> Mark as Collected
                </button>
              )}
              <button onClick={() => setSelectedDonation(null)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsManagement;
