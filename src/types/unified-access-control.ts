
export type PlanTier = 'freemium' | 'advanced' | 'professional' | 'enterprise';

export interface UnifiedCapabilities {
  dashboard: boolean;
  calendar: boolean;
  manageServices: boolean;
  bookingLinks: boolean;
  settings: boolean;
  basicReports: boolean;
  advancedReports?: boolean;
  clientManagement: boolean;
  aiFeatures: boolean;
  aiAccess?: boolean | string; // Added for TaraAIGate compatibility
  customBranding: boolean;
  apiAccess: boolean;
  webhooks: boolean;
  customDomain: boolean;
  betaFeatures: boolean;
  aiSettings?: boolean;
  integrationsWebhooks?: boolean;
  apiManagement?: boolean;
  platformAdmin?: boolean;
  smartServiceAccess?: boolean; // Added for sidebar access control
  smartServiceTemplates?: number | boolean; // Added for template limits
}

export interface FeatureCheck {
  allowed: boolean;
  reason?: string;
  upgradeRequired?: PlanTier;
}
