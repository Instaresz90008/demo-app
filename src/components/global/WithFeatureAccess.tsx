
import React from 'react';
import { useFeature } from '@/hooks/useFeature';
import { useAccessControl } from '@/context/AccessControlContext';

interface WithFeatureAccessProps {
  featureKey?: string;
  requiredRoles?: string[];
  children: React.ReactNode;
}

export const WithFeatureAccess: React.FC<WithFeatureAccessProps> = ({ 
  featureKey, 
  requiredRoles, 
  children 
}) => {
  const { canAccess } = useFeature();
  const { getCurrentUser, getCurrentUserRole } = useAccessControl();
  
  const currentUser = getCurrentUser();
  const userRole = getCurrentUserRole();
  const userRoles = currentUser?.roles || [];

  // Platform admin bypasses all restrictions
  if (userRole === 'platform_admin') {
    return <>{children}</>;
  }

  // Check feature access
  if (featureKey && !canAccess(featureKey)) {
    return null;
  }

  // Check role access
  if (requiredRoles && !requiredRoles.some(role => userRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
};

export default WithFeatureAccess;
