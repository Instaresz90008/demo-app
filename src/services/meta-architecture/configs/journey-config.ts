
import { MetaJourney } from '@/types/meta-architecture';

export function getDefaultJourney(): MetaJourney {
  return {
    onboardingSteps: [
      {
        id: 'welcome',
        stage: 'registered',
        title: 'Welcome to the Platform',
        description: 'Get started with your booking platform',
        requiredActions: ['profile_setup'],
        aiAssistanceLevel: 'suggestions',
        completionCriteria: { profile_complete: true },
        nextStep: 'industry_selection'
      },
      {
        id: 'industry_selection',
        stage: 'onboarding',
        title: 'Choose Your Industry',
        description: 'Select your business type for customized experience',
        requiredActions: ['select_industry'],
        aiAssistanceLevel: 'guided',
        completionCriteria: { industry_selected: true },
        nextStep: 'service_setup'
      },
      {
        id: 'service_setup',
        stage: 'onboarding',
        title: 'Create Your First Service',
        description: 'Set up your first bookable service',
        requiredActions: ['create_service'],
        aiAssistanceLevel: 'automated',
        completionCriteria: { services_count: { min: 1 } },
        nextStep: 'calendar_setup'
      },
      {
        id: 'calendar_setup',
        stage: 'onboarding',
        title: 'Configure Your Calendar',
        description: 'Set your availability and working hours',
        requiredActions: ['set_availability'],
        aiAssistanceLevel: 'guided',
        completionCriteria: { availability_configured: true },
        nextStep: 'first_booking'
      },
      {
        id: 'first_booking',
        stage: 'active',
        title: 'Get Your First Booking',
        description: 'Share your booking link and receive your first booking',
        requiredActions: ['share_link', 'receive_booking'],
        aiAssistanceLevel: 'suggestions',
        completionCriteria: { bookings_count: { min: 1 } }
      }
    ],
    journeyStages: {
      visitor: {
        stage: 'visitor',
        name: 'Visitor',
        description: 'Exploring the platform',
        entryConditions: { authenticated: false },
        availableFeatures: ['public_booking', 'service_catalog_view'],
        aiCapabilities: [],
        transitionTriggers: ['signup', 'login'],
        engagementStrategies: ['demo_booking', 'feature_preview']
      },
      registered: {
        stage: 'registered',
        name: 'Registered User',
        description: 'Signed up but not yet onboarded',
        entryConditions: { authenticated: true, onboarding_complete: false },
        availableFeatures: ['profile_setup', 'plan_selection'],
        aiCapabilities: ['onboarding_suggestions'],
        transitionTriggers: ['complete_profile', 'start_onboarding'],
        engagementStrategies: ['welcome_email', 'onboarding_nudge']
      },
      onboarding: {
        stage: 'onboarding',
        name: 'Onboarding',
        description: 'Setting up their account and services',
        entryConditions: { onboarding_started: true, onboarding_complete: false },
        availableFeatures: ['guided_setup', 'ai_assistance', 'template_services'],
        aiCapabilities: ['setup_automation', 'industry_recommendations'],
        transitionTriggers: ['complete_onboarding', 'first_service_created'],
        engagementStrategies: ['progress_tracking', 'completion_incentives']
      },
      active: {
        stage: 'active',
        name: 'Active User',
        description: 'Regularly using core features',
        entryConditions: { onboarding_complete: true, last_login_days: { max: 30 } },
        availableFeatures: ['full_booking_system', 'basic_analytics', 'customer_management'],
        aiCapabilities: ['smart_scheduling', 'booking_optimization'],
        transitionTriggers: ['engagement_increase', 'feature_adoption'],
        engagementStrategies: ['feature_recommendations', 'usage_tips']
      },
      engaged: {
        stage: 'engaged',
        name: 'Engaged User',
        description: 'High usage and feature adoption',
        entryConditions: { monthly_bookings: { min: 10 }, feature_usage_score: { min: 70 } },
        availableFeatures: ['advanced_features', 'integrations', 'custom_branding'],
        aiCapabilities: ['predictive_analytics', 'business_insights'],
        transitionTriggers: ['power_user_behavior', 'team_expansion'],
        engagementStrategies: ['advanced_tutorials', 'beta_features']
      },
      power_user: {
        stage: 'power_user',
        name: 'Power User',
        description: 'Expert user leveraging advanced capabilities',
        entryConditions: { monthly_bookings: { min: 50 }, features_used: { min: 80 } },
        availableFeatures: ['all_features', 'api_access', 'white_label'],
        aiCapabilities: ['full_ai_suite', 'custom_models'],
        transitionTriggers: ['advocacy_behavior', 'referrals'],
        engagementStrategies: ['community_involvement', 'feature_requests']
      },
      churning: {
        stage: 'churning',
        name: 'At Risk',
        description: 'Showing signs of reduced engagement',
        entryConditions: { last_login_days: { min: 14 }, usage_decline: { min: 50 } },
        availableFeatures: ['retention_offers', 'support_priority'],
        aiCapabilities: ['churn_prevention', 'personalized_offers'],
        transitionTriggers: ['re_engagement', 'support_interaction'],
        engagementStrategies: ['win_back_campaigns', 'personal_outreach']
      },
      dormant: {
        stage: 'dormant',
        name: 'Dormant',
        description: 'Inactive for extended period',
        entryConditions: { last_login_days: { min: 60 } },
        availableFeatures: ['reactivation_offers', 'data_export'],
        aiCapabilities: ['reactivation_campaigns'],
        transitionTriggers: ['login', 'email_engagement'],
        engagementStrategies: ['reactivation_series', 'value_reminders']
      }
    },
    transitionCheckpoints: [
      {
        fromStage: 'registered',
        toStage: 'onboarding',
        conditions: { profile_complete: true },
        aiValidation: false
      },
      {
        fromStage: 'onboarding',
        toStage: 'active',
        conditions: { onboarding_complete: true, first_service_created: true },
        aiValidation: true,
        requiredScore: 0.7
      },
      {
        fromStage: 'active',
        toStage: 'engaged',
        conditions: { monthly_bookings: { min: 10 }, feature_usage_score: { min: 70 } },
        aiValidation: true,
        requiredScore: 0.8
      }
    ],
    aiUnlockTriggers: [
      {
        id: 'smart_scheduling_unlock',
        featureId: 'smart_scheduling',
        conditions: { monthly_bookings: { min: 5 } },
        stage: 'active',
        plan: 'professional'
      },
      {
        id: 'predictive_analytics_unlock',
        featureId: 'predictive_analytics',
        conditions: { monthly_bookings: { min: 25 } },
        stage: 'engaged',
        plan: 'enterprise'
      }
    ],
    progressionPrompts: [
      {
        id: 'upgrade_to_advanced',
        stage: 'active',
        nextStage: 'engaged',
        message: 'Ready to unlock advanced features? Upgrade your plan to access AI-powered insights.',
        actionRequired: 'plan_upgrade',
        aiPersonalized: true
      },
      {
        id: 'team_expansion',
        stage: 'engaged',
        nextStage: 'power_user',
        message: 'Growing fast? Add team members to scale your booking operations.',
        actionRequired: 'invite_team_members',
        aiPersonalized: true
      }
    ],
    intentPaths: [
      {
        id: 'quick_booking_setup',
        intent: 'immediate_booking_capability',
        entryPoints: ['signup', 'demo_conversion'],
        steps: ['industry_select', 'service_template', 'calendar_quick_setup', 'share_link'],
        exitCriteria: { first_booking_received: true },
        aiOptimized: true
      },
      {
        id: 'business_growth',
        intent: 'scale_operations',
        entryPoints: ['usage_milestone', 'feature_limit_reached'],
        steps: ['upgrade_prompt', 'feature_tour', 'team_setup', 'advanced_configuration'],
        exitCriteria: { plan_upgraded: true, team_invited: true },
        aiOptimized: true
      }
    ]
  };
}
