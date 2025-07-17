
import { AccessControlEngine } from './AccessControlEngine';
import { 
  AccessEvaluationResult,
  User, 
  Organization, 
  Plan, 
  Feature, 
  PluginUsageLog,
  PlanType 
} from '@/types/access-control';

export class AccessControlService {
  private engine: AccessControlEngine;

  constructor() {
    this.engine = new AccessControlEngine();
  }

  async checkFeatureAccess(
    userId: string,
    featureId: string,
    orgId: string,
    context?: Record<string, any>
  ): Promise<AccessEvaluationResult> {
    return this.engine.evaluateAccess(userId, featureId, orgId, context);
  }

  async getFeatureUIStatus(
    userId: string,
    featureIds: string[],
    orgId: string
  ): Promise<Record<string, AccessEvaluationResult>> {
    return this.engine.getFeatureUIStatus(userId, featureIds, orgId);
  }

  async trackPluginUsage(
    userId: string,
    orgId: string,
    pluginId: string,
    featureId: string,
    action: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    return this.engine.trackPluginUsage(userId, orgId, pluginId, featureId, action, metadata);
  }
}

export const accessControlService = new AccessControlService();
