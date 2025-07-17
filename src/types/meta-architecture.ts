
// Meta Architecture Core Types
export type IndustryType = 'healthcare' | 'beauty' | 'fitness' | 'education' | 'consulting' | 'legal' | 'finance' | 'retail';
export type ServiceCategory = 'appointment' | 'consultation' | 'class' | 'workshop' | 'therapy' | 'training';
export type PlatformPlan = 'freemium' | 'advanced' | 'professional' | 'enterprise';
export type UserRole = 'end_user' | 'team_admin' | 'org_admin' | 'platform_admin';
export type JourneyStage = 'visitor' | 'registered' | 'onboarding' | 'active' | 'engaged' | 'power_user' | 'churning' | 'dormant';
export type AbuseLevel = 'low' | 'medium' | 'high' | 'critical';
export type ComplianceRegion = 'us' | 'eu' | 'uk' | 'apac' | 'global';

// 1. MetaFoundation - Immutable Platform Truth
export interface MetaFoundation {
  version: string;
  lastUpdated: string;
  industries: Record<IndustryType, IndustryConfig>;
  plans: Record<PlatformPlan, PlanConfig>;
  roles: Record<UserRole, RoleConfig>;
  aiCapabilities: AICapabilityConfig;
  trustFlags: TrustFlagConfig;
  bookingDefaults: BookingDefaultConfig;
}

export interface IndustryConfig {
  id: IndustryType;
  name: string;
  subcategories: ServiceSubcategory[];
  defaultServices: ServiceTemplate[];
  priceBuckets: PriceBucket[];
  complianceRequirements: ComplianceRegion[];
  defaultGovernanceRules: string[];
}

export interface ServiceSubcategory {
  id: string;
  name: string;
  category: ServiceCategory;
  templates: ServiceTemplate[];
  aiSuggestions: boolean;
}

export interface ServiceTemplate {
  id: string;
  name: string;
  duration: number;
  defaultPrice: number;
  category: ServiceCategory;
  aiOptimizable: boolean;
}

export interface PriceBucket {
  tier: 'budget' | 'standard' | 'premium' | 'luxury';
  min: number;
  max: number;
  currency: string;
}

// 2. MetaJourney - User Lifecycle Orchestration
export interface MetaJourney {
  onboardingSteps: OnboardingStep[];
  journeyStages: Record<JourneyStage, JourneyStageConfig>;
  transitionCheckpoints: TransitionCheckpoint[];
  aiUnlockTriggers: AIUnlockTrigger[];
  progressionPrompts: ProgressionPrompt[];
  intentPaths: IntentPath[];
}

export interface OnboardingStep {
  id: string;
  stage: JourneyStage;
  title: string;
  description: string;
  requiredActions: string[];
  aiAssistanceLevel: 'none' | 'suggestions' | 'guided' | 'automated';
  completionCriteria: Record<string, any>;
  nextStep?: string;
}

export interface JourneyStageConfig {
  stage: JourneyStage;
  name: string;
  description: string;
  entryConditions: Record<string, any>;
  availableFeatures: string[];
  aiCapabilities: string[];
  transitionTriggers: string[];
  engagementStrategies: string[];
}

export interface TransitionCheckpoint {
  fromStage: JourneyStage;
  toStage: JourneyStage;
  conditions: Record<string, any>;
  aiValidation: boolean;
  requiredScore?: number;
}

// 3. MetaFeatureFlags - Context-Aware Feature Control
export interface MetaFeatureFlags {
  globalFlags: Record<string, GlobalFlag>;
  tieredFlags: Record<string, TieredFlag>;
  betaFlags: Record<string, BetaFlag>;
  conditionalTrees: ConditionalLogicTree[];
}

export interface GlobalFlag {
  id: string;
  enabled: boolean;
  description: string;
  rolloutPercentage: number;
  targetAudience: 'all' | 'beta' | 'premium' | 'admin';
}

export interface TieredFlag {
  id: string;
  description: string;
  planAccess: Record<PlatformPlan, boolean>;
  roleAccess: Record<UserRole, boolean>;
  journeyStageAccess: Record<JourneyStage, boolean>;
}

export interface ConditionalLogicTree {
  id: string;
  featureId: string;
  conditions: LogicCondition[];
  operator: 'AND' | 'OR';
  fallback: boolean;
}

export interface LogicCondition {
  type: 'plan' | 'role' | 'stage' | 'custom';
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

// 4. MetaGovernance - Operational Rules
export interface MetaGovernance {
  cancellationPolicies: Record<IndustryType, CancellationPolicy>;
  reschedulingPolicies: Record<IndustryType, ReschedulingPolicy>;
  refundModels: Record<PlatformPlan, RefundModel>;
  walletLogic: WalletLogic;
  notificationRules: NotificationRule[];
  engagementCadences: EngagementCadence[];
}

export interface CancellationPolicy {
  industryId: IndustryType;
  freeWindow: number; // hours
  penaltyStructure: PenaltyTier[];
  refundEligibility: RefundEligibility;
  overrides: Record<PlatformPlan, Partial<CancellationPolicy>>;
}

export interface NotificationRule {
  id: string;
  trigger: string;
  timing: NotificationTiming;
  channels: ('email' | 'sms' | 'push' | 'in_app')[];
  personalization: boolean;
  aiOptimization: boolean;
}

// 5. MetaProtection - Security & Abuse Prevention
export interface MetaProtection {
  authenticationModes: AuthMode[];
  sessionPolicies: SessionPolicy;
  ipFingerprinting: IPFingerprintConfig;
  botDetection: BotDetectionConfig;
  rateLimiting: RateLimitRule[];
  abuseResponse: AbuseResponsePolicy[];
}

export interface AuthMode {
  id: string;
  type: 'password' | 'oauth' | 'magic_link' | 'biometric' | 'mfa';
  enabled: boolean;
  industries: IndustryType[];
  minimumPlan: PlatformPlan;
  securityLevel: 'basic' | 'enhanced' | 'maximum';
}

export interface RateLimitRule {
  id: string;
  endpoint: string;
  limit: number;
  window: number; // seconds
  byUser: boolean;
  byIP: boolean;
  overrides: Record<UserRole, Partial<RateLimitRule>>;
}

export interface AbuseResponsePolicy {
  trigger: string;
  severity: AbuseLevel;
  actions: AbuseAction[];
  escalationPath: string[];
  aiAnalysis: boolean;
}

// 6. MetaIntelligence - AI Orchestration
export interface MetaIntelligence {
  smartScheduling: SmartSchedulingConfig;
  intentRecognition: {
    enabled: boolean;
    confidenceThreshold: number;
    supportedIntents: string[];
    fallbackHandling: boolean;
    learningMode: boolean;
  };
  suggestionEngines: SuggestionEngine[];
  telemetryStreams: TelemetryStream[];
  nudgeTriggers: NudgeTrigger[];
  aiPromptMapping: AIPromptMap[];
  learningLoops: LearningLoop[];
}

export interface SmartSchedulingConfig {
  enabled: boolean;
  algorithms: SchedulingAlgorithm[];
  optimizationGoals: OptimizationGoal[];
  learningEnabled: boolean;
  minimumPlan: PlatformPlan;
}

export interface SuggestionEngine {
  id: string;
  type: 'service' | 'pricing' | 'scheduling' | 'upsell' | 'retention';
  model: string;
  confidence_threshold: number;
  personalization: boolean;
  A_B_testing: boolean;
}

export interface AIPromptMap {
  context: string;
  role: UserRole;
  stage: JourneyStage;
  prompts: Record<string, string>;
  variables: string[];
}

// 7. MetaCompliance - Regulatory Adherence
export interface MetaCompliance {
  dataResidency: Record<ComplianceRegion, DataResidencyRule>;
  jurisdictionRules: JurisdictionRule[];
  privacyPreferences: {
    consentTypes: Array<{
      id: string;
      name: string;
      required: boolean;
      category: string;
      description: string;
    }>;
    defaultSettings: Record<string, boolean>;
    granularControls: boolean;
    withdrawalProcess: string;
    consentRefreshPeriod: number;
  };
  localeMetadata: Record<string, LocaleConfig>;
  auditTrails: AuditTrailConfig;
  consentTracking: ConsentTrackingConfig;
  anonymizationLogic: AnonymizationRule[];
}

export interface DataResidencyRule {
  region: ComplianceRegion;
  dataTypes: string[];
  storageRequirements: string[];
  transferRestrictions: string[];
  retentionPeriods: Record<string, number>;
}

export interface JurisdictionRule {
  region: ComplianceRegion;
  industries: IndustryType[];
  requirements: ComplianceRequirement[];
  certifications: string[];
  localPartners: string[];
}

export interface ComplianceRequirement {
  id: string;
  type: 'gdpr' | 'hipaa' | 'ccpa' | 'sox' | 'pci' | 'custom';
  mandatory: boolean;
  implementationLevel: 'basic' | 'standard' | 'enhanced';
  auditFrequency: number; // days
}

// Supporting Interfaces
export interface PlanConfig {
  id: PlatformPlan;
  name: string;
  price: number;
  features: string[];
  limits: Record<string, number>;
  aiAccess: boolean;
  priority: number;
}

export interface RoleConfig {
  id: UserRole;
  name: string;
  permissions: string[];
  scope: 'platform' | 'organization' | 'team' | 'self';
  hierarchyLevel: number;
}

export interface AICapabilityConfig {
  models: AIModel[];
  features: AIFeature[];
  unlockCriteria: Record<PlatformPlan, string[]>;
}

export interface AIModel {
  id: string;
  name: string;
  type: 'nlp' | 'ml' | 'vision' | 'prediction';
  minimumPlan: PlatformPlan;
  costPerRequest: number;
}

export interface TrustFlagConfig {
  verification_levels: VerificationLevel[];
  trust_signals: TrustSignal[];
  scoring_algorithm: string;
}

export interface BookingDefaultConfig {
  industries: Record<IndustryType, IndustryBookingDefaults>;
  global: GlobalBookingDefaults;
}

// Additional supporting types
export interface PenaltyTier {
  hoursBeforeEvent: number;
  penaltyPercentage: number;
  minimumFee: number;
}

export interface RefundEligibility {
  timeWindow: number;
  conditions: string[];
  exceptions: string[];
}

export interface NotificationTiming {
  offset: number; // minutes before/after event
  repeat: boolean;
  maxAttempts: number;
}

export interface SessionPolicy {
  maxDuration: number;
  idleTimeout: number;
  concurrentSessions: number;
  ipValidation: boolean;
}

export interface IPFingerprintConfig {
  enabled: boolean;
  trackingDuration: number;
  suspiciousThreshold: number;
  blockingEnabled: boolean;
}

export interface BotDetectionConfig {
  enabled: boolean;
  mechanisms: string[];
  captchaThreshold: number;
  challengeTypes: string[];
}

export interface AbuseAction {
  type: 'warn' | 'throttle' | 'suspend' | 'ban' | 'review';
  duration?: number;
  notification: boolean;
  escalate: boolean;
}

export interface SchedulingAlgorithm {
  id: string;
  name: string;
  type: 'availability' | 'optimization' | 'preference' | 'ai_driven';
  weight: number;
}

export interface OptimizationGoal {
  metric: 'utilization' | 'satisfaction' | 'revenue' | 'efficiency';
  weight: number;
  target: number;
}

export interface TelemetryStream {
  id: string;
  events: string[];
  destination: string;
  realtime: boolean;
  anonymize: boolean;
}

export interface NudgeTrigger {
  id: string;
  event: string;
  conditions: Record<string, any>;
  nudgeType: 'suggestion' | 'reminder' | 'upsell' | 'retention';
  timing: 'immediate' | 'delayed' | 'scheduled';
}

export interface LearningLoop {
  id: string;
  inputSources: string[];
  outputTargets: string[];
  learningModel: string;
  feedbackMechanism: string;
}

export interface LocaleConfig {
  locale: string;
  language: string;
  region: ComplianceRegion;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  culturalNorms: Record<string, any>;
}

export interface AuditTrailConfig {
  retention: number; // days
  events: string[];
  detailLevel: 'basic' | 'detailed' | 'comprehensive';
  realtime: boolean;
}

export interface ConsentTrackingConfig {
  types: ConsentType[];
  granular: boolean;
  withdrawal: boolean;
  history: boolean;
}

export interface ConsentType {
  id: string;
  name: string;
  required: boolean;
  category: string;
  description: string;
}

export interface AnonymizationRule {
  dataType: string;
  method: 'hash' | 'encrypt' | 'tokenize' | 'remove';
  trigger: string;
  exceptions: string[];
}

export interface VerificationLevel {
  level: string;
  requirements: string[];
  benefits: string[];
  validityPeriod: number;
}

export interface TrustSignal {
  id: string;
  name: string;
  weight: number;
  calculation: string;
}

export interface IndustryBookingDefaults {
  defaultDuration: number;
  bufferTime: number;
  advanceBooking: number;
  cancellationWindow: number;
  reschedulingWindow: number;
}

export interface GlobalBookingDefaults {
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };
  weekends: boolean;
  holidays: string[];
}

export interface AIFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  minimumPlan: PlatformPlan;
  betaAccess: boolean;
}

export interface AIUnlockTrigger {
  id: string;
  featureId: string;
  conditions: Record<string, any>;
  stage: JourneyStage;
  plan: PlatformPlan;
}

export interface ProgressionPrompt {
  id: string;
  stage: JourneyStage;
  nextStage: JourneyStage;
  message: string;
  actionRequired: string;
  aiPersonalized: boolean;
}

export interface IntentPath {
  id: string;
  intent: string;
  entryPoints: string[];
  steps: string[];
  exitCriteria: Record<string, any>;
  aiOptimized: boolean;
}

export interface BetaFlag {
  id: string;
  description: string;
  eligibility: BetaEligibility;
  rolloutPhase: 'alpha' | 'beta' | 'rc' | 'stable';
  feedback: boolean;
}

export interface BetaEligibility {
  plans: PlatformPlan[];
  roles: UserRole[];
  stages: JourneyStage[];
  customCriteria?: Record<string, any>;
}

export interface RefundModel {
  plan: PlatformPlan;
  timeWindows: RefundWindow[];
  conditions: string[];
  processing: RefundProcessing;
}

export interface RefundWindow {
  days: number;
  percentage: number;
  conditions: string[];
}

export interface RefundProcessing {
  automatic: boolean;
  reviewRequired: boolean;
  timeframe: number; // days
}

export interface WalletLogic {
  enabled: boolean;
  tokenTypes: TokenType[];
  lockingRules: LockingRule[];
  redemption: RedemptionRule[];
}

export interface TokenType {
  id: string;
  name: string;
  type: 'credit' | 'loyalty' | 'promotional' | 'cashback';
  expiry: number; // days
  transferable: boolean;
}

export interface LockingRule {
  trigger: string;
  duration: number; // hours
  reason: string;
  override: UserRole[];
}

export interface RedemptionRule {
  tokenType: string;
  minimumAmount: number;
  conditions: string[];
  restrictions: string[];
}

export interface EngagementCadence {
  id: string;
  stage: JourneyStage;
  touchpoints: Touchpoint[];
  frequency: string;
  channels: string[];
  aiOptimized: boolean;
}

export interface Touchpoint {
  type: string;
  timing: string;
  content: string;
  personalized: boolean;
  actionRequired: boolean;
}

export interface ReschedulingPolicy {
  industryId: IndustryType;
  allowedChanges: number;
  timeWindow: number; // hours
  feeStructure: FeeStructure[];
  restrictions: string[];
}

export interface FeeStructure {
  changeNumber: number;
  fee: number;
  feeType: 'fixed' | 'percentage';
}
