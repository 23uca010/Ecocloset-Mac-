import React, { useState } from 'react';
import { 
  Search, Filter, Trash2, ShieldAlert, 
  UserX, CheckCircle2, MoreVertical, 
  ExternalLink, Mail, Calendar, MapPin
} from 'lucide-react';

const UserManagement = ({ users, onUpdateStatus, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Active</span>;
      case 'suspended':
        return <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Suspended</span>;
      case 'banned':
        return <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Banned</span>;
      default:
        return <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-500">
      {/* Table Header Controls */}
      <div className="p-6 lg:p-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50/30">
        <div>
          <h3 className="text-xl font-bold text-gray-900">User Directory</h3>
          <p className="text-sm text-gray-500 font-medium">Manage and moderate platform enthusiasts</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
            <Filter size={16} className="text-gray-400" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm font-bold bg-transparent outline-none cursor-pointer text-gray-700"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/30">
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">User Profile</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Details</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Activity</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-indigo-50/20 transition-colors group">
                <td className="px-6 py-8">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                      {user.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{user.name}</p>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <Mail size={12} /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-8">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <MapPin size={12} className="text-gray-400" /> {user.location || 'Remote'}
                    </p>
                    <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                      <Calendar size={12} /> Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-8 text-center uppercase">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-gray-900">{user.listingsCount || 0} Listings</span>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ width: `${Math.min((user.listingsCount || 0) * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-8 text-right">
                  <div className="flex justify-end items-center gap-2">
                    {user.status === 'active' ? (
                       <button 
                        onClick={() => onUpdateStatus(user.id, 'suspended')}
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="Suspend User"
                      >
                        <ShieldAlert size={18} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => onUpdateStatus(user.id, 'active')}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Reactivate User"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                    
                    <button 
                      onClick={() => onUpdateStatus(user.id, 'banned')}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Ban User"
                    >
                      <UserX size={18} />
                    </button>
                    
                    <div className="h-6 w-px bg-gray-100 mx-1"></div>
                    
                    <button 
                      onClick={() => onDeleteUser(user.id)}
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                      title="Delete Permanently"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="p-20 text-center">
            <div className="h-20 w-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Search size={40} />
            </div>
            <h4 className="text-lg font-bold text-gray-900">No users found</h4>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      
      {/* Pagination Footer */}
      <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center font-bold text-xs text-gray-400 uppercase tracking-widest">
        <span>Showing {filteredUsers.length} of {users.length} Users</span>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50" disabled>Previous</button>
          <button className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 transition-all shadow-sm">Next</button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
