
import { MetaFeatureFlags } from '@/types/meta-architecture';

export function getDefaultFeatureFlags(): MetaFeatureFlags {
  return {
    globalFlags: {
      maintenance_mode: {
        id: 'maintenance_mode',
        enabled: false,
        description: 'Enable maintenance mode across the platform',
        rolloutPercentage: 0,
        targetAudience: 'all'
      },
      beta_features: {
        id: 'beta_features',
        enabled: true,
        description: 'Enable beta feature access',
        rolloutPercentage: 25,
        targetAudience: 'beta'
      },
      ai_features: {
        id: 'ai_features',
        enabled: true,
        description: 'Enable AI-powered features',
        rolloutPercentage: 100,
        targetAudience: 'premium'
      }
    },
    tieredFlags: {
      advanced_analytics: {
        id: 'advanced_analytics',
        description: 'Access to advanced analytics and reporting',
        planAccess: {
          freemium: false,
          advanced: false,
          professional: true,
          enterprise: true
        },
        roleAccess: {
          end_user: false,
          team_admin: true,
          org_admin: true,
          platform_admin: true
        },
        journeyStageAccess: {
          visitor: false,
          registered: false,
          onboarding: false,
          active: false,
          engaged: true,
          power_user: true,
          churning: true,
          dormant: false
        }
      },
      custom_branding: {
        id: 'custom_branding',
        description: 'Custom branding and white-label features',
        planAccess: {
          freemium: false,
          advanced: false,
          professional: true,
          enterprise: true
        },
        roleAccess: {
          end_user: false,
          team_admin: false,
          org_admin: true,
          platform_admin: true
        },
        journeyStageAccess: {
          visitor: false,
          registered: false,
          onboarding: false,
          active: false,
          engaged: true,
          power_user: true,
          churning: false,
          dormant: false
        }
      },
      ai_scheduling: {
        id: 'ai_scheduling',
        description: 'AI-powered smart scheduling optimization',
        planAccess: {
          freemium: false,
          advanced: false,
          professional: true,
          enterprise: true
        },
        roleAccess: {
          end_user: true,
          team_admin: true,
          org_admin: true,
          platform_admin: true
        },
        journeyStageAccess: {
          visitor: false,
          registered: false,
          onboarding: false,
          active: true,
          engaged: true,
          power_user: true,
          churning: true,
          dormant: false
        }
      },
      team_management: {
        id: 'team_management',
        description: 'Team member management and collaboration',
        planAccess: {
          freemium: false,
          advanced: true,
          professional: true,
          enterprise: true
        },
        roleAccess: {
          end_user: false,
          team_admin: true,
          org_admin: true,
          platform_admin: true
        },
        journeyStageAccess: {
          visitor: false,
          registered: false,
          onboarding: false,
          active: true,
          engaged: true,
          power_user: true,
          churning: true,
          dormant: false
        }
      }
    },
    betaFlags: {
      ai_assistant_v2: {
        id: 'ai_assistant_v2',
        description: 'Next generation AI assistant with advanced capabilities',
        eligibility: {
          plans: ['professional', 'enterprise'],
          roles: ['org_admin', 'platform_admin'],
          stages: ['engaged', 'power_user'],
          customCriteria: {
            monthly_bookings: { min: 20 },
            beta_program_member: true
          }
        },
        rolloutPhase: 'beta',
        feedback: true
      },
      voice_booking_interface: {
        id: 'voice_booking_interface',
        description: 'Voice-activated booking interface',
        eligibility: {
          plans: ['enterprise'],
          roles: ['platform_admin'],
          stages: ['power_user']
        },
        rolloutPhase: 'alpha',
        feedback: true
      }
    },
    conditionalTrees: [
      {
        id: 'premium_features_tree',
        featureId: 'premium_features',
        conditions: [
          {
            type: 'plan',
            field: 'plan',
            operator: 'equals',
            value: 'professional'
          },
          {
            type: 'stage',
            field: 'stage',
            operator: 'equals',
            value: 'engaged'
          }
        ],
        operator: 'AND',
        fallback: false
      },
      {
        id: 'trial_features_tree',
        featureId: 'trial_features',
        conditions: [
          {
            type: 'plan',
            field: 'plan',
            operator: 'equals',
            value: 'freemium'
          },
          {
            type: 'custom',
            field: 'trial_eligible',
            operator: 'equals',
            value: true
          }
        ],
        operator: 'AND',
        fallback: false
      }
    ]
  };
}
