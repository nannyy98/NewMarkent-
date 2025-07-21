import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface NetworkStatusProps {
  showOfflineOnly?: boolean;
}

export function NetworkStatus({ showOfflineOnly = false }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner || (showOfflineOnly && isOnline)) {
    return null;
  }

  return (
    <div className={`fixed bottom-20 md:bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 ${
      isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      {isOnline ? (
        <>
          <Wifi className="h-5 w-5" />
          <span>Соединение восстановлено</span>
        </>
      ) : (
        <>
          <WifiOff className="h-5 w-5" />
          <span>Нет подключения к интернету</span>
        </>
      )}
    </div>
  );
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export function withNetworkStatus<P extends object>(
  Component: React.ComponentType<P & { isOnline: boolean }>
) {
  return function WithNetworkStatus(props: P) {
    const isOnline = useNetworkStatus();
    return <Component {...props} isOnline={isOnline} />;
  };
}