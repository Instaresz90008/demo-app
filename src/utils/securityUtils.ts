// Security utility functions for frontend hygiene

export const securityUtils = {
  /**
   * Sanitize sensitive data from objects before logging or storing
   */
  sanitizeForLogging: (data: any): any => {
    if (!data || typeof data !== 'object') return data;
    
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'jwt', 'session'];
    
    const sanitized = { ...data };
    
    for (const key in sanitized) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '***REDACTED***';
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = securityUtils.sanitizeForLogging(sanitized[key]);
      }
    }
    
    return sanitized;
  },

  /**
   * Check if we're running in a secure context
   */
  isSecureContext: (): boolean => {
    return window.isSecureContext || window.location.protocol === 'https:';
  },

  /**
   * Validate that tokens are not stored in localStorage
   */
  checkTokenStorage: (): { safe: boolean; issues: string[] } => {
    const issues: string[] = [];
    const localStorageKeys = Object.keys(localStorage);
    
    const sensitivePatterns = [
      /token/i,
      /jwt/i,
      /auth/i,
      /secret/i,
      /password/i,
      /session/i
    ];
    
    localStorageKeys.forEach(key => {
      if (sensitivePatterns.some(pattern => pattern.test(key))) {
        issues.push(`Potentially sensitive data in localStorage: ${key}`);
      }
    });
    
    return {
      safe: issues.length === 0,
      issues
    };
  },

  /**
   * Generate a secure random string for client-side use
   */
  generateSecureRandom: (length: number = 32): string => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Basic XSS protection for user input
   */
  sanitizeUserInput: (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  /**
   * Check for common security headers
   */
  checkSecurityHeaders: async (): Promise<{ present: string[]; missing: string[] }> => {
    try {
      const response = await fetch(window.location.origin, { method: 'HEAD' });
      const headers = response.headers;
      
      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'x-xss-protection',
        'strict-transport-security',
        'content-security-policy'
      ];
      
      const present = securityHeaders.filter(header => headers.has(header));
      const missing = securityHeaders.filter(header => !headers.has(header));
      
      return { present, missing };
    } catch (error) {
      console.warn('Could not check security headers:', error);
      return { present: [], missing: [] };
    }
  },

  /**
   * Validate role hierarchy for privilege escalation prevention
   */
  validateRoleHierarchy: (userRoles: string[], requiredRole: string): boolean => {
    const roleHierarchy = {
      'platform_admin': 4,
      'org_admin': 3,
      'team_admin': 2,
      'member': 1,
      'end_user': 1
    };
    
    const userMaxLevel = Math.max(...userRoles.map(role => roleHierarchy[role as keyof typeof roleHierarchy] || 0));
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
    
    return userMaxLevel >= requiredLevel;
  },

  /**
   * Rate limiting check for client-side actions
   */
  checkRateLimit: (action: string, limit: number, windowMs: number): boolean => {
    const key = `rateLimit_${action}`;
    const now = Date.now();
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      localStorage.setItem(key, JSON.stringify({ count: 1, resetTime: now + windowMs }));
      return true;
    }
    
    const data = JSON.parse(stored);
    
    if (now > data.resetTime) {
      localStorage.setItem(key, JSON.stringify({ count: 1, resetTime: now + windowMs }));
      return true;
    }
    
    if (data.count >= limit) {
      return false;
    }
    
    data.count++;
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  }
};