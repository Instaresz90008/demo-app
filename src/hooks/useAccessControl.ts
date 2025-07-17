
import { useState, useEffect, useCallback } from 'react';
import { AccessEvaluationResult } from '@/types/access-control';
import { accessControlService } from '@/services/access-control/AccessControlService';
import { useAuth } from './useAuth';

export const useAccessControl = () => {
  const { user } = useAuth();
  const [accessCache, setAccessCache] = useState<Record<string, AccessEvaluationResult>>({});
  const [loading, setLoading] = useState(false);

  const checkAccess = useCallback(async (
    featureId: string,
    orgId?: string,
    context?: Record<string, any>
  ): Promise<AccessEvaluationResult> => {
    if (!user?.id) {
      return {
        allowed: false,
        reason: 'User not authenticated',
        ui_status: 'hard_denied',
        metadata: {
          evaluation_time: '0ms',
          cached: false,
          rules_applied: ['authentication_check']
        }
      };
    }

    const cacheKey = `${user.id}:${featureId}:${orgId || 'default'}`;
    
    // Return cached result if available and recent
    if (accessCache[cacheKey]) {
      return accessCache[cacheKey];
    }

    setLoading(true);
    try {
      const result = await accessControlService.checkFeatureAccess(
        user.id,
        featureId,
        orgId || user.id, // Default to user ID as org ID if not provided
        context
      );

      // Update cache
      setAccessCache(prev => ({
        ...prev,
        [cacheKey]: result
      }));

      return result;
    } finally {
      setLoading(false);
    }
  }, [user?.id, accessCache]);

  const checkMultipleFeatures = useCallback(async (
    featureIds: string[],
    orgId?: string
  ): Promise<Record<string, AccessEvaluationResult>> => {
    if (!user?.id) {
      const deniedResult: AccessEvaluationResult = {
        allowed: false,
        reason: 'User not authenticated',
        ui_status: 'hard_denied',
        metadata: {
          evaluation_time: '0ms',
          cached: false,
          rules_applied: ['authentication_check']
        }
      };

      return featureIds.reduce((acc, featureId) => ({
        ...acc,
        [featureId]: deniedResult
      }), {});
    }

    setLoading(true);
    try {
      const results = await accessControlService.getFeatureUIStatus(
        user.id,
        featureIds,
        orgId || user.id
      );

      // Update cache with all results
      const cacheUpdates = Object.entries(results).reduce((acc, [featureId, result]) => {
        const cacheKey = `${user.id}:${featureId}:${orgId || 'default'}`;
        return { ...acc, [cacheKey]: result };
      }, {});

      setAccessCache(prev => ({ ...prev, ...cacheUpdates }));

      return results;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const trackUsage = useCallback(async (
    pluginId: string,
    featureId: string,
    action: string,
    metadata?: Record<string, any>
  ) => {
    if (!user?.id) return;

    await accessControlService.trackPluginUsage(
      user.id,
      user.id, // Default org ID
      pluginId,
      featureId,
      action,
      metadata
    );
  }, [user?.id]);

  const clearCache = useCallback(() => {
    setAccessCache({});
  }, []);

  const isFeatureEnabled = useCallback((featureId: string, orgId?: string): boolean => {
    const cacheKey = `${user?.id}:${featureId}:${orgId || 'default'}`;
    const result = accessCache[cacheKey];
    return result?.allowed || false;
  }, [user?.id, accessCache]);

  const getFeatureStatus = useCallback((featureId: string, orgId?: string): AccessEvaluationResult | null => {
    const cacheKey = `${user?.id}:${featureId}:${orgId || 'default'}`;
    return accessCache[cacheKey] || null;
  }, [user?.id, accessCache]);

  return {
    checkAccess,
    checkMultipleFeatures,
    trackUsage,
    clearCache,
    isFeatureEnabled,
    getFeatureStatus,
    loading
  };
};

export default useAccessControl;
