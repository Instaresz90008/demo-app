export type AccessStatus = 'allowed' | 'locked' | 'rate_limited' | 'restricted_by_region' | 'trial_expired' | 'hard_denied' | 'enabled';

export type PlanType = 'freemium' | 'advanced' | 'professional' | 'enterprise' | 'free_trial';

export interface AccessEvaluationResult {
  allowed: boolean;
  reason?: string;
  ui_status?: AccessStatus;
  upgrade_required?: {
    required_plan: string;
    upgrade_url: string;
  };
  rate_limit_remaining?: number;
  metadata?: Record<string, any>;
}

export interface AccessEvaluationRequest {
  user_id: string;
  feature_id: string;
  org_id: string;
  context?: Record<string, any>;
}

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  org_id: string;
  roles: string[];
  plan_type: PlanType;
  is_active: boolean;
}

export interface Organization {
  id: string;
  name: string;
  plan_type: PlanType;
  created_at: string;
  is_active: boolean;
  settings: Record<string, any>;
}

export interface Plan {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  billing_period: string;
  features: string[];
  rate_limits: RateLimit[];
  max_users: number;
  trial_days: number;
  is_active: boolean;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  plugin_id?: string;
  region_restricted: boolean;
  allowed_regions: string[];
  rate_limit_enabled: boolean;
  requires_roles: string[];
  minimum_plan: PlanType;
  feature_flags: string[];
  is_active: boolean;
}

export interface Role {
  id: string;
  name: string;
  scope: string;
  description: string;
  permissions: string[];
  plan_requirements: PlanType[];
  is_system_role: boolean;
}

export interface RateLimit {
  feature_id: string;
  plan_type: PlanType;
  limit_count: number;
  limit_period: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PluginUsageLog {
  id: string;
  user_id: string;
  org_id: string;
  plugin_id: string;
  feature_id: string;
  action: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface CalendarPermissionPolicy {
  role: string;
  permissions: import('./calendar').CalendarPermission[];
}

export interface Organization {
  id: string;
  name: string;
  plan_type: PlanType;
  created_at: string;
  is_active: boolean;
  settings: Record<string, any>;
  calendar_permission_policies?: CalendarPermissionPolicy[];
}
