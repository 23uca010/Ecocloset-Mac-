import React from 'react';
import { 
  ShoppingCart, Package, Clock, 
  CheckCircle2, DollarSign, User,
  MoreVertical, Search
} from 'lucide-react';

const OrdersManagement = ({ orders = [] }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'processing': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Orders Management</h3>
          <p className="text-sm font-medium text-gray-500">Monitor all purchases and transaction status across the platform</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Buyer & Item</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                        <User size={12} className="text-gray-400" /> {order.buyer_name}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                        <Package size={10} /> {order.item_name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-emerald-600 font-black">
                      <DollarSign size={14} />
                      <span className="text-sm">{order.price}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="py-20 text-center">
              <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-200">
                <ShoppingCart size={32} />
              </div>
              <p className="text-gray-400 font-bold italic">No orders have been placed yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;
