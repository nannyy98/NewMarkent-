import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermissions?: string[];
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermissions = [],
  fallbackPath = '/auth' 
}: ProtectedRouteProps) {
  const { state, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // Show loading while auth is initializing
  if (!state.isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!state.isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );
    
    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredRole?: string;
    requiredPermissions?: string[];
    fallbackPath?: string;
  }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Hook for conditional rendering based on auth
export function useAuthGuard() {
  const { state, hasRole, hasPermission } = useAuth();

  const canAccess = (options: {
    requiredRole?: string;
    requiredPermissions?: string[];
    requireAuth?: boolean;
  }) => {
    const { requiredRole, requiredPermissions = [], requireAuth = true } = options;

    if (requireAuth && !state.isAuthenticated) {
      return false;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      return false;
    }

    if (requiredPermissions.length > 0) {
      return requiredPermissions.every(permission => hasPermission(permission));
    }

    return true;
  };

  return { canAccess, isAuthenticated: state.isAuthenticated };
}