
import { MetaProtection } from '@/types/meta-architecture';

export function getDefaultProtection(): MetaProtection {
  return {
    authenticationModes: [
      {
        id: 'password_auth',
        type: 'password',
        enabled: true,
        industries: ['healthcare', 'beauty', 'fitness', 'education', 'consulting', 'legal', 'finance', 'retail'],
        minimumPlan: 'freemium',
        securityLevel: 'basic'
      },
      {
        id: 'oauth_google',
        type: 'oauth',
        enabled: true,
        industries: ['beauty', 'fitness', 'education', 'retail'],
        minimumPlan: 'freemium',
        securityLevel: 'basic'
      },
      {
        id: 'magic_link',
        type: 'magic_link',
        enabled: true,
        industries: ['beauty', 'fitness', 'retail'],
        minimumPlan: 'advanced',
        securityLevel: 'enhanced'
      },
      {
        id: 'mfa_required',
        type: 'mfa',
        enabled: true,
        industries: ['healthcare', 'legal', 'finance'],
        minimumPlan: 'professional',
        securityLevel: 'maximum'
      }
    ],
    sessionPolicies: {
      maxDuration: 86400, // 24 hours in seconds
      idleTimeout: 3600, // 1 hour
      concurrentSessions: 3,
      ipValidation: true
    },
    ipFingerprinting: {
      enabled: true,
      trackingDuration: 2592000, // 30 days
      suspiciousThreshold: 5,
      blockingEnabled: false
    },
    botDetection: {
      enabled: true,
      mechanisms: ['user_agent_analysis', 'behavioral_patterns', 'rate_limiting', 'captcha'],
      captchaThreshold: 3,
      challengeTypes: ['recaptcha', 'hcaptcha', 'cloudflare_turnstile']
    },
    rateLimiting: [
      {
        id: 'api_general',
        endpoint: '/api/*',
        limit: 1000,
        window: 3600, // 1 hour
        byUser: true,
        byIP: true,
        overrides: {
          end_user: { limit: 1000 },
          team_admin: { limit: 2000 },
          org_admin: { limit: 5000 },
          platform_admin: { limit: -1 }
        }
      },
      {
        id: 'booking_creation',
        endpoint: '/api/bookings',
        limit: 100,
        window: 3600,
        byUser: true,
        byIP: false,
        overrides: {
          end_user: { limit: 100 },
          team_admin: { limit: 200 },
          org_admin: { limit: 500 },
          platform_admin: { limit: -1 }
        }
      },
      {
        id: 'auth_endpoints',
        endpoint: '/api/auth/*',
        limit: 20,
        window: 900, // 15 minutes
        byUser: false,
        byIP: true,
        overrides: {
          end_user: { limit: 20 },
          team_admin: { limit: 50 },
          org_admin: { limit: 75 },
          platform_admin: { limit: 100 }
        }
      },
      {
        id: 'search_api',
        endpoint: '/api/search',
        limit: 500,
        window: 3600,
        byUser: true,
        byIP: true,
        overrides: {
          end_user: { limit: 500 },
          team_admin: { limit: 1000 },
          org_admin: { limit: 2000 },
          platform_admin: { limit: -1 }
        }
      },
      {
        id: 'file_upload',
        endpoint: '/api/upload',
        limit: 50,
        window: 3600,
        byUser: true,
        byIP: false,
        overrides: {
          end_user: { limit: 50 },
          team_admin: { limit: 100 },
          org_admin: { limit: 200 },
          platform_admin: { limit: -1 }
        }
      }
    ],
    abuseResponse: [
      {
        trigger: 'excessive_failed_logins',
        severity: 'medium',
        actions: [
          { type: 'throttle', duration: 900, notification: true, escalate: false },
          { type: 'warn', notification: true, escalate: false }
        ],
        escalationPath: ['security_team'],
        aiAnalysis: true
      },
      {
        trigger: 'suspicious_booking_pattern',
        severity: 'medium',
        actions: [
          { type: 'review', notification: true, escalate: false },
          { type: 'throttle', duration: 3600, notification: true, escalate: false }
        ],
        escalationPath: ['fraud_team', 'security_team'],
        aiAnalysis: true
      },
      {
        trigger: 'payment_fraud_detected',
        severity: 'high',
        actions: [
          { type: 'suspend', duration: 86400, notification: true, escalate: true },
          { type: 'review', notification: true, escalate: true }
        ],
        escalationPath: ['fraud_team', 'legal_team', 'platform_admin'],
        aiAnalysis: true
      },
      {
        trigger: 'account_takeover_attempt',
        severity: 'critical',
        actions: [
          { type: 'ban', notification: true, escalate: true },
          { type: 'review', notification: true, escalate: true }
        ],
        escalationPath: ['security_team', 'legal_team', 'platform_admin'],
        aiAnalysis: true
      },
      {
        trigger: 'spam_content_detected',
        severity: 'low',
        actions: [
          { type: 'warn', notification: true, escalate: false },
          { type: 'throttle', duration: 1800, notification: false, escalate: false }
        ],
        escalationPath: ['moderation_team'],
        aiAnalysis: true
      },
      {
        trigger: 'repeated_cancellations',
        severity: 'low',
        actions: [
          { type: 'warn', notification: true, escalate: false },
          { type: 'review', notification: false, escalate: false }
        ],
        escalationPath: ['customer_success'],
        aiAnalysis: false
      },
      {
        trigger: 'api_abuse_detected',
        severity: 'high',
        actions: [
          { type: 'suspend', duration: 7200, notification: true, escalate: true },
          { type: 'throttle', duration: 86400, notification: true, escalate: false }
        ],
        escalationPath: ['technical_team', 'platform_admin'],
        aiAnalysis: true
      }
    ]
  };
}
