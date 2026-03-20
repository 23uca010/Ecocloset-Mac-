import React from 'react';
import { 
  Repeat, Calendar, Clock, 
  CheckCircle2, XCircle, Trash2,
  User, Package, Image as ImageIcon
} from 'lucide-react';

const SwapRequestManagement = ({ swaps, onUpdateStatus, onDeleteSwap }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'accepted': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'declined': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'cancelled': return 'bg-gray-50 text-gray-500 border-gray-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Swap Requests</h3>
          <p className="text-sm font-medium text-gray-500">Oversee and manage item exchange requests across the platform</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Item</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Participants</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Request Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {swaps.map((swap) => (
                <tr key={swap.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-100 shadow-sm">
                        {swap.item_image ? (
                          <img 
                            src={swap.item_image.startsWith('http') ? swap.item_image : `http://localhost:5001/${swap.item_image}`} 
                            alt={swap.item_b_title} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <ImageIcon size={24} />
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-black text-gray-900 leading-none">{swap.item_b_title}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-indigo-50 text-indigo-500 uppercase tracking-tighter w-fit">
                          ID: #{swap.item_b_id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User size={12} className="text-indigo-400" />
                        <span className="text-xs font-bold text-gray-700">{swap.requester_name}</span>
                        <span className="text-[8px] font-black bg-indigo-50 text-indigo-500 px-1 rounded">REQ</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={12} className="text-emerald-400" />
                        <span className="text-xs font-bold text-gray-700">{swap.owner_name}</span>
                        <span className="text-[8px] font-black bg-emerald-50 text-emerald-500 px-1 rounded">OWN</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-700">{new Date(swap.created_at).toLocaleDateString()}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{new Date(swap.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(swap.status)}`}>
                      {swap.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-3">
                      {swap.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => onUpdateStatus(swap.id, 'accepted')}
                            className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all flex items-center gap-2"
                          >
                            <CheckCircle2 size={14} />
                            Accept
                          </button>
                          <button 
                            onClick={() => onUpdateStatus(swap.id, 'declined')}
                            className="px-4 py-2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-200 transition-all flex items-center gap-2"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => onDeleteSwap(swap.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {swaps.length === 0 && (
            <div className="py-20 text-center">
              <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-200">
                <Repeat size={32} />
              </div>
              <p className="text-gray-400 font-bold italic">No swap requests logged in the system</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapRequestManagement;
