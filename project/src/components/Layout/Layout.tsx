import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { InstallPrompt } from '../PWA/InstallPrompt';
import { NetworkStatus } from '../common/NetworkStatus';
import { ToastContainer } from 'react-toastify';
import { AdvancedLiveChat } from '../Chat/AdvancedLiveChat';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Don't show mobile nav on auth page
  const showMobileNav = location.pathname !== '/auth';

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0 safe-area-inset">
      <Header
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {children}
      </main>
      
      <Footer />
      
      {showMobileNav && (
        <MobileNav />
      )}
      
      <NetworkStatus />
      <InstallPrompt />
      <AdvancedLiveChat />
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}