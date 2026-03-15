import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ModernNavbar from './components/ModernNavbar';
import Footer from './components/Footer';
import Cart from './components/Cart';
import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage';
import AddListing from './pages/AddListing';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ModernHome from './pages/ModernHome';
import InnovativeDashboard from './pages/InnovativeDashboard';
import StylishItems from './pages/StylishItems';
import ModernDonate from './pages/ModernDonate';
import ItemDetail from './pages/ItemDetail';
import Swaps from './pages/Swaps';
import Donations from './pages/Donations';
import SellSwap from './pages/SellSwap';
import AdminDashboard from './pages/AdminDashboard';
import NGODashboard from './pages/NGODashboard';
import TestConnection from './pages/TestConnection';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          {!isAuthPage && <ModernNavbar />}
          <main className="flex-1">
            <Routes>
              {/* New Design Routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/home" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/browse" element={
                <ProtectedRoute>
                  <StylishItems />
                </ProtectedRoute>
              } />
              <Route path="/add-listing" element={
                <ProtectedRoute>
                  <AddListing />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/profile-page" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              {/* Original Routes */}
              <Route path="/modern-home" element={
                <ProtectedRoute>
                  <ModernHome />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/test-connection" element={<TestConnection />} />
              <Route path="/items" element={
                <ProtectedRoute>
                  <StylishItems />
                </ProtectedRoute>
              } />
              <Route path="/items/:id" element={
                <ProtectedRoute>
                  <ItemDetail />
                </ProtectedRoute>
              } />
              <Route path="/donate" element={
                <ProtectedRoute>
                  <ModernDonate />
                </ProtectedRoute>
              } />
              <Route path="/add-item" element={
                <ProtectedRoute>
                  <ModernDonate />
                </ProtectedRoute>
              } />
              <Route path="/sell-swap" element={
                <ProtectedRoute>
                  <SellSwap />
                </ProtectedRoute>
              } />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <InnovativeDashboard />
                </ProtectedRoute>
              } />
              <Route path="/swaps" element={
                <ProtectedRoute>
                  <Swaps />
                </ProtectedRoute>
              } />
              <Route path="/donations" element={
                <ProtectedRoute>
                  <Donations />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/ngo/dashboard" element={
                <ProtectedRoute>
                  <NGODashboard />
                </ProtectedRoute>
              } />
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
          {!isAuthPage && <Footer />}
          <Cart />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
