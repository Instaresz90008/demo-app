
import { UnifiedCapabilities } from '@/types/unified-access-control';

export const ACCESS_CONTROL_MATRIX = {
  freemium: {
    individual: {
      end_user: {
        dashboard: true,
        calendar: true,
        manageServices: true,
        bookingLinks: true,
        settings: true,
        basicReports: true,
        clientManagement: false,
        aiFeatures: false,
        aiAccess: false,
        customBranding: false,
        apiAccess: false,
        webhooks: false,
        customDomain: false,
        betaFeatures: false,
        smartServiceAccess: true,
        smartServiceTemplates: 3
      }
    }
  },
  advanced: {
    individual: {
      end_user: {
        dashboard: true,
        calendar: true,
        manageServices: true,
        bookingLinks: true,
        settings: true,
        basicReports: true,
        clientManagement: true,
        aiFeatures: false,
        aiAccess: false,
        customBranding: false,
        apiAccess: false,
        webhooks: false,
        customDomain: false,
        betaFeatures: false,
        smartServiceAccess: true,
        smartServiceTemplates: 5
      }
    }
  },
  professional: {
    individual: {
      end_user: {
        dashboard: true,
        calendar: true,
        manageServices: true,
        bookingLinks: true,
        settings: true,
        basicReports: true,
        advancedReports: true,
        clientManagement: true,
        aiFeatures: true,
        aiAccess: 'booking_only',
        customBranding: true,
        apiAccess: true,
        webhooks: true,
        customDomain: false,
        betaFeatures: true,
        aiSettings: true,
        integrationsWebhooks: true,
        apiManagement: true,
        smartServiceAccess: true,
        smartServiceTemplates: 10
      }
    }
  },
  enterprise: {
    individual: {
      end_user: {
        dashboard: true,
        calendar: true,
        manageServices: true,
        bookingLinks: true,
        settings: true,
        basicReports: true,
        advancedReports: true,
        clientManagement: true,
        aiFeatures: true,
        aiAccess: 'full',
        customBranding: true,
        apiAccess: true,
        webhooks: true,
        customDomain: true,
        betaFeatures: true,
        aiSettings: true,
        integrationsWebhooks: true,
        apiManagement: true,
        platformAdmin: true,
        smartServiceAccess: true,
        smartServiceTemplates: true // unlimited
      }
    }
  }
} as const;
