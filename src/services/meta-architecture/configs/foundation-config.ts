
import { 
  MetaFoundation, 
  IndustryType, 
  PlatformPlan,
  UserRole 
} from '@/types/meta-architecture';

export function getDefaultFoundation(): MetaFoundation {
  return {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    industries: {
      healthcare: {
        id: 'healthcare',
        name: 'Healthcare & Wellness',
        subcategories: [
          {
            id: 'medical_consultation',
            name: 'Medical Consultation',
            category: 'consultation',
            templates: [
              {
                id: 'general_checkup',
                name: 'General Health Checkup',
                duration: 30,
                defaultPrice: 150,
                category: 'consultation',
                aiOptimizable: true
              },
              {
                id: 'specialist_consultation',
                name: 'Specialist Consultation',
                duration: 45,
                defaultPrice: 250,
                category: 'consultation',
                aiOptimizable: true
              }
            ],
            aiSuggestions: true
          },
          {
            id: 'therapy_session',
            name: 'Therapy Sessions',
            category: 'therapy',
            templates: [
              {
                id: 'individual_therapy',
                name: 'Individual Therapy',
                duration: 60,
                defaultPrice: 180,
                category: 'therapy',
                aiOptimizable: true
              }
            ],
            aiSuggestions: true
          }
        ],
        defaultServices: [],
        priceBuckets: [
          { tier: 'budget', min: 50, max: 100, currency: 'USD' },
          { tier: 'standard', min: 100, max: 200, currency: 'USD' },
          { tier: 'premium', min: 200, max: 350, currency: 'USD' },
          { tier: 'luxury', min: 350, max: 500, currency: 'USD' }
        ],
        complianceRequirements: ['us', 'eu'],
        defaultGovernanceRules: ['hipaa_compliance', 'patient_privacy', 'medical_records_retention']
      },
      beauty: {
        id: 'beauty',
        name: 'Beauty & Wellness',
        subcategories: [
          {
            id: 'hair_services',
            name: 'Hair Services',
            category: 'appointment',
            templates: [
              {
                id: 'haircut_styling',
                name: 'Haircut & Styling',
                duration: 60,
                defaultPrice: 80,
                category: 'appointment',
                aiOptimizable: true
              }
            ],
            aiSuggestions: true
          }
        ],
        defaultServices: [],
        priceBuckets: [
          { tier: 'budget', min: 30, max: 60, currency: 'USD' },
          { tier: 'standard', min: 60, max: 120, currency: 'USD' },
          { tier: 'premium', min: 120, max: 200, currency: 'USD' },
          { tier: 'luxury', min: 200, max: 400, currency: 'USD' }
        ],
        complianceRequirements: ['us', 'eu'],
        defaultGovernanceRules: ['standard_cancellation', 'beauty_safety_protocols']
      },
      fitness: {
        id: 'fitness',
        name: 'Fitness & Training',
        subcategories: [
          {
            id: 'personal_training',
            name: 'Personal Training',
            category: 'training',
            templates: [
              {
                id: 'one_on_one_training',
                name: '1-on-1 Personal Training',
                duration: 60,
                defaultPrice: 100,
                category: 'training',
                aiOptimizable: true
              }
            ],
            aiSuggestions: true
          },
          {
            id: 'group_classes',
            name: 'Group Classes',
            category: 'class',
            templates: [
              {
                id: 'yoga_class',
                name: 'Yoga Class',
                duration: 75,
                defaultPrice: 25,
                category: 'class',
                aiOptimizable: true
              }
            ],
            aiSuggestions: true
          }
        ],
        defaultServices: [],
        priceBuckets: [
          { tier: 'budget', min: 15, max: 40, currency: 'USD' },
          { tier: 'standard', min: 40, max: 80, currency: 'USD' },
          { tier: 'premium', min: 80, max: 150, currency: 'USD' },
          { tier: 'luxury', min: 150, max: 300, currency: 'USD' }
        ],
        complianceRequirements: ['us'],
        defaultGovernanceRules: ['fitness_waivers', 'health_screening']
      },
      education: {
        id: 'education',
        name: 'Education & Training',
        subcategories: [
          {
            id: 'tutoring',
            name: 'Academic Tutoring',
            category: 'consultation',
            templates: [
              {
                id: 'math_tutoring',
                name: 'Mathematics Tutoring',
                duration: 60,
                defaultPrice: 60,
                category: 'consultation',
                aiOptimizable: true
              }
            ],
            aiSuggestions: true
          }
        ],
        defaultServices: [],
        priceBuckets: [
          { tier: 'budget', min: 25, max: 50, currency: 'USD' },
          { tier: 'standard', min: 50, max: 100, currency: 'USD' },
          { tier: 'premium', min: 100, max: 150, currency: 'USD' },
          { tier: 'luxury', min: 150, max: 250, currency: 'USD' }
        ],
        complianceRequirements: ['us', 'eu'],
        defaultGovernanceRules: ['education_standards', 'child_protection']
      },
      consulting: {
        id: 'consulting',
        name: 'Business Consulting',
        subcategories: [
          {
            id: 'strategy_consulting',
            name: 'Strategy Consulting',
            category: 'consultation',
            templates: [
              {
                id: 'business_strategy',
                name: 'Business Strategy Session',
                duration: 90,
                defaultPrice: 300,
                category: 'consultation',
                aiOptimizable: true
              }
            ],
            aiSuggestions: true
          }
        ],
        defaultServices: [],
        priceBuckets: [
          { tier: 'budget', min: 100, max: 200, currency: 'USD' },
          { tier: 'standard', min: 200, max: 400, currency: 'USD' },
          { tier: 'premium', min: 400, max: 800, currency: 'USD' },
          { tier: 'luxury', min: 800, max: 1500, currency: 'USD' }
        ],
        complianceRequirements: ['us', 'eu'],
        defaultGovernanceRules: ['professional_standards', 'confidentiality_agreements']
      },
      legal: {
        id: 'legal',
        name: 'Legal Services',
        subcategories: [
          {
            id: 'legal_consultation',
            name: 'Legal Consultation',
            category: 'consultation',
            templates: [
              {
                id: 'initial_consultation',
                name: 'Initial Legal Consultation',
                duration: 60,
                defaultPrice: 250,
                category: 'consultation',
                aiOptimizable: false
              }
            ],
            aiSuggestions: false
          }
        ],
        defaultServices: [],
        priceBuckets: [
          { tier: 'budget', min: 150, max: 300, currency: 'USD' },
          { tier: 'standard', min: 300, max: 500, currency: 'USD' },
          { tier: 'premium', min: 500, max: 800, currency: 'USD' },
          { tier: 'luxury', min: 800, max: 1200, currency: 'USD' }
        ],
        complianceRequirements: ['us', 'eu'],
        defaultGovernanceRules: ['attorney_client_privilege', 'bar_compliance', 'legal_ethics']
      },
      finance: {
        id: 'finance',
        name: 'Financial Services',
        subcategories: [
          {
            id: 'financial_planning',
            name: 'Financial Planning',
            category: 'consultation',
            templates: [
              {
                id: 'retirement_planning',
                name: 'Retirement Planning Session',
                duration: 75,
                defaultPrice: 200,
                category: 'consultation',
                aiOptimizable: true
              }
            ],
            aiSuggestions: true
          }
        ],
        defaultServices: [],
        priceBuckets: [
          { tier: 'budget', min: 100, max: 200, currency: 'USD' },
          { tier: 'standard', min: 200, max: 350, currency: 'USD' },
          { tier: 'premium', min: 350, max: 600, currency: 'USD' },
          { tier: 'luxury', min: 600, max: 1000, currency: 'USD' }
        ],
        complianceRequirements: ['us', 'eu'],
        defaultGovernanceRules: ['fiduciary_duty', 'financial_privacy', 'sec_compliance']
      },
      retail: {
        id: 'retail',
        name: 'Retail & Services',
        subcategories: [
          {
            id: 'personal_shopping',
            name: 'Personal Shopping',
            category: 'appointment',
            templates: [
              {
                id: 'style_consultation',
                name: 'Style Consultation',
                duration: 90,
                defaultPrice: 120,
                category: 'consultation',
                aiOptimizable: true
              }
            ],
            aiSuggestions: true
          }
        ],
        defaultServices: [],
        priceBuckets: [
          { tier: 'budget', min: 50, max: 100, currency: 'USD' },
          { tier: 'standard', min: 100, max: 200, currency: 'USD' },
          { tier: 'premium', min: 200, max: 350, currency: 'USD' },
          { tier: 'luxury', min: 350, max: 600, currency: 'USD' }
        ],
        complianceRequirements: ['us'],
        defaultGovernanceRules: ['retail_standards', 'customer_service_protocols']
      }
    },
    plans: {
      freemium: {
        id: 'freemium',
        name: 'Freemium',
        price: 0,
        features: ['basic_booking', 'calendar_view', 'email_notifications'],
        limits: {
          services: 2,
          bookings_per_month: 50,
          storage_mb: 100
        },
        aiAccess: false,
        priority: 1
      },
      advanced: {
        id: 'advanced',
        name: 'Advanced',
        price: 29,
        features: ['basic_booking', 'calendar_view', 'email_notifications', 'payment_processing', 'custom_branding', 'analytics'],
        limits: {
          services: 10,
          bookings_per_month: 500,
          storage_mb: 1000
        },
        aiAccess: false,
        priority: 2
      },
      professional: {
        id: 'professional',
        name: 'Professional',
        price: 99,
        features: ['basic_booking', 'calendar_view', 'email_notifications', 'payment_processing', 'custom_branding', 'analytics', 'ai_assistant', 'team_management'],
        limits: {
          services: 50,
          bookings_per_month: 2000,
          storage_mb: 5000
        },
        aiAccess: true,
        priority: 3
      },
      enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        price: 299,
        features: ['all_features'],
        limits: {
          services: -1, // unlimited
          bookings_per_month: -1,
          storage_mb: -1
        },
        aiAccess: true,
        priority: 4
      }
    },
    roles: {
      end_user: {
        id: 'end_user',
        name: 'End User',
        permissions: ['booking:create', 'booking:read', 'profile:edit'],
        scope: 'self',
        hierarchyLevel: 1
      },
      team_admin: {
        id: 'team_admin',
        name: 'Team Admin',
        permissions: ['booking:create', 'booking:read', 'booking:update', 'team:manage', 'reports:read'],
        scope: 'team',
        hierarchyLevel: 2
      },
      org_admin: {
        id: 'org_admin',
        name: 'Organization Admin',
        permissions: ['booking:*', 'team:*', 'org:*', 'reports:*', 'analytics:*'],
        scope: 'organization',
        hierarchyLevel: 3
      },
      platform_admin: {
        id: 'platform_admin',
        name: 'Platform Admin',
        permissions: ['*'],
        scope: 'platform',
        hierarchyLevel: 4
      }
    },
    aiCapabilities: {
      models: [
        {
          id: 'smart_scheduler',
          name: 'Smart Scheduler',
          type: 'ml',
          minimumPlan: 'professional',
          costPerRequest: 0.02
        },
        {
          id: 'intent_recognition',
          name: 'Intent Recognition',
          type: 'nlp',
          minimumPlan: 'professional',
          costPerRequest: 0.01
        },
        {
          id: 'predictive_analytics',
          name: 'Predictive Analytics',
          type: 'prediction',
          minimumPlan: 'enterprise',
          costPerRequest: 0.05
        }
      ],
      features: [
        {
          id: 'ai_scheduling',
          name: 'AI-Powered Scheduling',
          description: 'Intelligent scheduling optimization',
          category: 'scheduling',
          minimumPlan: 'professional',
          betaAccess: false
        },
        {
          id: 'ai_assistant',
          name: 'AI Assistant',
          description: 'Conversational AI for booking assistance',
          category: 'assistant',
          minimumPlan: 'professional',
          betaAccess: false
        },
        {
          id: 'predictive_insights',
          name: 'Predictive Insights',
          description: 'AI-driven business insights',
          category: 'analytics',
          minimumPlan: 'enterprise',
          betaAccess: true
        }
      ],
      unlockCriteria: {
        freemium: [],
        advanced: [],
        professional: ['ai_scheduling', 'ai_assistant'],
        enterprise: ['ai_scheduling', 'ai_assistant', 'predictive_insights']
      }
    },
    trustFlags: {
      verification_levels: [
        {
          level: 'basic',
          requirements: ['email_verified', 'phone_verified'],
          benefits: ['basic_trust_badge'],
          validityPeriod: 365
        },
        {
          level: 'verified',
          requirements: ['basic', 'identity_verified', 'business_verified'],
          benefits: ['verified_badge', 'priority_support'],
          validityPeriod: 365
        },
        {
          level: 'premium',
          requirements: ['verified', 'background_check', 'professional_credentials'],
          benefits: ['premium_badge', 'featured_listing', 'priority_support'],
          validityPeriod: 365
        }
      ],
      trust_signals: [
        {
          id: 'response_time',
          name: 'Response Time',
          weight: 0.2,
          calculation: 'average_response_hours'
        },
        {
          id: 'completion_rate',
          name: 'Completion Rate',
          weight: 0.3,
          calculation: 'completed_bookings / total_bookings'
        },
        {
          id: 'rating',
          name: 'Average Rating',
          weight: 0.3,
          calculation: 'sum_ratings / count_ratings'
        },
        {
          id: 'verification_level',
          name: 'Verification Level',
          weight: 0.2,
          calculation: 'verification_score'
        }
      ],
      scoring_algorithm: 'weighted_average'
    },
    bookingDefaults: {
      industries: {
        healthcare: {
          defaultDuration: 30,
          bufferTime: 15,
          advanceBooking: 168, // 7 days in hours
          cancellationWindow: 24,
          reschedulingWindow: 24
        },
        beauty: {
          defaultDuration: 60,
          bufferTime: 10,
          advanceBooking: 72, // 3 days
          cancellationWindow: 12,
          reschedulingWindow: 12
        },
        fitness: {
          defaultDuration: 60,
          bufferTime: 15,
          advanceBooking: 48, // 2 days
          cancellationWindow: 6,
          reschedulingWindow: 6
        },
        education: {
          defaultDuration: 60,
          bufferTime: 10,
          advanceBooking: 24, // 1 day
          cancellationWindow: 4,
          reschedulingWindow: 4
        },
        consulting: {
          defaultDuration: 90,
          bufferTime: 30,
          advanceBooking: 168, // 7 days
          cancellationWindow: 48,
          reschedulingWindow: 48
        },
        legal: {
          defaultDuration: 60,
          bufferTime: 15,
          advanceBooking: 168, // 7 days
          cancellationWindow: 48,
          reschedulingWindow: 48
        },
        finance: {
          defaultDuration: 75,
          bufferTime: 15,
          advanceBooking: 72, // 3 days
          cancellationWindow: 24,
          reschedulingWindow: 24
        },
        retail: {
          defaultDuration: 90,
          bufferTime: 10,
          advanceBooking: 24, // 1 day
          cancellationWindow: 2,
          reschedulingWindow: 2
        }
      },
      global: {
        timezone: 'UTC',
        workingHours: {
          start: '09:00',
          end: '17:00'
        },
        weekends: false,
        holidays: ['2024-01-01', '2024-07-04', '2024-12-25']
      }
    }
  };
}
