
import { useState, useEffect } from 'react';
import { metaArchitecture } from '@/services/meta-architecture/MetaArchitectureService';
import { useAuth } from '@/contexts/AuthContext';
import { 
  IndustryType, 
  PlatformPlan, 
  UserRole, 
  JourneyStage,
  ComplianceRegion 
} from '@/types/meta-architecture';

interface UserContext {
  plan: PlatformPlan;
  role: UserRole;
  stage: JourneyStage;
  industry: IndustryType;
  region: ComplianceRegion;
}

export const useMetaArchitecture = () => {
  const { user } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeMeta = async () => {
      try {
        await metaArchitecture.initialize();
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize meta architecture:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeMeta();
  }, []);

  const getUserContext = (): UserContext => {
    // In production, this would come from user profile/organization data
    return {
      plan: (user?.planType as PlatformPlan) || 'freemium',
      role: (user?.roles?.[0] as UserRole) || 'end_user',
      stage: 'active', // This would be determined by user behavior analytics
      industry: 'healthcare', // This would come from organization/user profile
      region: 'us' // This would be determined by IP/user location
    };
  };

  const isFeatureEnabled = (featureId: string): boolean => {
    if (!initialized) return false;
    const context = getUserContext();
    return metaArchitecture.isFeatureEnabled(featureId, context);
  };

  const getIndustryConfig = () => {
    const context = getUserContext();
    return metaArchitecture.getIndustryConfig(context.industry);
  };

  const getPlanConfig = () => {
    const context = getUserContext();
    return metaArchitecture.getPlanConfig(context.plan);
  };

  const getJourneyStage = () => {
    const context = getUserContext();
    return metaArchitecture.getJourneyStage(context.stage);
  };

  const getCancellationPolicy = () => {
    const context = getUserContext();
    return metaArchitecture.getCancellationPolicy(context.industry);
  };

  const getRefundModel = () => {
    const context = getUserContext();
    return metaArchitecture.getRefundModel(context.plan);
  };

  const getRateLimitForEndpoint = (endpoint: string) => {
    const context = getUserContext();
    return metaArchitecture.getRateLimitForEndpoint(endpoint, context.role);
  };

  const getSuggestionEngine = (type: string) => {
    return metaArchitecture.getSuggestionEngine(type);
  };

  const getAIPrompt = (promptContext: string) => {
    const context = getUserContext();
    return metaArchitecture.getAIPrompt(promptContext, context.role, context.stage);
  };

  const getDataResidencyRules = () => {
    const context = getUserContext();
    return metaArchitecture.getDataResidencyRules(context.region);
  };

  const getJurisdictionRules = () => {
    const context = getUserContext();
    return metaArchitecture.getJurisdictionRules(context.region, context.industry);
  };

  const evaluateFullAccess = async (featureId: string) => {
    if (!user) return null;
    return metaArchitecture.evaluateFullAccess(user.id, featureId);
  };

  const getOnboardingSteps = () => {
    return metaArchitecture.getOnboardingSteps();
  };

  const getFoundation = () => {
    return metaArchitecture.getFoundation();
  };

  const getJourney = () => {
    return metaArchitecture.getJourney();
  };

  const getFeatureFlags = () => {
    return metaArchitecture.getFeatureFlags();
  };

  const getGovernance = () => {
    return metaArchitecture.getGovernance();
  };

  const getProtection = () => {
    return metaArchitecture.getProtection();
  };

  const getIntelligence = () => {
    return metaArchitecture.getIntelligence();
  };

  const getCompliance = () => {
    return metaArchitecture.getCompliance();
  };

  return {
    initialized,
    loading,
    
    // Context
    getUserContext,
    
    // Feature Access
    isFeatureEnabled,
    evaluateFullAccess,
    
    // Foundation Layer
    getFoundation,
    getIndustryConfig,
    getPlanConfig,
    
    // Journey Layer
    getJourney,
    getJourneyStage,
    getOnboardingSteps,
    
    // Feature Flags Layer
    getFeatureFlags,
    
    // Governance Layer
    getGovernance,
    getCancellationPolicy,
    getRefundModel,
    
    // Protection Layer
    getProtection,
    getRateLimitForEndpoint,
    
    // Intelligence Layer
    getIntelligence,
    getSuggestionEngine,
    getAIPrompt,
    
    // Compliance Layer
    getCompliance,
    getDataResidencyRules,
    getJurisdictionRules
  };
};
