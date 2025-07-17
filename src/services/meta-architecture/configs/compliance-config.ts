
import { MetaCompliance } from '@/types/meta-architecture';

export function getDefaultCompliance(): MetaCompliance {
  return {
    dataResidency: {
      us: {
        region: 'us',
        dataTypes: ['user_data', 'booking_data', 'payment_data', 'analytics_data'],
        storageRequirements: ['us_only', 'encrypted_at_rest', 'encrypted_in_transit'],
        transferRestrictions: ['no_international_transfer', 'court_order_required'],
        retentionPeriods: {
          user_data: 2555, // 7 years in days
          booking_data: 2555,
          payment_data: 2555,
          analytics_data: 1095, // 3 years
          audit_logs: 2555
        }
      },
      eu: {
        region: 'eu',
        dataTypes: ['user_data', 'booking_data', 'payment_data', 'analytics_data'],
        storageRequirements: ['eu_only', 'gdpr_compliant', 'encrypted_at_rest', 'encrypted_in_transit'],
        transferRestrictions: ['adequacy_decision_required', 'data_subject_consent'],
        retentionPeriods: {
          user_data: 1095, // 3 years - GDPR limitation
          booking_data: 1095,
          payment_data: 2555, // 7 years for tax purposes
          analytics_data: 730, // 2 years
          audit_logs: 2190 // 6 years
        }
      },
      uk: {
        region: 'uk',
        dataTypes: ['user_data', 'booking_data', 'payment_data', 'analytics_data'],
        storageRequirements: ['uk_only', 'uk_gdpr_compliant', 'encrypted_at_rest'],
        transferRestrictions: ['adequacy_assessment', 'international_data_transfer_agreement'],
        retentionPeriods: {
          user_data: 1095,
          booking_data: 1095,
          payment_data: 2555,
          analytics_data: 730,
          audit_logs: 2190
        }
      },
      apac: {
        region: 'apac',
        dataTypes: ['user_data', 'booking_data', 'payment_data'],
        storageRequirements: ['regional_storage', 'local_jurisdiction_compliance'],
        transferRestrictions: ['country_specific_agreements'],
        retentionPeriods: {
          user_data: 1825, // 5 years
          booking_data: 1825,
          payment_data: 2555,
          analytics_data: 1095,
          audit_logs: 1825
        }
      },
      global: {
        region: 'global',
        dataTypes: ['aggregated_analytics', 'anonymized_data'],
        storageRequirements: ['anonymization_required', 'no_pii'],
        transferRestrictions: ['anonymization_verified'],
        retentionPeriods: {
          aggregated_analytics: 1825,
          anonymized_data: 3650, // 10 years
          audit_logs: 1095
        }
      }
    },
    jurisdictionRules: [
      {
        region: 'us',
        industries: ['healthcare'],
        requirements: [
          {
            id: 'hipaa_compliance',
            type: 'hipaa',
            mandatory: true,
            implementationLevel: 'enhanced',
            auditFrequency: 365
          },
          {
            id: 'state_medical_board',
            type: 'custom',
            mandatory: true,
            implementationLevel: 'standard',
            auditFrequency: 730
          }
        ],
        certifications: ['HIPAA_HITECH', 'SOC2_TYPE2'],
        localPartners: ['healthcare_compliance_partners']
      },
      {
        region: 'eu',
        industries: ['healthcare', 'beauty', 'fitness', 'education', 'consulting', 'legal', 'finance', 'retail'],
        requirements: [
          {
            id: 'gdpr_compliance',
            type: 'gdpr',
            mandatory: true,
            implementationLevel: 'enhanced',
            auditFrequency: 365
          },
          {
            id: 'medical_device_regulation',
            type: 'custom',
            mandatory: false,
            implementationLevel: 'basic',
            auditFrequency: 730
          }
        ],
        certifications: ['ISO27001', 'GDPR_CERTIFIED'],
        localPartners: ['eu_privacy_partners']
      },
      {
        region: 'us',
        industries: ['finance'],
        requirements: [
          {
            id: 'sox_compliance',
            type: 'sox',
            mandatory: true,
            implementationLevel: 'enhanced',
            auditFrequency: 180
          },
          {
            id: 'finra_requirements',
            type: 'custom',
            mandatory: true,
            implementationLevel: 'enhanced',
            auditFrequency: 365
          }
        ],
        certifications: ['SOX_COMPLIANT', 'FINRA_APPROVED'],
        localPartners: ['financial_compliance_firms']
      },
      {
        region: 'us',
        industries: ['retail'],
        requirements: [
          {
            id: 'pci_dss_compliance',
            type: 'pci',
            mandatory: true,
            implementationLevel: 'standard',
            auditFrequency: 365
          },
          {
            id: 'ccpa_compliance',
            type: 'ccpa',
            mandatory: true,
            implementationLevel: 'standard',
            auditFrequency: 365
          }
        ],
        certifications: ['PCI_DSS_LEVEL1', 'CCPA_COMPLIANT'],
        localPartners: ['payment_processors', 'privacy_consultants']
      }
    ],
    privacyPreferences: {
      consentTypes: [
        {
          id: 'marketing_communications',
          name: 'Marketing Communications',
          required: false,
          category: 'marketing',
          description: 'Receive promotional emails and offers'
        },
        {
          id: 'analytics_tracking',
          name: 'Analytics & Performance',
          required: false,
          category: 'analytics',
          description: 'Help us improve our service through usage analytics'
        },
        {
          id: 'essential_functionality',
          name: 'Essential Functionality',
          required: true,
          category: 'essential',
          description: 'Required for core booking and account management'
        },
        {
          id: 'personalization',
          name: 'Personalized Experience',
          required: false,
          category: 'personalization',
          description: 'Customize your experience based on preferences'
        }
      ],
      defaultSettings: {
        marketing_communications: false,
        analytics_tracking: true,
        essential_functionality: true,
        personalization: true
      },
      granularControls: true,
      withdrawalProcess: 'self_service',
      consentRefreshPeriod: 365 // days
    },
    localeMetadata: {
      'en-US': {
        locale: 'en-US',
        language: 'English',
        region: 'us',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        culturalNorms: {
          business_hours: '9:00-17:00',
          weekend_booking: true,
          advance_booking_norm: 168, // 1 week
          cancellation_etiquette: 24 // 24 hours
        }
      },
      'en-GB': {
        locale: 'en-GB',
        language: 'English',
        region: 'uk',
        currency: 'GBP',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        culturalNorms: {
          business_hours: '9:00-17:30',
          weekend_booking: false,
          advance_booking_norm: 72, // 3 days
          cancellation_etiquette: 24
        }
      },
      'de-DE': {
        locale: 'de-DE',
        language: 'German',
        region: 'eu',
        currency: 'EUR',
        dateFormat: 'DD.MM.YYYY',
        timeFormat: '24h',
        culturalNorms: {
          business_hours: '8:00-16:00',
          weekend_booking: false,
          advance_booking_norm: 168,
          cancellation_etiquette: 48 // 48 hours
        }
      },
      'fr-FR': {
        locale: 'fr-FR',
        language: 'French',
        region: 'eu',
        currency: 'EUR',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        culturalNorms: {
          business_hours: '9:00-17:00',
          weekend_booking: false,
          advance_booking_norm: 72,
          cancellation_etiquette: 24
        }
      }
    },
    auditTrails: {
      retention: 2555, // 7 years
      events: [
        'user_login',
        'user_logout',
        'data_access',
        'data_modification',
        'data_deletion',
        'consent_given',
        'consent_withdrawn',
        'privacy_request',
        'security_incident',
        'admin_action',
        'system_configuration_change',
        'compliance_check'
      ],
      detailLevel: 'comprehensive',
      realtime: true
    },
    consentTracking: {
      types: [
        {
          id: 'data_processing',
          name: 'Data Processing Consent',
          required: true,
          category: 'essential',
          description: 'Consent to process personal data for service delivery'
        },
        {
          id: 'marketing_consent',
          name: 'Marketing Communications',
          required: false,
          category: 'marketing',
          description: 'Consent to receive marketing communications'
        },
        {
          id: 'analytics_consent',
          name: 'Analytics Consent',
          required: false,
          category: 'analytics',
          description: 'Consent to use data for analytics and service improvement'
        },
        {
          id: 'third_party_sharing',
          name: 'Third Party Sharing',
          required: false,
          category: 'sharing',
          description: 'Consent to share data with trusted third parties'
        }
      ],
      granular: true,
      withdrawal: true,
      history: true
    },
    anonymizationLogic: [
      {
        dataType: 'user_email',
        method: 'hash',
        trigger: 'account_deletion',
        exceptions: ['legal_hold', 'fraud_investigation']
      },
      {
        dataType: 'user_phone',
        method: 'tokenize',
        trigger: 'account_deletion',
        exceptions: ['legal_hold']
      },
      {
        dataType: 'user_name',
        method: 'remove',
        trigger: 'data_retention_expired',
        exceptions: ['legal_hold', 'tax_requirements']
      },
      {
        dataType: 'ip_address',
        method: 'hash',
        trigger: 'immediate_after_session',
        exceptions: ['security_investigation', 'fraud_detection']
      },
      {
        dataType: 'location_data',
        method: 'encrypt',
        trigger: 'after_30_days',
        exceptions: ['user_consent_active', 'legal_requirement']
      },
      {
        dataType: 'payment_info',
        method: 'tokenize',
        trigger: 'immediate_after_transaction',
        exceptions: ['refund_processing', 'chargeback_dispute']
      },
      {
        dataType: 'sensitive_health_data',
        method: 'encrypt',
        trigger: 'immediate',
        exceptions: ['patient_care_continuity', 'legal_requirement']
      }
    ]
  };
}
