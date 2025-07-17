import { THEME_FEATURES } from './themeFeatures';

// Feature Management Configuration
export type FeatureId = string;
export type SubscriptionTier = 'freemium' | 'advanced' | 'professional' | 'enterprise';
export type PlanType = 'freemium' | 'advanced' | 'professional' | 'enterprise';
export type UserRole = 'platform_admin' | 'org_admin' | 'team_admin' | 'member';
export type FeatureCategory = 'ai' | 'booking' | 'calendar' | 'analytics' | 'team' | 'integration' | 'customization' | 'support' | 'growth';

export interface Feature {
  id: FeatureId;
  name: string;
  description: string;
  category: FeatureCategory;
  minimumTier: SubscriptionTier;
  allowedTiers: SubscriptionTier[];
  requiredRoles: UserRole[];
  isActive: boolean;
  isComingSoon?: boolean;
  usageLimit?: {
    tier: SubscriptionTier;
    limit: number;
    period: 'day' | 'month';
  }[];
}

export interface RoleConfig {
  id: UserRole;
  name: string;
  description: string;
  scope: 'platform' | 'organization' | 'team';
  inheritsFrom?: UserRole[];
  canManageRoles?: UserRole[];
}

export interface SubscriptionTierConfig {
  id: SubscriptionTier;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: FeatureId[];
  userLimit: number | 'unlimited';
  orgLimit: number | 'unlimited';
  priority: number;
}

// Default Features
export const FEATURES: Record<FeatureId, Feature> = {
  'tara_ai_assistant': {
    id: 'tara_ai_assistant',
    name: 'Tara AI Assistant',
    description: 'AI-powered assistant for smart scheduling',
    category: 'ai',
    minimumTier: 'professional',
    allowedTiers: ['professional', 'enterprise'],
    requiredRoles: ['member'],
    isActive: true
  },
  'smart_service_creator': {
    id: 'smart_service_creator',
    name: 'Smart Service Creator',
    description: 'Create services using pre-configured templates and booking types',
    category: 'booking',
    minimumTier: 'freemium',
    allowedTiers: ['freemium', 'advanced', 'professional', 'enterprise'],
    requiredRoles: ['member'],
    isActive: true
  },
  'booking_link': {
    id: 'booking_link',
    name: 'Booking Link',
    description: 'Generate shareable booking links for customers',
    category: 'booking',
    minimumTier: 'freemium',
    allowedTiers: ['freemium', 'advanced', 'professional', 'enterprise'],
    requiredRoles: ['member'],
    isActive: true
  },
  'booking_catalogue': {
    id: 'booking_catalogue',
    name: 'Booking Catalogue',
    description: 'Comprehensive catalogue of all booking options',
    category: 'booking',
    minimumTier: 'freemium',
    allowedTiers: ['freemium', 'advanced', 'professional', 'enterprise'],
    requiredRoles: ['member'],
    isActive: true
  },
  'event_types': {
    id: 'event_types',
    name: 'Event Types',
    description: 'Create and manage different types of events',
    category: 'booking',
    minimumTier: 'advanced',
    allowedTiers: ['advanced', 'professional', 'enterprise'],
    requiredRoles: ['member'],
    isActive: true
  },
  'calendar_sync': {
    id: 'calendar_sync',
    name: 'Calendar Sync',
    description: 'Sync with external calendars (Google, Outlook)',
    category: 'integration',
    minimumTier: 'advanced',
    allowedTiers: ['advanced', 'professional', 'enterprise'],
    requiredRoles: ['member'],
    isActive: true
  },
  'team_management': {
    id: 'team_management',
    name: 'Team Management',
    description: 'Manage team members, roles, and permissions',
    category: 'team',
    minimumTier: 'advanced',
    allowedTiers: ['advanced', 'professional', 'enterprise'],
    requiredRoles: ['team_admin'],
    isActive: true
  },
  'basic_analytics': {
    id: 'basic_analytics',
    name: 'Basic Analytics',
    description: 'Basic booking and usage analytics',
    category: 'analytics',
    minimumTier: 'advanced',
    allowedTiers: ['advanced', 'professional', 'enterprise'],
    requiredRoles: ['member'],
    isActive: true
  },
  'advanced_analytics': {
    id: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Advanced analytics with custom reports and insights',
    category: 'analytics',
    minimumTier: 'professional',
    allowedTiers: ['professional', 'enterprise'],
    requiredRoles: ['team_admin'],
    isActive: true
  },
  'custom_branding': {
    id: 'custom_branding',
    name: 'Custom Branding',
    description: 'Customize the look and feel with your brand',
    category: 'customization',
    minimumTier: 'professional',
    allowedTiers: ['professional', 'enterprise'],
    requiredRoles: ['org_admin'],
    isActive: true
  },
  'referral_engine_basic': {
    id: 'referral_engine_basic',
    name: 'Referral Engine (Basic)',
    description: 'Generate referral codes and track up to 2 referrals',
    category: 'growth',
    minimumTier: 'advanced',
    allowedTiers: ['advanced', 'professional', 'enterprise'],
    requiredRoles: ['member'],
    isActive: true,
    usageLimit: [
      { tier: 'advanced', limit: 1, period: 'month' }, // 1 referral code
      { tier: 'professional', limit: 10, period: 'month' }, // Multiple codes
      { tier: 'enterprise', limit: 50, period: 'month' }
    ]
  },
  'referral_engine_pro': {
    id: 'referral_engine_pro',
    name: 'Referral Engine (Pro)',
    description: 'Multiple campaigns, tiered rewards, and analytics',
    category: 'growth',
    minimumTier: 'professional',
    allowedTiers: ['professional', 'enterprise'],
    requiredRoles: ['member'],
    isActive: true
  },
  'subscription_manager_basic': {
    id: 'subscription_manager_basic',
    name: 'Subscription Manager (Basic)',
    description: 'Track 1 recurring client with basic billing',
    category: 'growth',
    minimumTier: 'advanced',
    allowedTiers: ['advanced', 'professional', 'enterprise'],
    requiredRoles: ['member'],
    isActive: true,
    usageLimit: [
      { tier: 'advanced', limit: 1, period: 'month' }, // 1 subscription plan
      { tier: 'professional', limit: 10, period: 'month' }, // Multiple plans
      { tier: 'enterprise', limit: 50, period: 'month' }
    ]
  },
  'subscription_manager_pro': {
    id: 'subscription_manager_pro',
    name: 'Subscription Manager (Pro)',
    description: 'Multiple plans, automation, and advanced analytics',
    category: 'growth',
    minimumTier: 'professional',
    allowedTiers: ['professional', 'enterprise'],
    requiredRoles: ['member'],
    isActive: true
  },
  'loyalty_engine_basic': {
    id: 'loyalty_engine_basic',
    name: 'Loyalty Engine (Basic)',
    description: 'Bronze tier preview and returning client badges',
    category: 'growth',
    minimumTier: 'advanced',
    allowedTiers: ['advanced', 'professional', 'enterprise'],
    requiredRoles: ['member'],
    isActive: true
  },
  'loyalty_engine_pro': {
    id: 'loyalty_engine_pro',
    name: 'Loyalty Engine (Pro)',
    description: 'Custom tiers, automation, and public leaderboards',
    category: 'growth',
    minimumTier: 'professional',
    allowedTiers: ['professional', 'enterprise'],
    requiredRoles: ['member'],
    isActive: true
  },
  ...THEME_FEATURES
};

// Default Roles
export const ROLES: Record<UserRole, RoleConfig> = {
  'platform_admin': {
    id: 'platform_admin',
    name: 'Platform Admin',
    description: 'Full platform access across all organizations',
    scope: 'platform'
  },
  'org_admin': {
    id: 'org_admin',
    name: 'Organization Admin',
    description: 'Full access within an organization',
    scope: 'organization'
  },
  'team_admin': {
    id: 'team_admin',
    name: 'Team Admin',
    description: 'Manage team members and settings',
    scope: 'team'
  },
  'member': {
    id: 'member',
    name: 'Member',
    description: 'Basic user access',
    scope: 'organization'
  }
};

// Default Subscription Tiers
export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, SubscriptionTierConfig> = {
  'freemium': {
    id: 'freemium',
    name: 'Freemium',
    price: 0,
    billingPeriod: 'monthly',
    features: ['booking_link', 'booking_catalogue', 'smart_service_creator'],
    userLimit: 1,
    orgLimit: 1,
    priority: 1
  },
  'advanced': {
    id: 'advanced',
    name: 'Advanced',
    price: 29,
    billingPeriod: 'monthly',
    features: ['booking_link', 'booking_catalogue', 'event_types', 'calendar_sync', 'team_management', 'basic_analytics', 'smart_service_creator', 'referral_engine_basic', 'subscription_manager_basic', 'loyalty_engine_basic'],
    userLimit: 10,
    orgLimit: 1,
    priority: 2
  },
  'professional': {
    id: 'professional',
    name: 'Professional',
    price: 99,
    billingPeriod: 'monthly',
    features: ['booking_link', 'booking_catalogue', 'event_types', 'calendar_sync', 'team_management', 'basic_analytics', 'advanced_analytics', 'custom_branding', 'tara_ai_assistant', 'smart_service_creator', 'referral_engine_basic', 'referral_engine_pro', 'subscription_manager_basic', 'subscription_manager_pro', 'loyalty_engine_basic', 'loyalty_engine_pro'],
    userLimit: 50,
    orgLimit: 5,
    priority: 3
  },
  'enterprise': {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    billingPeriod: 'monthly',
    features: ['booking_link', 'booking_catalogue', 'event_types', 'calendar_sync', 'team_management', 'basic_analytics', 'advanced_analytics', 'custom_branding', 'tara_ai_assistant', 'smart_service_creator', 'referral_engine_basic', 'referral_engine_pro', 'subscription_manager_basic', 'subscription_manager_pro', 'loyalty_engine_basic', 'loyalty_engine_pro'],
    userLimit: 'unlimited',
    orgLimit: 'unlimited',
    priority: 4
  }
};
