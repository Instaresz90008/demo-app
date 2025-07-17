
import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAccessControl } from '@/context/AccessControlContext';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

// Add this helper to get a safe fallback route
function getSafeFallbackRoute(role: string) {
  // Dashboard is always allowed for any authenticated user
  return '/dashboard';
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredFeature?: string;
  requiredRole?: string;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredFeature,
  requiredRole,
  fallbackPath = '/'
}) => {
  const { isFeatureEnabled, getCurrentUserRole, hasRole } = useAccessControl();
  const userRole = getCurrentUserRole();
  const location = useLocation();

  // Platform admin bypasses all access restrictions
  if (userRole === 'platform_admin') {
    return <>{children}</>;
  }

  // Role/feature access checks for non-platform-admin users
  const roleDenied = requiredRole && !hasRole(requiredRole);
  const featureDenied = requiredFeature && !isFeatureEnabled(requiredFeature);

  // Toast should only be fired once per navigation attempt
  const hasToastedRef = useRef(false);

  // If access is denied, fire toast only once, then immediately redirect using <Navigate />
  if ((roleDenied || featureDenied) && !hasToastedRef.current) {
    toast({
      title: "Access Denied",
      description: "You do not have permission to access this page. Redirected to Dashboard.",
      variant: "destructive",
    });
    hasToastedRef.current = true;
  }

  // If denied by role or feature, redirect using <Navigate /> to a safe route (dashboard)
  if ((roleDenied || featureDenied)) {
    const safeRoute = getSafeFallbackRoute(userRole);
    if (location.pathname !== safeRoute && location.pathname !== fallbackPath) {
      return <Navigate to={safeRoute} replace />;
    }
  }

  // Final rendering logic for allowed access
  if (roleDenied) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this page. Required role: {requiredRole}
            </p>
            <p className="text-sm text-muted-foreground">
              Your current role: {userRole}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (featureDenied) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
