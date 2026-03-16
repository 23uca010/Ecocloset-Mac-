import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminOverview from '../components/admin/AdminOverview';
import UserManagement from '../components/admin/UserManagement';
import ListingManagement from '../components/admin/ListingManagement';
import SwapMonitoring from '../components/admin/SwapMonitoring';
import Moderation from '../components/admin/Moderation';
import CategoryManagement from '../components/admin/CategoryManagement';
import DonationsManagement from '../components/admin/DonationsManagement';

const AdminDashboard = () => {
  const { api } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: null,
    items: [],
    swaps: [],
    reports: [],
    categories: [],
    recentUsers: [],
    recentItems: []
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        statsRes, itemsRes, 
        swapsRes, reportsRes, categoriesRes
      ] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/items'),
        api.get('/admin/swaps'),
        api.get('/admin/reports'),
        api.get('/categories')
      ]);

      setData({
        stats: statsRes.data.data.overview,
        items: itemsRes.data.data.items || [],
        swaps: swapsRes.data.data.swaps || [],
        reports: reportsRes.data.data.reports || [],
        categories: categoriesRes.data.data.categories || [],
        recentUsers: statsRes.data.data.recentUsers || [],
        recentItems: statsRes.data.data.recentItems || []
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };



  // Item Actions
  const handleUpdateItemStatus = async (itemId, status) => {
    try {
      await api.put(`/admin/items/${itemId}/status`, { status });
      fetchAllData();
    } catch (error) {
      alert('Failed to update listing status');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await api.delete(`/admin/items/${itemId}`);
      fetchAllData();
    } catch (error) {
      alert('Failed to delete listing');
    }
  };

  // Category Actions
  const handleAddCategory = async (catData) => {
    try {
      await api.post('/categories', catData);
      fetchAllData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add category');
    }
  };

  const handleUpdateCategory = async (id, catData) => {
    try {
      await api.put(`/categories/${id}`, catData);
      fetchAllData();
    } catch (error) {
      alert('Failed to update category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchAllData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete category');
    }
  };

  // Placeholder for Swap/Report actions (can be expanded)
  const handleSwapAction = (id) => alert(`Action on swap ${id} coming soon`);
  const handleReportAction = (id) => alert(`Action on report ${id} coming soon`);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-6">
            <div className="h-20 w-20 border-[6px] border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center font-black text-indigo-600">ECO</div>
        </div>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">SYNCHRONIZING HUB</h2>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2 animate-pulse">Gathering platform intelligence...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview stats={data.stats} recentUsers={data.recentUsers} recentItems={data.recentItems} />;
      case 'users':
        return <UserManagement />;
      case 'listings':
        return (
          <ListingManagement 
            items={data.items} 
            onUpdateStatus={handleUpdateItemStatus} 
            onDeleteItem={handleDeleteItem} 
          />
        );
      case 'swaps':
        return (
          <SwapMonitoring 
            swaps={data.swaps} 
            onResolveSwap={handleSwapAction} 
            onCancelSwap={handleSwapAction} 
          />
        );
      case 'reports':
        return (
          <Moderation 
            reports={data.reports} 
            onResolveReport={handleReportAction} 
            onDismissReport={handleReportAction} 
          />
        );
      case 'categories':
        return (
          <CategoryManagement 
            categories={data.categories} 
            onAddCategory={handleAddCategory} 
            onUpdateCategory={handleUpdateCategory} 
            onDeleteCategory={handleDeleteCategory} 
          />
        );
      case 'donations':
        return <DonationsManagement />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h4 className="text-2xl font-black text-gray-900 uppercase italic">Section in development</h4>
            <p className="text-gray-400 mt-2 font-bold uppercase tracking-widest text-xs">Architecting future modules...</p>
          </div>
        );
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;
