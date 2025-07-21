import React from 'react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './auth/AuthContext';
import { AppRouter } from './router';
import { NotificationService } from './services/notifications';

function App() {
  React.useEffect(() => {
    // Initialize notifications
    NotificationService.requestPermission();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <AppRouter />
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;