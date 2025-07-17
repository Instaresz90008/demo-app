
import { PlanType, Feature, UserRole } from '@/config/features';

export interface AccessControlConfig {
  features: Record<string, Feature>;
  roles: Record<UserRole, any>;
  plans: Record<PlanType, any>;
}

export const defaultAccessControlConfig: AccessControlConfig = {
  features: {},
  roles: {} as Record<UserRole, any>,
  plans: {} as Record<PlanType, any>
};
