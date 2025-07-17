
import { SettingsModule, SettingsCategory } from '@/types/settings';

export const settingsCategories: SettingsCategory[] = [
  { id: 'general', name: 'General', color: 'blue' },
  { id: 'growth', name: 'Growth', color: 'green' },
  { id: 'security', name: 'Security', color: 'red' },
  { id: 'monetization', name: 'Monetization', color: 'purple' },
  { id: 'integrations', name: 'Integrations', color: 'orange' },
  { id: 'advanced', name: 'Advanced', color: 'gray' }
];

export const settingsModulesData = [
  {
    id: 'profile-branding',
    slug: 'profile-branding',
    title: 'Profile & Branding',
    description: 'Your public name, logo, timezone, display settings',
    icon: '🪪',
    planAccess: 'freemium',
    status: 'not_set',
    category: 'general',
    locked: false
  },
  {
    id: 'notifications-alerts',
    slug: 'notifications-alerts',
    title: 'Notifications & Alerts',
    description: 'Manage email, SMS, reminders',
    icon: '🔔',
    planAccess: 'freemium',
    status: 'not_set',
    category: 'general',
    locked: false
  },
  {
    id: 'security-access',
    slug: 'security-access',
    title: 'Security & Access',
    description: 'Password, sessions, 2FA, device restrictions',
    icon: '🔐',
    planAccess: 'freemium',
    status: 'not_set',
    category: 'security',
    locked: false
  },
  {
    id: 'platform-billing',
    slug: 'platform-billing',
    title: 'Platform Plan & Billing',
    description: 'View your JusBook subscription, plan, usage',
    icon: '💳',
    planAccess: 'freemium',
    status: 'configured',
    category: 'monetization',
    locked: false
  },
  {
    id: 'invoices-tax',
    slug: 'invoices-tax',
    title: 'Invoices & Tax Settings',
    description: 'Add GST, download invoices, set tax rules',
    icon: '📄',
    planAccess: 'advanced',
    status: 'not_set',
    category: 'monetization',
    locked: false
  },
  {
    id: 'client-subscriptions',
    slug: 'client-subscriptions',
    title: 'Client Subscriptions Manager',
    description: 'Create recurring plans, track usage',
    icon: '📦',
    planAccess: 'advanced',
    status: 'not_set',
    category: 'growth',
    locked: false
  },
  {
    id: 'referrals',
    slug: 'referrals',
    title: 'Referrals',
    description: 'Create referral codes, view usage, reward logic',
    icon: '🔁',
    planAccess: 'advanced',
    status: 'not_set',
    category: 'growth',
    locked: false
  },
  {
    id: 'loyalty-system',
    slug: 'loyalty-system',
    title: 'Loyalty System',
    description: 'Track client return, award badges, configure tiers',
    icon: '🏆',
    planAccess: 'advanced',
    status: 'not_set',
    category: 'growth',
    locked: false
  },
  {
    id: 'contact-management',
    slug: 'contact-management',
    title: 'Contact Management',
    description: 'View returning clients, tag leads, segment customers',
    icon: '📇',
    planAccess: 'advanced',
    status: 'not_set',
    category: 'growth',
    locked: false
  },
  {
    id: 'questions-management',
    slug: 'questions-management',
    title: 'Questions Management',
    description: 'Add onboarding or booking questions with smart logic',
    icon: '❓',
    planAccess: 'advanced',
    status: 'not_set',
    category: 'general',
    locked: false
  },
  {
    id: 'analytics-insights',
    slug: 'analytics-insights',
    title: 'Analytics & Insights',
    description: 'Track sessions, earnings, traffic',
    icon: '📊',
    planAccess: 'advanced',
    status: 'not_set',
    category: 'advanced',
    locked: false
  },
  {
    id: 'ai-settings',
    slug: 'ai-settings',
    title: 'AI Settings',
    description: 'Configure Tara AI Co-Pilot, prompt behavior',
    icon: '🧠',
    planAccess: 'professional',
    status: 'locked',
    category: 'advanced',
    locked: true
  },
  {
    id: 'integrations-webhooks',
    slug: 'integrations-webhooks',
    title: 'Integrations & Webhooks',
    description: 'Connect Google Calendar, CRMs, email tools',
    icon: '🧩',
    planAccess: 'professional',
    status: 'locked',
    category: 'integrations',
    locked: true
  },
  {
    id: 'api-management',
    slug: 'api-management',
    title: 'API Key Management',
    description: 'Generate and revoke API keys',
    icon: '🔑',
    planAccess: 'professional',
    status: 'locked',
    category: 'advanced',
    locked: true
  },
  {
    id: 'custom-domain',
    slug: 'custom-domain',
    title: 'Custom Domain / Branding',
    description: 'White-labeled domain, email sender config',
    icon: '🌐',
    planAccess: 'enterprise',
    status: 'locked',
    category: 'advanced',
    locked: true
  },
  {
    id: 'beta-features',
    slug: 'beta-features',
    title: 'Beta Features / Labs',
    description: 'Try AI tools, upcoming features',
    icon: '🧪',
    planAccess: 'professional',
    status: 'locked',
    category: 'advanced',
    locked: true
  }
];
