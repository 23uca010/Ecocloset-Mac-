import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ModernNavbar from './components/ModernNavbar';
import Cart from './components/Cart';
import Footer from './components/Footer';
import ModernHome from './pages/ModernHome';
import StylishItems from './pages/StylishItems';
import AddListing from './pages/AddListing';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import Register from './pages/Register';
import InnovativeDashboard from './pages/InnovativeDashboard';
import Donate from './pages/Donate';
import ItemDetail from './pages/ItemDetail';
import SellSwap from './pages/SellSwap';
import SellPage from './pages/SellPage';
import SwapPage from './pages/SwapPage';
import AdminDashboard from './pages/AdminDashboard';
import NGODashboard from './pages/NGODashboard';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';
import Messages from './pages/Messages';

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
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Root → Home */}
              <Route path="/" element={
                <ProtectedRoute>
                  <ModernHome />
                </ProtectedRoute>
              } />
              <Route path="/home" element={
                <ProtectedRoute>
                  <ModernHome />
                </ProtectedRoute>
              } />

              {/* Browse */}
              <Route path="/browse" element={
                <ProtectedRoute>
                  <StylishItems />
                </ProtectedRoute>
              } />
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

              {/* Listing Routes */}
              <Route path="/add-listing" element={
                <ProtectedRoute>
                  <AddListing />
                </ProtectedRoute>
              } />
              <Route path="/sell" element={
                <ProtectedRoute>
                  <SellPage />
                </ProtectedRoute>
              } />
              <Route path="/swap" element={
                <ProtectedRoute>
                  <SwapPage />
                </ProtectedRoute>
              } />
              <Route path="/sell-swap" element={
                <ProtectedRoute>
                  <SellSwap />
                </ProtectedRoute>
              } />

              {/* Donate */}
              <Route path="/donate" element={
                <ProtectedRoute>
                  <Donate />
                </ProtectedRoute>
              } />

              {/* Dashboard */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <InnovativeDashboard />
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
              <Route path="/messages" element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } />

              {/* Admin */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
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
          <Cart />
          {!isAuthPage && <Footer />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
