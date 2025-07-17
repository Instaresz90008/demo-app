
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  CreditCard, 
  Receipt, 
  Users, 
  UserPlus, 
  Heart, 
  ContactRound, 
  HelpCircle, 
  BarChart3, 
  Brain, 
  Webhook, 
  Key, 
  Globe, 
  FlaskConical,
  Lock,
  Crown
} from 'lucide-react';

interface SettingCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  category: 'account' | 'business' | 'advanced' | 'developer';
  requiredPlan: 'freemium' | 'advanced' | 'professional' | 'enterprise';
  comingSoon?: boolean;
}

const PLAN_HIERARCHY = {
  freemium: 0,
  advanced: 1,
  professional: 2,
  enterprise: 3
};

const EndUserSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const settingsCards: SettingCard[] = [
    // Account Settings
    {
      id: 'profile-branding',
      title: 'Profile & Branding',
      description: 'Customize your profile, bio, and visual branding',
      icon: User,
      path: '/settings/profile-branding',
      category: 'account',
      requiredPlan: 'freemium'
    },
    {
      id: 'platform-billing',
      title: 'Platform Billing',
      description: 'Manage subscription, payments, and billing history',
      icon: CreditCard,
      path: '/settings/platform-billing',
      category: 'account',
      requiredPlan: 'freemium'
    },
    {
      id: 'invoices-tax',
      title: 'Invoices & Tax',
      description: 'Configure invoice templates and tax settings',
      icon: Receipt,
      path: '/settings/invoices-tax',
      category: 'account',
      requiredPlan: 'advanced'
    },
    
    // Business Settings
    {
      id: 'client-subscriptions',
      title: 'Client Subscriptions',
      description: 'Manage recurring client billing and subscriptions',
      icon: Users,
      path: '/settings/client-subscriptions',
      category: 'business',
      requiredPlan: 'advanced'
    },
    {
      id: 'referrals',
      title: 'Referrals',
      description: 'Set up referral programs and track commissions',
      icon: UserPlus,
      path: '/settings/referrals',
      category: 'business',
      requiredPlan: 'professional'
    },
    {
      id: 'loyalty-system',
      title: 'Loyalty System',
      description: 'Configure customer loyalty rewards and points',
      icon: Heart,
      path: '/settings/loyalty-system',
      category: 'business',
      requiredPlan: 'professional'
    },
    {
      id: 'contact-management',
      title: 'Contact Management',
      description: 'Organize and segment your client database',
      icon: ContactRound,
      path: '/settings/contact-management',
      category: 'business',
      requiredPlan: 'advanced'
    },
    {
      id: 'questions-management',
      title: 'Questions Management',
      description: 'Customize booking forms and intake questions',
      icon: HelpCircle,
      path: '/settings/questions-management',
      category: 'business',
      requiredPlan: 'advanced'
    },
    
    // Advanced Settings
    {
      id: 'analytics-insights',
      title: 'Analytics & Insights',
      description: 'Advanced reporting and business intelligence',
      icon: BarChart3,
      path: '/settings/analytics-insights',
      category: 'advanced',
      requiredPlan: 'professional'
    },
    {
      id: 'ai-settings',
      title: 'AI Settings',
      description: 'Model selection, personality configuration, analytics',
      icon: Brain,
      path: '/settings/ai-settings',
      category: 'advanced',
      requiredPlan: 'professional'
    },
    {
      id: 'integrations-webhooks',
      title: 'Integrations & Webhooks',
      description: 'Third-party integrations, webhook management, API docs',
      icon: Webhook,
      path: '/settings/integrations-webhooks',
      category: 'developer',
      requiredPlan: 'professional'
    },
    {
      id: 'api-management',
      title: 'API Management',
      description: 'API key generation, permissions, rate limits, usage analytics',
      icon: Key,
      path: '/settings/api-management',
      category: 'developer',
      requiredPlan: 'professional'
    },
    
    // Enterprise Settings
    {
      id: 'custom-domain',
      title: 'Custom Domain',
      description: 'Domain verification, DNS configuration, white-label branding',
      icon: Globe,
      path: '/settings/custom-domain',
      category: 'advanced',
      requiredPlan: 'enterprise'
    },
    {
      id: 'beta-features',
      title: 'Beta Features',
      description: 'Feature toggles, experiments tracking, feedback portal',
      icon: FlaskConical,
      path: '/settings/beta-features',
      category: 'advanced',
      requiredPlan: 'professional'
    }
  ];

  const getUserPlanLevel = () => {
    return PLAN_HIERARCHY[user?.planType as keyof typeof PLAN_HIERARCHY] ?? 0;
  };

  const canAccessFeature = (requiredPlan: string) => {
    if (user?.roles?.includes('platform_admin')) return true;
    const userLevel = getUserPlanLevel();
    const requiredLevel = PLAN_HIERARCHY[requiredPlan as keyof typeof PLAN_HIERARCHY];
    return userLevel >= requiredLevel;
  };

  const handleCardClick = (card: SettingCard) => {
    if (card.comingSoon) return;
    
    if (!canAccessFeature(card.requiredPlan)) {
      console.log(`Upgrade required for ${card.title}`);
      return;
    }

    navigate(card.path);
  };

  const renderCard = (card: SettingCard) => {
    const hasAccess = canAccessFeature(card.requiredPlan);
    const Icon = card.icon;

    return (
      <Card 
        key={card.id}
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          !hasAccess ? 'opacity-60' : 'hover:scale-105'
        } ${card.comingSoon ? 'border-dashed' : ''}`}
        onClick={() => handleCardClick(card)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                !hasAccess ? 'bg-muted' : 'bg-primary/10'
              }`}>
                <Icon className={`h-5 w-5 ${
                  !hasAccess ? 'text-muted-foreground' : 'text-primary'
                }`} />
              </div>
              <div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                {!hasAccess && (
                  <div className="flex items-center gap-1 mt-1">
                    {card.requiredPlan === 'enterprise' ? (
                      <Crown className="h-3 w-3 text-yellow-600" />
                    ) : (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                    <Badge variant="outline" className="text-xs">
                      {card.requiredPlan}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            {card.comingSoon && (
              <Badge variant="secondary" className="text-xs">
                Soon
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{card.description}</p>
          {!hasAccess && (
            <p className="text-xs text-yellow-600 mt-2">
              Upgrade to {card.requiredPlan} to access this feature
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  const categorizeCards = () => {
    return {
      account: settingsCards.filter(card => card.category === 'account'),
      business: settingsCards.filter(card => card.category === 'business'),
      advanced: settingsCards.filter(card => card.category === 'advanced'),
      developer: settingsCards.filter(card => card.category === 'developer')
    };
  };

  const categories = categorizeCards();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, business settings, and integrations
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Current Plan: {user?.planType || 'freemium'}
          </Badge>
          {user?.roles?.includes('platform_admin') && (
            <Badge variant="default">Platform Admin</Badge>
          )}
        </div>
      </div>

      {/* Account Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Account Settings</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.account.map(renderCard)}
        </div>
      </div>

      {/* Business Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Business Settings</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.business.map(renderCard)}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Advanced Settings</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.advanced.map(renderCard)}
        </div>
      </div>

      {/* Developer Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Developer Settings</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.developer.map(renderCard)}
        </div>
      </div>
    </div>
  );
};

export default EndUserSettings;
