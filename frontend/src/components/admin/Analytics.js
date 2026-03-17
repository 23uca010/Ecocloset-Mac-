import React from 'react';
import { 
  PieChart, BarChart3, TrendingUp, 
  Users, ShoppingBag, Repeat, Heart
} from 'lucide-react';

const Analytics = ({ stats }) => {
  const analyticsData = stats?.analytics || [];
  const maxVal = Math.max(...analyticsData.map(d => Math.max(d.users, d.listings, d.swaps, d.donations, 1)));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Platform Analytics</h3>
          <p className="text-sm font-medium text-gray-500">Detailed growth trends and platform performance metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Growth Trends Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-600" />
              Monthly Growth
            </h4>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400">
                <span className="h-2 w-2 rounded-full bg-indigo-600"></span> Users
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Listings
              </span>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2">
            {analyticsData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                <div className="w-full flex items-end gap-0.5 h-full"> 
                  <div className="flex-1 bg-indigo-600 rounded-t-sm" style={{ height: `${(data.users / maxVal) * 100}%` }}></div>
                  <div className="flex-1 bg-emerald-400 rounded-t-sm" style={{ height: `${(data.listings / maxVal) * 100}%` }}></div>
                </div>
                <span className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Circular Economy Stats */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
              <Repeat size={16} className="text-amber-600" />
              Circular Impact
            </h4>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span> Swaps
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400">
                <span className="h-2 w-2 rounded-full bg-rose-400"></span> Donations
              </span>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2">
            {analyticsData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                <div className="w-full flex items-end gap-0.5 h-full"> 
                  <div className="flex-1 bg-amber-500 rounded-t-sm" style={{ height: `${(data.swaps / maxVal) * 100}%` }}></div>
                  <div className="flex-1 bg-rose-400 rounded-t-sm" style={{ height: `${(data.donations / maxVal) * 100}%` }}></div>
                </div>
                <span className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
          <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">User Retention</p>
          <p className="text-2xl font-black text-gray-900">84%</p>
        </div>
        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
          <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Active Ratio</p>
          <p className="text-2xl font-black text-gray-900">1:4</p>
        </div>
        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
          <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2">Swap Success</p>
          <p className="text-2xl font-black text-gray-900">92%</p>
        </div>
        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
          <p className="text-xs font-black text-rose-400 uppercase tracking-widest mb-2">Donation Yield</p>
          <p className="text-2xl font-black text-gray-900">1.2k</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
