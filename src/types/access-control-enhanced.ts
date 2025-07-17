
export type PlanTier = 'freemium' | 'advanced_trial' | 'advanced' | 'professional' | 'enterprise';
export type UserSegment = 'individual' | 'team_admin' | 'org_admin' | 'sub_team_admin' | 'team_member';
export type UserRole = 'end_user' | 'admin' | 'org_admin' | 'platform_admin';

export interface PlanCapabilities {
  maxServices: number | 'unlimited';
  maxCatalogs: number | 'unlimited';
  pricingAllowed: boolean;
  teamInvite: boolean;
  aiAccess: boolean | 'booking_only' | 'full';
  revenueCap: number | 'unlimited';
  trialDays?: number;
  trustSignals: boolean | 'basic' | 'verified' | 'full';
  publicListing: boolean;
  maxTeamMembers: number | 'unlimited';
  webhooksEnabled: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
  slaSupport: boolean;
  smartServiceAccess: boolean;
  smartServiceTemplates: number | 'unlimited';
}

export interface AccessControlMatrix {
  [plan: string]: {
    [segment: string]: {
      [role: string]: PlanCapabilities;
    };
  };
}

export interface RevenueTracker {
  user_id: string;
  totalCollected: number;
  trialStartDate?: string;
  lastUpdated: string;
}

export interface TrustSignals {
  user_id: string;
  verifiedHost: boolean;
  responseTime: number; // in hours
  bookingStats: number;
  completionRate: number;
  rating: number;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action_type: string;
  target_id: string;
  timestamp: string;
  details: Record<string, any>;
}

export interface UpgradeNudge {
  title: string;
  message: string;
  ctaText: string;
  targetPlan: PlanTier;
  urgency: 'low' | 'medium' | 'high';
  feature: string;
}
