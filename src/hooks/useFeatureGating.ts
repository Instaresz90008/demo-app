import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useSecureAuth } from './useSecureAuth';

interface FeatureGateConfig {
  feature: string;
  requiredRole?: string[];
  requiredPlan?: string;
  usageLimit?: number;
  usagePeriod?: 'day' | 'month' | 'year';
}

interface FeatureUsage {
  count: number;
  lastReset: string;
  period: string;
}

export const useFeatureGating = () => {
  const { user } = useAuth();
  const { enforceSubscriptionLimits, logSecurityEvent } = useSecureAuth();
  const [featureUsage, setFeatureUsage] = useState<Record<string, FeatureUsage>>({});

  const checkFeatureGate = useCallback((config: FeatureGateConfig): { allowed: boolean; reason?: string } => {
    if (!user) {
      return { allowed: false, reason: 'User not authenticated' };
    }

    // Platform admin bypasses all gates
    if (user.roles?.includes('platform_admin')) {
      return { allowed: true };
    }

    // Check role requirements
    if (config.requiredRole && !config.requiredRole.some(role => user.roles?.includes(role))) {
      logSecurityEvent({
        type: 'role_access_denied',
        userId: user.id,
        details: {
          feature: config.feature,
          requiredRole: config.requiredRole,
          userRoles: user.roles
        }
      });
      return { allowed: false, reason: `Required role: ${config.requiredRole.join(' or ')}` };
    }

    // Check subscription plan
    if (config.requiredPlan) {
      const planHierarchy = { freemium: 0, advanced: 1, professional: 2, enterprise: 3 };
      const userPlanLevel = planHierarchy[user.planType as keyof typeof planHierarchy] ?? 0;
      const requiredPlanLevel = planHierarchy[config.requiredPlan as keyof typeof planHierarchy] ?? 0;
      
      if (userPlanLevel < requiredPlanLevel) {
        return { allowed: false, reason: `Requires ${config.requiredPlan} plan` };
      }
    }

    // Check usage limits
    if (config.usageLimit && config.usagePeriod) {
      const usage = featureUsage[config.feature];
      const now = new Date();
      const periodStart = new Date();
      
      switch (config.usagePeriod) {
        case 'day':
          periodStart.setHours(0, 0, 0, 0);
          break;
        case 'month':
          periodStart.setDate(1);
          periodStart.setHours(0, 0, 0, 0);
          break;
        case 'year':
          periodStart.setMonth(0, 1);
          periodStart.setHours(0, 0, 0, 0);
          break;
      }

      if (usage && new Date(usage.lastReset) > periodStart && usage.count >= config.usageLimit) {
        if (!enforceSubscriptionLimits(config.feature, usage.count, config.usageLimit)) {
          return { allowed: false, reason: `Usage limit exceeded: ${usage.count}/${config.usageLimit} this ${config.usagePeriod}` };
        }
      }
    }

    return { allowed: true };
  }, [user, featureUsage, enforceSubscriptionLimits, logSecurityEvent]);

  const trackFeatureUsage = useCallback((feature: string, usagePeriod: 'day' | 'month' | 'year' = 'month') => {
    if (!user) return;

    const now = new Date();
    const periodStart = new Date();
    
    switch (usagePeriod) {
      case 'day':
        periodStart.setHours(0, 0, 0, 0);
        break;
      case 'month':
        periodStart.setDate(1);
        periodStart.setHours(0, 0, 0, 0);
        break;
      case 'year':
        periodStart.setMonth(0, 1);
        periodStart.setHours(0, 0, 0, 0);
        break;
    }

    setFeatureUsage(prev => {
      const current = prev[feature];
      
      // Reset if period has changed
      if (!current || new Date(current.lastReset) < periodStart) {
        return {
          ...prev,
          [feature]: {
            count: 1,
            lastReset: now.toISOString(),
            period: usagePeriod
          }
        };
      }
      
      // Increment usage
      return {
        ...prev,
        [feature]: {
          ...current,
          count: current.count + 1
        }
      };
    });
  }, [user]);

  const getFeatureUsageStats = useCallback((feature: string): FeatureUsage | null => {
    return featureUsage[feature] || null;
  }, [featureUsage]);

  const resetFeatureUsage = useCallback((feature: string) => {
    setFeatureUsage(prev => {
      const { [feature]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  // Load usage data from localStorage on mount
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`featureUsage_${user.id}`);
      if (stored) {
        try {
          setFeatureUsage(JSON.parse(stored));
        } catch (error) {
          console.warn('Failed to load feature usage data:', error);
        }
      }
    }
  }, [user]);

  // Save usage data to localStorage
  useEffect(() => {
    if (user && Object.keys(featureUsage).length > 0) {
      localStorage.setItem(`featureUsage_${user.id}`, JSON.stringify(featureUsage));
    }
  }, [user, featureUsage]);

  return {
    checkFeatureGate,
    trackFeatureUsage,
    getFeatureUsageStats,
    resetFeatureUsage
  };
};