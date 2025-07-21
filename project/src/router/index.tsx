import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { ProtectedRoute } from '../components/Auth/ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SellerPage } from '../pages/SellerPage';
import { AuthPage } from '../pages/AuthPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { SellerVerification } from '../components/Seller/SellerVerification';
import { ProductWishlist } from '../components/Product/ProductWishlist';
import { AdminPage } from '../pages/AdminPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { useAuth } from '../auth/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useEffect } from 'react';

export function AppRouter() {
  const { state: authState } = useAuth();
  const { state } = useApp();
  
  // Handle browser history for better platform compatibility
  useEffect(() => {
    const handlePopState = () => {
      // Force re-render on browser navigation
      window.location.reload();
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <BrowserRouter basename="/">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/catalog/:category" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          
          {/* Protected Routes */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              {state.cart.length > 0 ? <CheckoutPage /> : <Navigate to="/cart" />}
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/seller" element={
            <ProtectedRoute requiredRole="seller">
              <SellerPage />
            </ProtectedRoute>
          } />
          
          <Route path="/seller/verification" element={
            <ProtectedRoute>
              <SellerVerification />
            </ProtectedRoute>
          } />
          
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <ProductWishlist onProductClick={(id) => window.location.href = `/product/${id}`} />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          } />
          
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}