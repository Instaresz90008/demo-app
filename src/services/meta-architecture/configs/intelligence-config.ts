
import { MetaIntelligence } from '@/types/meta-architecture';

export function getDefaultIntelligence(): MetaIntelligence {
  return {
    smartScheduling: {
      enabled: true,
      algorithms: [
        {
          id: 'availability_optimizer',
          name: 'Availability Optimizer',
          type: 'optimization',
          weight: 0.4
        },
        {
          id: 'preference_matcher',
          name: 'Preference Matcher',
          type: 'preference',
          weight: 0.3
        },
        {
          id: 'ai_predictor',
          name: 'AI Demand Predictor',
          type: 'ai_driven',
          weight: 0.3
        }
      ],
      optimizationGoals: [
        { metric: 'utilization', weight: 0.3, target: 85 },
        { metric: 'satisfaction', weight: 0.4, target: 90 },
        { metric: 'revenue', weight: 0.2, target: 100 },
        { metric: 'efficiency', weight: 0.1, target: 95 }
      ],
      learningEnabled: true,
      minimumPlan: 'professional'
    },
    intentRecognition: {
      enabled: true,
      confidenceThreshold: 0.75,
      supportedIntents: [
        'book_appointment',
        'cancel_booking',
        'reschedule_booking',
        'check_availability',
        'get_pricing',
        'ask_question',
        'request_support'
      ],
      fallbackHandling: true,
      learningMode: true
    },
    suggestionEngines: [
      {
        id: 'service_recommender',
        type: 'service',
        model: 'collaborative_filtering_v2',
        confidence_threshold: 0.6,
        personalization: true,
        A_B_testing: true
      },
      {
        id: 'pricing_optimizer',
        type: 'pricing',
        model: 'dynamic_pricing_v1',
        confidence_threshold: 0.7,
        personalization: true,
        A_B_testing: true
      },
      {
        id: 'scheduling_suggester',
        type: 'scheduling',
        model: 'time_slot_predictor_v1',
        confidence_threshold: 0.8,
        personalization: true,
        A_B_testing: false
      },
      {
        id: 'upsell_engine',
        type: 'upsell',
        model: 'revenue_maximizer_v1',
        confidence_threshold: 0.65,
        personalization: true,
        A_B_testing: true
      },
      {
        id: 'retention_predictor',
        type: 'retention',
        model: 'churn_prevention_v2',
        confidence_threshold: 0.75,
        personalization: true,
        A_B_testing: false
      }
    ],
    telemetryStreams: [
      {
        id: 'user_behavior',
        events: ['page_view', 'click', 'booking_flow', 'search_query'],
        destination: 'analytics_warehouse',
        realtime: true,
        anonymize: true
      },
      {
        id: 'booking_analytics',
        events: ['booking_created', 'booking_cancelled', 'booking_completed'],
        destination: 'booking_insights',
        realtime: true,
        anonymize: false
      },
      {
        id: 'performance_metrics',
        events: ['api_response_time', 'error_rate', 'system_load'],
        destination: 'monitoring_dashboard',
        realtime: true,
        anonymize: true
      },
      {
        id: 'ai_feedback',
        events: ['prediction_accuracy', 'suggestion_acceptance', 'user_satisfaction'],
        destination: 'ml_training_pipeline',
        realtime: false,
        anonymize: true
      }
    ],
    nudgeTriggers: [
      {
        id: 'incomplete_profile_nudge',
        event: 'profile_incomplete_7_days',
        conditions: { profile_completion: { max: 70 } },
        nudgeType: 'suggestion',
        timing: 'delayed'
      },
      {
        id: 'booking_abandonment_nudge',
        event: 'booking_flow_abandoned',
        conditions: { time_in_flow: { min: 120 } },
        nudgeType: 'reminder',
        timing: 'immediate'
      },
      {
        id: 'feature_discovery_nudge',
        event: 'feature_unused_30_days',
        conditions: { plan_tier: ['professional', 'enterprise'] },
        nudgeType: 'suggestion',
        timing: 'scheduled'
      },
      {
        id: 'upgrade_nudge',
        event: 'limit_approaching',
        conditions: { usage_percentage: { min: 80 } },
        nudgeType: 'upsell',
        timing: 'immediate'
      },
      {
        id: 'retention_nudge',
        event: 'engagement_declining',
        conditions: { last_login_days: { min: 14 } },
        nudgeType: 'retention',
        timing: 'delayed'
      }
    ],
    aiPromptMapping: [
      {
        context: 'booking_assistance',
        role: 'end_user',
        stage: 'active',
        prompts: {
          greeting: 'Hello! I\'m here to help you book your appointment. What service are you looking for?',
          availability_check: 'Let me check the available time slots for {service_name} on {preferred_date}.',
          booking_confirmation: 'Perfect! I\'ve booked your {service_name} appointment for {date_time}. You\'ll receive a confirmation email shortly.',
          fallback: 'I\'m not sure I understand. Could you please rephrase your request?'
        },
        variables: ['service_name', 'preferred_date', 'date_time', 'provider_name']
      },
      {
        context: 'onboarding_guidance',
        role: 'end_user',
        stage: 'onboarding',
        prompts: {
          welcome: 'Welcome to your booking platform! Let\'s get you set up in just a few minutes.',
          industry_selection: 'What type of business are you in? This helps me customize your experience.',
          service_creation: 'Great choice! Let\'s create your first bookable service. What would you like to call it?',
          calendar_setup: 'Now let\'s set your availability. When are you typically available for appointments?'
        },
        variables: ['business_type', 'service_name', 'availability_hours']
      },
      {
        context: 'business_insights',
        role: 'org_admin',
        stage: 'engaged',
        prompts: {
          performance_summary: 'Here\'s your business performance summary for {time_period}: {metrics_summary}',
          growth_suggestions: 'Based on your data, here are some opportunities to grow your business: {suggestions}',
          optimization_tips: 'I noticed you could optimize {area}. Here\'s how: {optimization_steps}'
        },
        variables: ['time_period', 'metrics_summary', 'suggestions', 'area', 'optimization_steps']
      },
      {
        context: 'support_assistance',
        role: 'platform_admin',
        stage: 'power_user',
        prompts: {
          issue_analysis: 'I\'ve analyzed the reported issue. Here\'s what I found: {analysis_results}',
          solution_recommendation: 'Based on similar cases, I recommend: {recommended_actions}',
          escalation_summary: 'This issue requires escalation. Summary: {issue_summary}'
        },
        variables: ['analysis_results', 'recommended_actions', 'issue_summary']
      }
    ],
    learningLoops: [
      {
        id: 'booking_optimization_loop',
        inputSources: ['booking_outcomes', 'user_feedback', 'cancellation_patterns'],
        outputTargets: ['scheduling_algorithm', 'availability_suggestions'],
        learningModel: 'reinforcement_learning',
        feedbackMechanism: 'implicit_feedback'
      },
      {
        id: 'pricing_optimization_loop',
        inputSources: ['booking_conversion_rates', 'competitor_pricing', 'demand_patterns'],
        outputTargets: ['dynamic_pricing_model', 'pricing_suggestions'],
        learningModel: 'multi_armed_bandit',
        feedbackMechanism: 'conversion_tracking'
      },
      {
        id: 'user_experience_loop',
        inputSources: ['user_interactions', 'support_tickets', 'satisfaction_scores'],
        outputTargets: ['ui_personalization', 'feature_recommendations'],
        learningModel: 'collaborative_filtering',
        feedbackMechanism: 'explicit_feedback'
      },
      {
        id: 'churn_prevention_loop',
        inputSources: ['usage_patterns', 'engagement_metrics', 'support_interactions'],
        outputTargets: ['retention_campaigns', 'proactive_outreach'],
        learningModel: 'gradient_boosting',
        feedbackMechanism: 'retention_tracking'
      }
    ]
  };
}
