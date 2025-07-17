
import { 
  MetaFoundation, 
  MetaJourney, 
  MetaFeatureFlags, 
  MetaGovernance, 
  MetaProtection, 
  MetaIntelligence, 
  MetaCompliance,
  IndustryType,
  PlatformPlan,
  UserRole,
  JourneyStage,
  ComplianceRegion
} from '@/types/meta-architecture';

export class MetaArchitectureService {
  private static instance: MetaArchitectureService;
  private foundation: MetaFoundation | null = null;
  private journey: MetaJourney | null = null;
  private featureFlags: MetaFeatureFlags | null = null;
  private governance: MetaGovernance | null = null;
  private protection: MetaProtection | null = null;
  private intelligence: MetaIntelligence | null = null;
  private compliance: MetaCompliance | null = null;
  private initialized = false;

  private constructor() {}

  public static getInstance(): MetaArchitectureService {
    if (!MetaArchitectureService.instance) {
      MetaArchitectureService.instance = new MetaArchitectureService();
    }
    return MetaArchitectureService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('🧠 Initializing Meta Architecture...');
    
    // Load all layers
    await Promise.all([
      this.loadFoundation(),
      this.loadJourney(),
      this.loadFeatureFlags(),
      this.loadGovernance(),
      this.loadProtection(),
      this.loadIntelligence(),
      this.loadCompliance()
    ]);

    this.initialized = true;
    console.log('✅ Meta Architecture initialized successfully');
  }

  // Foundation Layer Access
  public getFoundation(): MetaFoundation | null {
    return this.foundation;
  }

  public getIndustryConfig(industry: IndustryType) {
    return this.foundation?.industries[industry];
  }

  public getPlanConfig(plan: PlatformPlan) {
    return this.foundation?.plans[plan];
  }

  // Journey Layer Access
  public getJourney(): MetaJourney | null {
    return this.journey;
  }

  public getJourneyStage(stage: JourneyStage) {
    return this.journey?.journeyStages[stage];
  }

  public getOnboardingSteps() {
    return this.journey?.onboardingSteps || [];
  }

  // Feature Flags Layer Access
  public getFeatureFlags(): MetaFeatureFlags | null {
    return this.featureFlags;
  }

  public isFeatureEnabled(
    featureId: string, 
    context: {
      plan: PlatformPlan;
      role: UserRole;
      stage: JourneyStage;
    }
  ): boolean {
    if (!this.featureFlags) return false;

    // Check global flags first
    const globalFlag = this.featureFlags.globalFlags[featureId];
    if (globalFlag && !globalFlag.enabled) return false;

    // Check tiered flags
    const tieredFlag = this.featureFlags.tieredFlags[featureId];
    if (tieredFlag) {
      return tieredFlag.planAccess[context.plan] &&
             tieredFlag.roleAccess[context.role] &&
             tieredFlag.journeyStageAccess[context.stage];
    }

    // Check conditional logic trees
    const conditionalTree = this.featureFlags.conditionalTrees.find(
      tree => tree.featureId === featureId
    );
    
    if (conditionalTree) {
      return this.evaluateConditionalTree(conditionalTree, context);
    }

    return true; // Default to enabled if no rules found
  }

  // Governance Layer Access
  public getGovernance(): MetaGovernance | null {
    return this.governance;
  }

  public getCancellationPolicy(industry: IndustryType) {
    return this.governance?.cancellationPolicies[industry];
  }

  public getRefundModel(plan: PlatformPlan) {
    return this.governance?.refundModels[plan];
  }

  // Protection Layer Access
  public getProtection(): MetaProtection | null {
    return this.protection;
  }

  public getRateLimitForEndpoint(endpoint: string, role: UserRole) {
    const rule = this.protection?.rateLimiting.find(r => r.endpoint === endpoint);
    if (!rule) return null;

    const override = rule.overrides[role];
    return override ? { ...rule, ...override } : rule;
  }

  // Intelligence Layer Access
  public getIntelligence(): MetaIntelligence | null {
    return this.intelligence;
  }

  public getSuggestionEngine(type: string) {
    return this.intelligence?.suggestionEngines.find(engine => engine.type === type);
  }

  public getAIPrompt(context: string, role: UserRole, stage: JourneyStage) {
    const promptMap = this.intelligence?.aiPromptMapping.find(
      map => map.context === context && map.role === role && map.stage === stage
    );
    return promptMap?.prompts;
  }

  // Compliance Layer Access
  public getCompliance(): MetaCompliance | null {
    return this.compliance;
  }

  public getDataResidencyRules(region: ComplianceRegion) {
    return this.compliance?.dataResidency[region];
  }

  public getJurisdictionRules(region: ComplianceRegion, industry: IndustryType) {
    return this.compliance?.jurisdictionRules.filter(
      rule => rule.region === region && rule.industries.includes(industry)
    );
  }

  // Cross-Layer Resolver
  public resolveUserContext(userId: string, orgId?: string) {
    // This would typically fetch from database
    // For now, return mock context
    return {
      plan: 'professional' as PlatformPlan,
      role: 'end_user' as UserRole,
      stage: 'active' as JourneyStage,
      industry: 'healthcare' as IndustryType,
      region: 'us' as ComplianceRegion
    };
  }

  public async evaluateFullAccess(
    userId: string,
    featureId: string,
    orgId?: string
  ) {
    const context = this.resolveUserContext(userId, orgId);
    
    return {
      featureEnabled: this.isFeatureEnabled(featureId, context),
      governance: this.getGovernanceRules(context),
      protection: this.getProtectionRules(context),
      compliance: this.getComplianceRules(context),
      intelligence: this.getIntelligenceCapabilities(context)
    };
  }

  // Private helper methods
  private async loadFoundation(): Promise<void> {
    // In production, this would load from database/API
    // For now, load from static config
    const { getDefaultFoundation } = await import('./configs/foundation-config');
    this.foundation = getDefaultFoundation();
  }

  private async loadJourney(): Promise<void> {
    const { getDefaultJourney } = await import('./configs/journey-config');
    this.journey = getDefaultJourney();
  }

  private async loadFeatureFlags(): Promise<void> {
    const { getDefaultFeatureFlags } = await import('./configs/feature-flags-config');
    this.featureFlags = getDefaultFeatureFlags();
  }

  private async loadGovernance(): Promise<void> {
    const { getDefaultGovernance } = await import('./configs/governance-config');
    this.governance = getDefaultGovernance();
  }

  private async loadProtection(): Promise<void> {
    const { getDefaultProtection } = await import('./configs/protection-config');
    this.protection = getDefaultProtection();
  }

  private async loadIntelligence(): Promise<void> {
    const { getDefaultIntelligence } = await import('./configs/intelligence-config');
    this.intelligence = getDefaultIntelligence();
  }

  private async loadCompliance(): Promise<void> {
    const { getDefaultCompliance } = await import('./configs/compliance-config');
    this.compliance = getDefaultCompliance();
  }

  private evaluateConditionalTree(tree: any, context: any): boolean {
    const results = tree.conditions.map((condition: any) => {
      switch (condition.type) {
        case 'plan':
          return this.evaluateCondition(context.plan, condition);
        case 'role':
          return this.evaluateCondition(context.role, condition);
        case 'stage':
          return this.evaluateCondition(context.stage, condition);
        default:
          return false;
      }
    });

    return tree.operator === 'AND' 
      ? results.every(r => r)
      : results.some(r => r);
  }

  private evaluateCondition(value: any, condition: any): boolean {
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'contains':
        return Array.isArray(value) ? value.includes(condition.value) : false;
      case 'greater_than':
        return Number(value) > Number(condition.value);
      case 'less_than':
        return Number(value) < Number(condition.value);
      default:
        return false;
    }
  }

  private getGovernanceRules(context: any) {
    return {
      cancellationPolicy: this.getCancellationPolicy(context.industry),
      refundModel: this.getRefundModel(context.plan),
      notificationRules: this.governance?.notificationRules || []
    };
  }

  private getProtectionRules(context: any) {
    return {
      rateLimits: this.protection?.rateLimiting || [],
      authModes: this.protection?.authenticationModes || [],
      abuseResponse: this.protection?.abuseResponse || []
    };
  }

  private getComplianceRules(context: any) {
    return {
      dataResidency: this.getDataResidencyRules(context.region),
      jurisdiction: this.getJurisdictionRules(context.region, context.industry),
      privacy: this.compliance?.privacyPreferences || {}
    };
  }

  private getIntelligenceCapabilities(context: any) {
    const planConfig = this.getPlanConfig(context.plan);
    return {
      aiEnabled: planConfig?.aiAccess || false,
      suggestionEngines: this.intelligence?.suggestionEngines || [],
      smartScheduling: this.intelligence?.smartScheduling || null
    };
  }
}

export const metaArchitecture = MetaArchitectureService.getInstance();
