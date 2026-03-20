import React from 'react';
import { 
  Users, ShoppingBag, Repeat, Heart,
  Clock, TrendingUp, AlertTriangle
} from 'lucide-react';

const AdminOverview = ({ stats }) => {
  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-black text-gray-900">{value}</h3>
      </div>
    </div>
  );

  // Simple SVG Chart component
  const ActivityChart = () => {
    const chartData = stats?.analytics || [];
    const maxVal = Math.max(...chartData.map(d => Math.max(d.listings, d.swaps, d.donations, d.users, 1)));

    return (
      <div className="h-64 w-full flex items-end justify-between gap-2 pt-4">
        {chartData.map((data, i) => {
          const h1 = (data.listings / maxVal) * 100;
          const h2 = (data.swaps / maxVal) * 100;
          const h3 = (data.donations / maxVal) * 100;
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
              <div className="w-full flex items-end gap-[1px] h-full"> 
                <div className="flex-1 bg-indigo-600 rounded-t-sm" style={{ height: `${h2}%` }}></div>
                <div className="flex-1 bg-indigo-200 rounded-t-sm" style={{ height: `${h1}%` }}></div>
                <div className="flex-1 bg-emerald-400 rounded-t-sm" style={{ height: `${h3}%` }}></div>
              </div>
              <span className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">
                {data.month}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.overview?.totalUsers || 0} 
          icon={<Users className="text-blue-600" size={24} />} 
          color="bg-blue-50"
        />
        <StatCard 
          title="Total Listings" 
          value={stats?.overview?.totalListings || 0} 
          icon={<ShoppingBag className="text-emerald-600" size={24} />} 
          color="bg-emerald-50"
        />
        <StatCard 
          title="Total Donations" 
          value={stats?.overview?.totalDonations || 0} 
          icon={<Heart className="text-rose-600" size={24} />} 
          color="bg-rose-50"
        />
        <StatCard 
          title="Total Swaps" 
          value={stats?.overview?.totalSwaps || 0} 
          icon={<Repeat className="text-amber-600" size={24} />} 
          color="bg-amber-50"
        />
        <StatCard 
          title="Pending Swaps" 
          value={stats?.overview?.pendingSwaps || 0} 
          icon={<Clock className="text-indigo-600" size={24} />} 
          color="bg-indigo-50"
        />
        <StatCard 
          title="Completed Swaps" 
          value={stats?.overview?.completedSwaps || 0} 
          icon={<TrendingUp className="text-emerald-600" size={24} />} 
          color="bg-emerald-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent activity integration point */}
      </div>
    </div>
  );
};

export default AdminOverview;
