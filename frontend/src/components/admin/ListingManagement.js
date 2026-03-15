import React, { useState } from 'react';
import { 
  Search, Filter, Trash2, CheckCircle, 
  XCircle, Eye, ShoppingBag, User, 
  Tag, Layers, Info, CheckSquare
} from 'lucide-react';

const ListingManagement = ({ items, onUpdateStatus, onDeleteItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.owner_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Active</span>;
      case 'pending':
        return <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Pending Approval</span>;
      case 'rejected':
        return <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Rejected</span>;
      default:
        return <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-dotted border-gray-200 flex items-center justify-between">
            <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Queue Size</p>
                <p className="text-3xl font-black text-amber-600">{items.filter(i => i.status === 'pending').length}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <CheckSquare size={24} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-dotted border-gray-200 flex items-center justify-between">
            <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Active</p>
                <p className="text-3xl font-black text-emerald-600">{items.filter(i => i.status === 'active').length}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShoppingBag size={24} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-dotted border-gray-200 flex items-center justify-between">
            <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Rejected Items</p>
                <p className="text-3xl font-black text-rose-600">{items.filter(i => i.status === 'rejected').length}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                <XCircle size={24} />
            </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-6 lg:p-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50/20">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by title or owner..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-3 bg-white border-2 border-transparent focus:border-indigo-500 rounded-2xl shadow-sm outline-none transition-all font-semibold text-gray-700"
                />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter size={18} className="text-indigo-600" />
                <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-full">
                    {['all', 'pending', 'active', 'rejected'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all
                                ${filterStatus === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}
                            `}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Listings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Specs</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50/10 transition-colors">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 min-w-[64px] rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shadow-sm">
                        {item.image ? (
                          <img 
                            src={`http://localhost:5000/${item.image}`} 
                            alt={item.title} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-300">
                            <ShoppingBag size={24} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mt-1">
                          <User size={12} /> {item.owner_name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
                        <Tag size={10} /> {item.category}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase">
                        Size: {item.size}
                      </span>
                       <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase">
                        {item.condition}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-black text-gray-900">
                    <div className="flex flex-col">
                        <span>₹{item.price}</span>
                        <span className="text-[10px] font-black uppercase text-indigo-400 tracking-tighter mt-1">{item.listingType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {item.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => onUpdateStatus(item.id, 'active')}
                            className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:scale-110 rounded-xl transition-all"
                            title="Approve Listing"
                          >
                            <CheckCircle size={20} />
                          </button>
                           <button 
                            onClick={() => onUpdateStatus(item.id, 'rejected')}
                            className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 hover:scale-110 rounded-xl transition-all"
                            title="Reject Listing"
                          >
                            <XCircle size={20} />
                          </button>
                        </>
                      )}
                      
                      {item.status !== 'pending' && (
                         <button 
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            title="View Details"
                        >
                            <Eye size={20} />
                        </button>
                      )}

                      <div className="h-6 w-[1px] bg-gray-100 mx-1 self-center"></div>

                      <button 
                        onClick={() => onDeleteItem(item.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Listing"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredItems.length === 0 && (
            <div className="p-24 text-center">
              <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-200">
                <ShoppingBag size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900">No matching listings</h4>
              <p className="text-gray-500 mt-2 font-medium">Try different filters or keywords</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingManagement;
