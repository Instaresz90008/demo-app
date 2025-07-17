import { useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface SecurityEvent {
  type: 'role_access_denied' | 'feature_access_denied' | 'subscription_limit_reached' | 'suspicious_activity';
  userId: string;
  details: Record<string, any>;
  timestamp: string;
}

export const useSecureAuth = () => {
  const { user, logout } = useAuth();

  const logSecurityEvent = useCallback((event: Omit<SecurityEvent, 'timestamp'>) => {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('🔒 Security Event:', securityEvent);
    }
    
    // In production, this would send to your security monitoring service
    // Example: analytics.track('security_event', securityEvent);
  }, []);

  const validateTokenSafety = useCallback(() => {
    // Check if sensitive data is stored in localStorage (security risk)
    const localStorageKeys = Object.keys(localStorage);
    const suspiciousKeys = localStorageKeys.filter(key => 
      key.includes('token') || 
      key.includes('secret') || 
      key.includes('password')
    );
    
    if (suspiciousKeys.length > 0) {
      logSecurityEvent({
        type: 'suspicious_activity',
        userId: user?.id || 'unknown',
        details: { 
          message: 'Suspicious data found in localStorage',
          keys: suspiciousKeys 
        }
      });
    }
  }, [user?.id, logSecurityEvent]);

  const checkRoleConsistency = useCallback(() => {
    if (!user) return;
    
    // Verify role consistency between client and what should be server state
    const clientRoles = user.roles || [];
    
    // In a real app, you'd validate against server state
    // For demo, we just ensure platform_admin isn't being spoofed
    if (clientRoles.includes('platform_admin') && user.email !== 'admin@platform.com') {
      logSecurityEvent({
        type: 'suspicious_activity',
        userId: user.id,
        details: { 
          message: 'Potential role spoofing detected',
          roles: clientRoles,
          email: user.email
        }
      });
    }
  }, [user, logSecurityEvent]);

  const auditRouteAccess = useCallback((route: string, requiredRole?: string, requiredFeature?: string) => {
    if (!user) return;

    const hasRole = requiredRole ? user.roles?.includes(requiredRole) : true;
    const hasFeature = requiredFeature; // Feature check would be implemented here

    if (!hasRole) {
      logSecurityEvent({
        type: 'role_access_denied',
        userId: user.id,
        details: {
          route,
          requiredRole,
          userRoles: user.roles,
          userEmail: user.email
        }
      });
    }

    if (requiredFeature && !hasFeature) {
      logSecurityEvent({
        type: 'feature_access_denied',
        userId: user.id,
        details: {
          route,
          requiredFeature,
          userPlan: user.planType
        }
      });
    }
  }, [user, logSecurityEvent]);

  const enforceSubscriptionLimits = useCallback((feature: string, usage: number, limit: number) => {
    if (usage >= limit) {
      logSecurityEvent({
        type: 'subscription_limit_reached',
        userId: user?.id || 'unknown',
        details: {
          feature,
          usage,
          limit,
          planType: user?.planType
        }
      });
      return false;
    }
    return true;
  }, [user, logSecurityEvent]);

  // Run security checks on mount and user changes
  useEffect(() => {
    if (user) {
      validateTokenSafety();
      checkRoleConsistency();
    }
  }, [user, validateTokenSafety, checkRoleConsistency]);

  return {
    logSecurityEvent,
    auditRouteAccess,
    enforceSubscriptionLimits,
    validateTokenSafety,
    checkRoleConsistency
  };
};