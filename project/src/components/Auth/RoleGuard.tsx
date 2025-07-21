import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { AlertTriangle } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export function RoleGuard({ 
  children, 
  allowedRoles = [], 
  requiredPermissions = [],
  fallback,
  showFallback = true 
}: RoleGuardProps) {
  const { state, hasRole, hasPermission } = useAuth();

  // Check if user has required role
  const hasRequiredRole = allowedRoles.length === 0 || 
    allowedRoles.some(role => hasRole(role));

  // Check if user has required permissions
  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => hasPermission(permission));

  // If user doesn't have access, show fallback or nothing
  if (!hasRequiredRole || !hasRequiredPermissions) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showFallback) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Access Restricted</h3>
            <p className="text-sm text-yellow-700">
              You don't have permission to access this content.
            </p>
          </div>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
}

// Component for seller-only content
export function SellerOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['seller', 'admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

// Component for admin-only content
export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

// Component for authenticated users only
export function AuthenticatedOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { state } = useAuth();
  
  if (!state.isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }
  
  return <>{children}</>;
}