
import React from 'react';
import { useAccessControl } from '@/context/AccessControlContext';

interface AccessControlProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export const AccessControl: React.FC<AccessControlProps> = ({ 
  children, 
  requiredRole, 
  fallback 
}) => {
  const { hasRole } = useAccessControl();

  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AccessControl;
