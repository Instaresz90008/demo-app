
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ACCESS_CONTROL_MATRIX } from '@/config/accessControlMatrix';
import { UnifiedCapabilities, FeatureCheck, PlanTier } from '@/types/unified-access-control';

export const useUnifiedAccessControl = () => {
  const { user } = useAuth();
  console.log('useUnifiedAccessControl: User:', user);

  const getCapabilities = useCallback((): UnifiedCapabilities | null => {
    if (!user) return null;

    const plan = user.planType as PlanTier || 'freemium';
    const segment = user.segment || 'individual';
    const role = user.primaryRole || 'end_user';

    return ACCESS_CONTROL_MATRIX[plan]?.[segment]?.[role] || null;
  }, [user]);

  const checkFeature = useCallback((feature: keyof UnifiedCapabilities): FeatureCheck => {
    if (!user) return { allowed: false, reason: 'Not authenticated' };
    
    // Platform admin bypasses all restrictions
    if (user.roles?.includes('platform_admin')) {
      return { allowed: true };
    }

    const capabilities = getCapabilities();
    if (!capabilities) {
      return { allowed: false, reason: 'No capabilities found' };
    }

    const hasFeature = !!capabilities[feature];
    return { 
      allowed: hasFeature,
      reason: hasFeature ? undefined : `Feature requires upgrade`,
      upgradeRequired: hasFeature ? undefined : 'professional'
    };
  }, [user, getCapabilities]);

  const checkRole = useCallback((requiredRole: string | string[]): boolean => {
    if (!user) return false;
    
    // Platform admin bypasses all role checks
    if (user.roles?.includes('platform_admin')) return true;

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.some(role => user.roles?.includes(role as any));
  }, [user]);

  const checkPlan = useCallback((requiredPlan: PlanTier): boolean => {
    if (!user) return false;
    
    // Platform admin bypasses plan restrictions
    if (user.roles?.includes('platform_admin')) return true;

    const planHierarchy = { freemium: 0, advanced_trial: 1, advanced: 2, professional: 3, enterprise: 4 };
    const userLevel = planHierarchy[user.planType as PlanTier] ?? 0;
    const requiredLevel = planHierarchy[requiredPlan];
    
    return userLevel >= requiredLevel;
  }, [user]);

  return {
    user,
    capabilities: getCapabilities(),
    checkFeature,
    checkRole,
    checkPlan,
    isPlatformAdmin: user?.roles?.includes('platform_admin') || false
  };
};
