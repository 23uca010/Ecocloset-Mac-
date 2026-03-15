import React from 'react';
import { 
  Users, ShoppingBag, Repeat, 
  AlertTriangle, ArrowUpRight, ArrowDownRight,
  TrendingUp, Clock
} from 'lucide-react';

const AdminOverview = ({ stats, recentUsers, recentItems }) => {
  const StatCard = ({ title, value, icon, color, trend, trendValue }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-black text-gray-900">{value}</h3>
      </div>
    </div>
  );

  // Simple SVG Chart component
  const ActivityChart = () => (
    <div className="h-64 w-full flex items-end justify-between gap-2 pt-4">
      {[45, 60, 40, 80, 55, 90, 70, 85, 50, 65, 75, 95].map((height, i) => (
        <div key={i} className="flex-1 flex flex-col items-center group">
          <div 
            className="w-full bg-indigo-100 rounded-t-lg transition-all group-hover:bg-indigo-600 relative"
            style={{ height: `${height}%` }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {height} units
            </div>
          </div>
          <span className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={<Users className="text-blue-600" size={24} />} 
          color="bg-blue-50"
          trend="up"
          trendValue="12%"
        />
        <StatCard 
          title="Total Listings" 
          value={stats?.totalListings || 0} 
          icon={<ShoppingBag className="text-emerald-600" size={24} />} 
          color="bg-emerald-50"
          trend="up"
          trendValue="8.5%"
        />
        <StatCard 
          title="Total Swaps" 
          value={stats?.totalSwaps || 0} 
          icon={<Repeat className="text-amber-600" size={24} />} 
          color="bg-amber-50"
          trend="down"
          trendValue="2.1%"
        />
        <StatCard 
          title="Reported Items" 
          value={stats?.reportedItems || 0} 
          icon={<AlertTriangle className="text-rose-600" size={24} />} 
          color="bg-rose-50"
          trend="down"
          trendValue="15%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Platform Growth</h3>
              <p className="text-sm text-gray-500">Monthly listings and swap activity</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                <span className="h-2 w-2 rounded-full bg-indigo-600"></span> Swaps
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                <span className="h-2 w-2 rounded-full bg-indigo-200"></span> Listings
              </span>
            </div>
          </div>
          <ActivityChart />
        </div>

        {/* Right Sidebar Activity */}
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Approval Rate
            </h4>
            <div className="text-4xl font-black mb-2">94.2%</div>
            <p className="text-indigo-100 text-sm">Target threshold: 90%</p>
            <div className="mt-6 h-1 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: '94.2%' }}></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-indigo-600" />
              Pending Actions
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Listing Approvals</span>
                <span className="font-bold text-emerald-600">{stats?.pendingListings || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">New Reports</span>
                <span className="font-bold text-rose-600">{stats?.reportedItems || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Unresolved Swaps</span>
                <span className="font-bold text-amber-600">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h4 className="font-bold text-gray-900">New Users</h4>
            <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
          </div>
          <div className="p-6 space-y-4">
            {recentUsers?.map(u => (
              <div key={u.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {u.name?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-400">
                  {new Date(u.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h4 className="font-bold text-gray-900">Recent Listings</h4>
            <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
          </div>
          <div className="p-6 space-y-4">
             {recentItems?.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                  item.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
