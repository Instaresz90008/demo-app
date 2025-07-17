import { MetaGovernance } from '@/types/meta-architecture';

export function getDefaultGovernance(): MetaGovernance {
  return {
    cancellationPolicies: {
      healthcare: {
        industryId: 'healthcare',
        freeWindow: 24,
        penaltyStructure: [
          { hoursBeforeEvent: 24, penaltyPercentage: 0, minimumFee: 0 },
          { hoursBeforeEvent: 12, penaltyPercentage: 50, minimumFee: 25 },
          { hoursBeforeEvent: 2, penaltyPercentage: 100, minimumFee: 50 }
        ],
        refundEligibility: {
          timeWindow: 24,
          conditions: ['medical_emergency', 'provider_cancellation'],
          exceptions: ['no_show', 'repeated_cancellations']
        },
        overrides: {
          freemium: {
            freeWindow: 12,
            penaltyStructure: [
              { hoursBeforeEvent: 12, penaltyPercentage: 0, minimumFee: 0 },
              { hoursBeforeEvent: 0, penaltyPercentage: 100, minimumFee: 25 }
            ]
          },
          advanced: {
            freeWindow: 24,
            penaltyStructure: [
              { hoursBeforeEvent: 24, penaltyPercentage: 0, minimumFee: 0 },
              { hoursBeforeEvent: 12, penaltyPercentage: 50, minimumFee: 15 }
            ]
          },
          professional: {
            freeWindow: 48,
            penaltyStructure: [
              { hoursBeforeEvent: 48, penaltyPercentage: 0, minimumFee: 0 },
              { hoursBeforeEvent: 24, penaltyPercentage: 25, minimumFee: 15 }
            ]
          },
          enterprise: {
            freeWindow: 72,
            penaltyStructure: [
              { hoursBeforeEvent: 72, penaltyPercentage: 0, minimumFee: 0 }
            ]
          }
        }
      },
      beauty: {
        industryId: 'beauty',
        freeWindow: 12,
        penaltyStructure: [
          { hoursBeforeEvent: 12, penaltyPercentage: 0, minimumFee: 0 },
          { hoursBeforeEvent: 4, penaltyPercentage: 50, minimumFee: 20 },
          { hoursBeforeEvent: 1, penaltyPercentage: 100, minimumFee: 30 }
        ],
        refundEligibility: {
          timeWindow: 12,
          conditions: ['service_unavailable', 'quality_issues'],
          exceptions: ['no_show']
        },
        overrides: {
          freemium: { freeWindow: 6, penaltyStructure: [] },
          advanced: { freeWindow: 8, penaltyStructure: [] },
          professional: { freeWindow: 12, penaltyStructure: [] },
          enterprise: { freeWindow: 12, penaltyStructure: [] }
        }
      },
      fitness: {
        industryId: 'fitness',
        freeWindow: 6,
        penaltyStructure: [
          { hoursBeforeEvent: 6, penaltyPercentage: 0, minimumFee: 0 },
          { hoursBeforeEvent: 2, penaltyPercentage: 100, minimumFee: 15 }
        ],
        refundEligibility: {
          timeWindow: 6,
          conditions: ['injury', 'illness'],
          exceptions: ['no_show']
        },
        overrides: {
          freemium: { freeWindow: 3, penaltyStructure: [] },
          advanced: { freeWindow: 4, penaltyStructure: [] },
          professional: { freeWindow: 6, penaltyStructure: [] },
          enterprise: { freeWindow: 8, penaltyStructure: [] }
        }
      },
      education: {
        industryId: 'education',
        freeWindow: 4,
        penaltyStructure: [
          { hoursBeforeEvent: 4, penaltyPercentage: 0, minimumFee: 0 },
          { hoursBeforeEvent: 1, penaltyPercentage: 50, minimumFee: 10 }
        ],
        refundEligibility: {
          timeWindow: 4,
          conditions: ['emergency', 'technical_issues'],
          exceptions: ['no_show']
        },
        overrides: {
          freemium: { freeWindow: 2, penaltyStructure: [] },
          advanced: { freeWindow: 3, penaltyStructure: [] },
          professional: { freeWindow: 4, penaltyStructure: [] },
          enterprise: { freeWindow: 6, penaltyStructure: [] }
        }
      },
      consulting: {
        industryId: 'consulting',
        freeWindow: 48,
        penaltyStructure: [
          { hoursBeforeEvent: 48, penaltyPercentage: 0, minimumFee: 0 },
          { hoursBeforeEvent: 24, penaltyPercentage: 50, minimumFee: 100 },
          { hoursBeforeEvent: 4, penaltyPercentage: 100, minimumFee: 200 }
        ],
        refundEligibility: {
          timeWindow: 48,
          conditions: ['client_emergency', 'consultant_unavailable'],
          exceptions: ['no_show', 'repeated_cancellations']
        },
        overrides: {
          freemium: { freeWindow: 24, penaltyStructure: [] },
          advanced: { freeWindow: 36, penaltyStructure: [] },
          professional: { freeWindow: 48, penaltyStructure: [] },
          enterprise: { freeWindow: 72, penaltyStructure: [] }
        }
      },
      legal: {
        industryId: 'legal',
        freeWindow: 48,
        penaltyStructure: [
          { hoursBeforeEvent: 48, penaltyPercentage: 0, minimumFee: 0 },
          { hoursBeforeEvent: 24, penaltyPercentage: 75, minimumFee: 150 },
          { hoursBeforeEvent: 4, penaltyPercentage: 100, minimumFee: 250 }
        ],
        refundEligibility: {
          timeWindow: 48,
          conditions: ['legal_emergency', 'attorney_conflict'],
          exceptions: ['no_show', 'client_misconduct']
        },
        overrides: {
          freemium: { freeWindow: 24, penaltyStructure: [] },
          advanced: { freeWindow: 36, penaltyStructure: [] },
          professional: { freeWindow: 48, penaltyStructure: [] },
          enterprise: { freeWindow: 72, penaltyStructure: [] }
        }
      },
      finance: {
        industryId: 'finance',
        freeWindow: 24,
        penaltyStructure: [
          { hoursBeforeEvent: 24, penaltyPercentage: 0, minimumFee: 0 },
          { hoursBeforeEvent: 12, penaltyPercentage: 50, minimumFee: 75 },
          { hoursBeforeEvent: 2, penaltyPercentage: 100, minimumFee: 150 }
        ],
        refundEligibility: {
          timeWindow: 24,
          conditions: ['market_emergency', 'advisor_unavailable'],
          exceptions: ['no_show']
        },
        overrides: {
          freemium: { freeWindow: 12, penaltyStructure: [] },
          advanced: { freeWindow: 18, penaltyStructure: [] },
          professional: { freeWindow: 24, penaltyStructure: [] },
          enterprise: { freeWindow: 36, penaltyStructure: [] }
        }
      },
      retail: {
        industryId: 'retail',
        freeWindow: 2,
        penaltyStructure: [
          { hoursBeforeEvent: 2, penaltyPercentage: 0, minimumFee: 0 },
          { hoursBeforeEvent: 0.5, penaltyPercentage: 100, minimumFee: 25 }
        ],
        refundEligibility: {
          timeWindow: 2,
          conditions: ['store_closure', 'product_unavailable'],
          exceptions: ['no_show']
        },
        overrides: {
          freemium: { freeWindow: 1, penaltyStructure: [] },
          advanced: { freeWindow: 1.5, penaltyStructure: [] },
          professional: { freeWindow: 2, penaltyStructure: [] },
          enterprise: { freeWindow: 4, penaltyStructure: [] }
        }
      }
    },
    reschedulingPolicies: {
      healthcare: {
        industryId: 'healthcare',
        allowedChanges: 3,
        timeWindow: 12,
        feeStructure: [
          { changeNumber: 1, fee: 0, feeType: 'fixed' },
          { changeNumber: 2, fee: 15, feeType: 'fixed' },
          { changeNumber: 3, fee: 25, feeType: 'fixed' }
        ],
        restrictions: ['same_provider', 'within_30_days']
      },
      beauty: {
        industryId: 'beauty',
        allowedChanges: 2,
        timeWindow: 6,
        feeStructure: [
          { changeNumber: 1, fee: 0, feeType: 'fixed' },
          { changeNumber: 2, fee: 10, feeType: 'fixed' }
        ],
        restrictions: ['same_stylist']
      },
      fitness: {
        industryId: 'fitness',
        allowedChanges: 2,
        timeWindow: 3,
        feeStructure: [
          { changeNumber: 1, fee: 0, feeType: 'fixed' },
          { changeNumber: 2, fee: 5, feeType: 'fixed' }
        ],
        restrictions: ['same_class_type']
      },
      education: {
        industryId: 'education',
        allowedChanges: 2,
        timeWindow: 2,
        feeStructure: [
          { changeNumber: 1, fee: 0, feeType: 'fixed' },
          { changeNumber: 2, fee: 5, feeType: 'fixed' }
        ],
        restrictions: ['same_subject']
      },
      consulting: {
        industryId: 'consulting',
        allowedChanges: 2,
        timeWindow: 24,
        feeStructure: [
          { changeNumber: 1, fee: 0, feeType: 'fixed' },
          { changeNumber: 2, fee: 50, feeType: 'fixed' }
        ],
        restrictions: ['same_consultant']
      },
      legal: {
        industryId: 'legal',
        allowedChanges: 2,
        timeWindow: 24,
        feeStructure: [
          { changeNumber: 1, fee: 0, feeType: 'fixed' },
          { changeNumber: 2, fee: 100, feeType: 'fixed' }
        ],
        restrictions: ['same_attorney']
      },
      finance: {
        industryId: 'finance',
        allowedChanges: 2,
        timeWindow: 12,
        feeStructure: [
          { changeNumber: 1, fee: 0, feeType: 'fixed' },
          { changeNumber: 2, fee: 35, feeType: 'fixed' }
        ],
        restrictions: ['same_advisor']
      },
      retail: {
        industryId: 'retail',
        allowedChanges: 1,
        timeWindow: 1,
        feeStructure: [
          { changeNumber: 1, fee: 0, feeType: 'fixed' }
        ],
        restrictions: ['same_day_only']
      }
    },
    refundModels: {
      freemium: {
        plan: 'freemium',
        timeWindows: [
          { days: 7, percentage: 100, conditions: ['service_not_provided'] }
        ],
        conditions: ['no_usage', 'technical_issues'],
        processing: {
          automatic: false,
          reviewRequired: true,
          timeframe: 7
        }
      },
      advanced: {
        plan: 'advanced',
        timeWindows: [
          { days: 14, percentage: 100, conditions: ['not_satisfied'] },
          { days: 30, percentage: 50, conditions: ['partial_usage'] }
        ],
        conditions: ['satisfaction_guarantee'],
        processing: {
          automatic: true,
          reviewRequired: false,
          timeframe: 3
        }
      },
      professional: {
        plan: 'professional',
        timeWindows: [
          { days: 30, percentage: 100, conditions: ['any_reason'] },
          { days: 60, percentage: 75, conditions: ['technical_issues'] }
        ],
        conditions: ['money_back_guarantee'],
        processing: {
          automatic: true,
          reviewRequired: false,
          timeframe: 1
        }
      },
      enterprise: {
        plan: 'enterprise',
        timeWindows: [
          { days: 90, percentage: 100, conditions: ['any_reason'] },
          { days: 180, percentage: 50, conditions: ['contract_breach'] }
        ],
        conditions: ['enterprise_guarantee'],
        processing: {
          automatic: true,
          reviewRequired: false,
          timeframe: 1
        }
      }
    },
    walletLogic: {
      enabled: true,
      tokenTypes: [
        {
          id: 'credit',
          name: 'Service Credits',
          type: 'credit',
          expiry: 365,
          transferable: false
        },
        {
          id: 'loyalty',
          name: 'Loyalty Points',
          type: 'loyalty',
          expiry: 730,
          transferable: false
        },
        {
          id: 'promotional',
          name: 'Promotional Credits',
          type: 'promotional',
          expiry: 90,
          transferable: false
        }
      ],
      lockingRules: [
        {
          trigger: 'dispute_opened',
          duration: 168, // 7 days
          reason: 'Payment dispute in progress',
          override: ['platform_admin']
        },
        {
          trigger: 'refund_processing',
          duration: 72, // 3 days
          reason: 'Refund being processed',
          override: ['platform_admin', 'org_admin']
        }
      ],
      redemption: [
        {
          tokenType: 'credit',
          minimumAmount: 10,
          conditions: ['active_account'],
          restrictions: ['same_provider']
        },
        {
          tokenType: 'loyalty',
          minimumAmount: 100,
          conditions: ['verified_account'],
          restrictions: ['participating_providers']
        }
      ]
    },
    notificationRules: [
      {
        id: 'booking_confirmation',
        trigger: 'booking_created',
        timing: {
          offset: 0,
          repeat: false,
          maxAttempts: 1
        },
        channels: ['email', 'sms'],
        personalization: true,
        aiOptimization: false
      },
      {
        id: 'booking_reminder',
        trigger: 'booking_upcoming',
        timing: {
          offset: -60, // 1 hour before
          repeat: true,
          maxAttempts: 2
        },
        channels: ['email', 'push'],
        personalization: true,
        aiOptimization: true
      },
      {
        id: 'cancellation_notification',
        trigger: 'booking_cancelled',
        timing: {
          offset: 0,
          repeat: false,
          maxAttempts: 1
        },
        channels: ['email', 'sms', 'push'],
        personalization: true,
        aiOptimization: false
      }
    ],
    engagementCadences: [
      {
        id: 'onboarding_sequence',
        stage: 'onboarding',
        touchpoints: [
          {
            type: 'welcome_email',
            timing: 'immediate',
            content: 'welcome_template',
            personalized: true,
            actionRequired: false
          },
          {
            type: 'setup_reminder',
            timing: '24_hours',
            content: 'setup_guide',
            personalized: true,
            actionRequired: true
          },
          {
            type: 'feature_introduction',
            timing: '72_hours',
            content: 'feature_tour',
            personalized: true,
            actionRequired: false
          }
        ],
        frequency: 'once',
        channels: ['email', 'in_app'],
        aiOptimized: true
      },
      {
        id: 'retention_sequence',
        stage: 'churning',
        touchpoints: [
          {
            type: 'check_in_email',
            timing: 'immediate',
            content: 'support_offer',
            personalized: true,
            actionRequired: false
          },
          {
            type: 'feature_reminder',
            timing: '48_hours',
            content: 'unused_features',
            personalized: true,
            actionRequired: true
          },
          {
            type: 'win_back_offer',
            timing: '7_days',
            content: 'special_discount',
            personalized: true,
            actionRequired: true
          }
        ],
        frequency: 'as_needed',
        channels: ['email', 'phone'],
        aiOptimized: true
      }
    ]
  };
}
