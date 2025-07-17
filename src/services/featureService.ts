
import { FEATURES, SUBSCRIPTION_TIERS, ROLES, type FeatureId, type SubscriptionTier, type UserRole, type Feature, type SubscriptionTierConfig, type RoleConfig, type FeatureCategory } from '@/config/features';

export interface CreateFeatureRequest {
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

export interface UpdateFeatureRequest extends Partial<CreateFeatureRequest> {
  id: FeatureId;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  scope: 'platform' | 'organization' | 'team';
  inheritsFrom?: UserRole[];
  canManageRoles?: UserRole[];
}

export interface UpdateRoleRequest extends Partial<CreateRoleRequest> {
  id: UserRole;
}

export interface CreateTierRequest {
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: FeatureId[];
  userLimit: number | 'unlimited';
  orgLimit: number | 'unlimited';
  priority: number;
}

export interface UpdateTierRequest extends Partial<CreateTierRequest> {
  id: SubscriptionTier;
}

class FeatureService {
  private features: Record<FeatureId, Feature> = { ...FEATURES };
  private tiers: Record<SubscriptionTier, SubscriptionTierConfig> = { ...SUBSCRIPTION_TIERS };
  private roles: Record<UserRole, RoleConfig> = { ...ROLES };

  // Feature CRUD Operations
  async createFeature(data: CreateFeatureRequest): Promise<Feature> {
    const id = data.name.toLowerCase().replace(/\s+/g, '_') as FeatureId;
    
    const newFeature: Feature = {
      id,
      name: data.name,
      description: data.description,
      category: data.category,
      minimumTier: data.minimumTier,
      allowedTiers: data.allowedTiers,
      requiredRoles: data.requiredRoles,
      isActive: data.isActive,
      isComingSoon: data.isComingSoon,
      usageLimit: data.usageLimit
    };

    this.features[id] = newFeature;
    this.notifyChange('feature_created', newFeature);
    return newFeature;
  }

  async updateFeature(data: UpdateFeatureRequest): Promise<Feature> {
    const existing = this.features[data.id];
    if (!existing) throw new Error(`Feature ${data.id} not found`);

    const updated = { ...existing, ...data };
    this.features[data.id] = updated;
    this.notifyChange('feature_updated', updated);
    return updated;
  }

  async deleteFeature(id: FeatureId): Promise<void> {
    const feature = this.features[id];
    if (!feature) throw new Error(`Feature ${id} not found`);

    delete this.features[id];
    this.notifyChange('feature_deleted', { id });
  }

  async getFeature(id: FeatureId): Promise<Feature | null> {
    return this.features[id] || null;
  }

  async getAllFeatures(): Promise<Feature[]> {
    return Object.values(this.features);
  }

  // Role CRUD Operations
  async createRole(data: CreateRoleRequest): Promise<RoleConfig> {
    const id = data.name.toLowerCase().replace(/\s+/g, '_') as UserRole;
    
    const newRole: RoleConfig = {
      id,
      name: data.name,
      description: data.description,
      scope: data.scope,
      inheritsFrom: data.inheritsFrom,
      canManageRoles: data.canManageRoles
    };

    this.roles[id] = newRole;
    this.notifyChange('role_created', newRole);
    return newRole;
  }

  async updateRole(data: UpdateRoleRequest): Promise<RoleConfig> {
    const existing = this.roles[data.id];
    if (!existing) throw new Error(`Role ${data.id} not found`);

    const updated = { ...existing, ...data };
    this.roles[data.id] = updated;
    this.notifyChange('role_updated', updated);
    return updated;
  }

  async deleteRole(id: UserRole): Promise<void> {
    const role = this.roles[id];
    if (!role) throw new Error(`Role ${id} not found`);

    // Check if role is being used by features
    const featuresUsingRole = Object.values(this.features).filter(f => f.requiredRoles.includes(id));
    if (featuresUsingRole.length > 0) {
      throw new Error(`Cannot delete role ${id}. It's being used by ${featuresUsingRole.length} features`);
    }

    delete this.roles[id];
    this.notifyChange('role_deleted', { id });
  }

  async getRole(id: UserRole): Promise<RoleConfig | null> {
    return this.roles[id] || null;
  }

  async getAllRoles(): Promise<RoleConfig[]> {
    return Object.values(this.roles);
  }

  // Subscription Tier CRUD Operations
  async createTier(data: CreateTierRequest): Promise<SubscriptionTierConfig> {
    const id = data.name.toLowerCase().replace(/\s+/g, '_') as SubscriptionTier;
    
    const newTier: SubscriptionTierConfig = {
      id,
      name: data.name,
      price: data.price,
      billingPeriod: data.billingPeriod,
      features: data.features,
      userLimit: data.userLimit,
      orgLimit: data.orgLimit,
      priority: data.priority
    };

    this.tiers[id] = newTier;
    this.notifyChange('tier_created', newTier);
    return newTier;
  }

  async updateTier(data: UpdateTierRequest): Promise<SubscriptionTierConfig> {
    const existing = this.tiers[data.id];
    if (!existing) throw new Error(`Tier ${data.id} not found`);

    const updated = { ...existing, ...data };
    this.tiers[data.id] = updated;
    this.notifyChange('tier_updated', updated);
    return updated;
  }

  async deleteTier(id: SubscriptionTier): Promise<void> {
    const tier = this.tiers[id];
    if (!tier) throw new Error(`Tier ${id} not found`);

    // Check if tier is being used by features
    const featuresUsingTier = Object.values(this.features).filter(f => f.allowedTiers.includes(id));
    if (featuresUsingTier.length > 0) {
      throw new Error(`Cannot delete tier ${id}. It's being used by ${featuresUsingTier.length} features`);
    }

    delete this.tiers[id];
    this.notifyChange('tier_deleted', { id });
  }

  async getTier(id: SubscriptionTier): Promise<SubscriptionTierConfig | null> {
    return this.tiers[id] || null;
  }

  async getAllTiers(): Promise<SubscriptionTierConfig[]> {
    return Object.values(this.tiers);
  }

  // Bulk Operations
  async bulkUpdateFeatureRoles(featureIds: FeatureId[], roleId: UserRole, add: boolean): Promise<void> {
    for (const featureId of featureIds) {
      const feature = this.features[featureId];
      if (feature) {
        if (add) {
          feature.requiredRoles = [...new Set([...feature.requiredRoles, roleId])];
        } else {
          feature.requiredRoles = feature.requiredRoles.filter(r => r !== roleId);
        }
      }
    }
    this.notifyChange('bulk_feature_roles_updated', { featureIds, roleId, add });
  }

  async bulkUpdateFeatureTiers(featureIds: FeatureId[], tierId: SubscriptionTier, add: boolean): Promise<void> {
    for (const featureId of featureIds) {
      const feature = this.features[featureId];
      if (feature) {
        if (add) {
          feature.allowedTiers = [...new Set([...feature.allowedTiers, tierId])];
        } else {
          feature.allowedTiers = feature.allowedTiers.filter(t => t !== tierId);
        }
      }
    }
    this.notifyChange('bulk_feature_tiers_updated', { featureIds, tierId, add });
  }

  // RBAC Management
  async assignUserToRole(userId: string, roleId: UserRole, orgId?: string): Promise<void> {
    // This would typically interact with a user management service
    console.log(`Assigning user ${userId} to role ${roleId} in org ${orgId || 'default'}`);
    this.notifyChange('user_role_assigned', { userId, roleId, orgId });
  }

  async removeUserFromRole(userId: string, roleId: UserRole, orgId?: string): Promise<void> {
    console.log(`Removing user ${userId} from role ${roleId} in org ${orgId || 'default'}`);
    this.notifyChange('user_role_removed', { userId, roleId, orgId });
  }

  async getUserRoles(userId: string, orgId?: string): Promise<UserRole[]> {
    // Mock implementation - in real app, this would fetch from database
    return ['member'];
  }

  async getOrgUsers(orgId: string): Promise<Array<{ id: string; name: string; email: string; roles: UserRole[] }>> {
    // Mock implementation
    return [
      { id: '1', name: 'John Doe', email: 'john@example.com', roles: ['org_admin'] },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', roles: ['team_admin'] },
      { id: '3', name: 'Bob Wilson', email: 'bob@example.com', roles: ['member'] }
    ];
  }

  // Event notification system
  private notifyChange(event: string, data: any): void {
    window.dispatchEvent(new CustomEvent('featureServiceChange', { detail: { event, data } }));
  }

  // Validation methods
  validateFeature(data: Partial<CreateFeatureRequest>): string[] {
    const errors: string[] = [];
    
    if (!data.name || data.name.trim().length < 3) {
      errors.push('Feature name must be at least 3 characters');
    }
    
    if (!data.description || data.description.trim().length < 10) {
      errors.push('Feature description must be at least 10 characters');
    }
    
    if (!data.category) {
      errors.push('Feature category is required');
    }
    
    if (!data.minimumTier) {
      errors.push('Minimum tier is required');
    }
    
    if (!data.allowedTiers || data.allowedTiers.length === 0) {
      errors.push('At least one allowed tier is required');
    }
    
    if (!data.requiredRoles || data.requiredRoles.length === 0) {
      errors.push('At least one required role is required');
    }
    
    return errors;
  }

  validateRole(data: Partial<CreateRoleRequest>): string[] {
    const errors: string[] = [];
    
    if (!data.name || data.name.trim().length < 3) {
      errors.push('Role name must be at least 3 characters');
    }
    
    if (!data.description || data.description.trim().length < 10) {
      errors.push('Role description must be at least 10 characters');
    }
    
    if (!data.scope) {
      errors.push('Role scope is required');
    }
    
    return errors;
  }

  validateTier(data: Partial<CreateTierRequest>): string[] {
    const errors: string[] = [];
    
    if (!data.name || data.name.trim().length < 3) {
      errors.push('Tier name must be at least 3 characters');
    }
    
    if (data.price === undefined || data.price < 0) {
      errors.push('Valid price is required');
    }
    
    if (!data.billingPeriod) {
      errors.push('Billing period is required');
    }
    
    if (data.priority === undefined || data.priority < 1) {
      errors.push('Valid priority is required');
    }
    
    return errors;
  }
}

export const featureService = new FeatureService();
