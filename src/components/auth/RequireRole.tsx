import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface RequireRoleProps {
  role: string | string[];
  children: React.ReactNode;
  fallbackPath?: string;
  showUI?: boolean;
}

const RequireRole: React.FC<RequireRoleProps> = ({ 
  role, 
  children, 
  fallbackPath = '/dashboard',
  showUI = false 
}) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Platform admin bypasses all role restrictions
  if (user.roles?.includes('platform_admin')) {
    return <>{children}</>;
  }

  const requiredRoles = Array.isArray(role) ? role : [role];
  const hasRequiredRole = requiredRoles.some(r => user.roles?.includes(r));

  if (!hasRequiredRole) {
    if (showUI) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-4">
                You don't have permission to access this feature.
              </p>
              <p className="text-sm text-muted-foreground">
                Required role: {requiredRoles.join(' or ')}
              </p>
              <p className="text-sm text-muted-foreground">
                Your roles: {user.roles?.join(', ') || 'None'}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RequireRole;