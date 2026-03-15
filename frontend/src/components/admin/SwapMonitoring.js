import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, Trash2, 
  MapPin, Calendar, CheckSquare,
  Repeat, User, Package, AlertCircle,
  HelpCircle
} from 'lucide-react';

const SwapMonitoring = ({ swaps, onResolveSwap, onCancelSwap }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'cancelled':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'resolved':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-indigo-900 p-8 rounded-[2rem] text-white overflow-hidden relative shadow-2xl shadow-indigo-200">
            <div className="relative z-10 lg:flex items-center justify-between">
                <div>
                    <h3 className="text-3xl font-black mb-2">Swap Transactions</h3>
                    <p className="text-indigo-200 font-medium">Monitoring the circular fashion economy flow</p>
                </div>
                <div className="mt-6 lg:mt-0 flex gap-4">
                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Live Swaps</p>
                        <p className="text-2xl font-black">{swaps.filter(s => s.status === 'pending').length}</p>
                    </div>
                </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 h-64 w-64 bg-indigo-500/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="grid grid-cols-1 gap-6">
            {swaps.map((swap) => (
                <div key={swap.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8 hover:shadow-md transition-all">
                    <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
                        {/* Participants Section */}
                        <div className="flex items-center gap-6 flex-1 w-full justify-center lg:justify-start">
                            <div className="text-center group">
                                <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl mb-2 group-hover:scale-110 transition-transform cursor-pointer shadow-sm">
                                    {swap.user_a_name?.[0]}
                                </div>
                                <p className="text-xs font-black text-gray-900 uppercase truncate max-w-[80px]">{swap.user_a_name}</p>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                    <Repeat size={20} className="animate-pulse" />
                                </div>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">vs</span>
                            </div>

                            <div className="text-center group">
                                <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-xl mb-2 group-hover:scale-110 transition-transform cursor-pointer shadow-sm">
                                    {swap.user_b_name?.[0]}
                                </div>
                                <p className="text-xs font-black text-gray-900 uppercase truncate max-w-[80px]">{swap.user_b_name}</p>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="flex-1 w-full lg:max-w-md bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Package size={16} className="text-indigo-400" />
                                        <span className="text-sm font-bold text-gray-700">{swap.item_a_title}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-indigo-500 uppercase">From A</span>
                                </div>
                                <div className="h-[1px] w-full bg-dashed bg-gray-200"></div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Package size={16} className="text-emerald-400" />
                                        <span className="text-sm font-bold text-gray-700">{swap.item_b_title}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-500 uppercase">From B</span>
                                </div>
                            </div>
                        </div>

                        {/* Metadata & Actions */}
                        <div className="flex flex-col lg:items-end gap-4 w-full lg:w-auto">
                            <div className={`px-4 py-2 rounded-2xl border font-black text-[10px] uppercase tracking-widest text-center ${getStatusStyle(swap.status)}`}>
                                {swap.status}
                            </div>
                            <div className="flex items-center gap-6 text-gray-400 font-bold text-xs uppercase tracking-tighter">
                                <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(swap.created_at).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1.5"><HelpCircle size={12} /> ID #{swap.id}</span>
                            </div>
                            <div className="flex gap-2 w-full lg:w-auto mt-2">
                                <button 
                                    onClick={() => onResolveSwap(swap.id)}
                                    className="flex-1 lg:flex-none px-6 py-2.5 bg-indigo-600 rounded-xl text-white text-xs font-black uppercase hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                >
                                    Resolve
                                </button>
                                <button 
                                    onClick={() => onCancelSwap(swap.id)}
                                    className="flex-1 lg:flex-none px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-rose-600 text-xs font-black uppercase hover:bg-rose-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {swaps.length === 0 && (
                <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
                    <p className="text-gray-400 font-bold italic">No swap transactions currently being monitored</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default SwapMonitoring;
