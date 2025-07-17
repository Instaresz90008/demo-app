
export interface SettingsModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  planAccess: 'freemium' | 'advanced' | 'professional' | 'enterprise';
  status: 'configured' | 'not_set' | 'locked';
  category: 'general' | 'growth' | 'security' | 'monetization' | 'integrations' | 'advanced';
  locked: boolean;
  onClick: () => void;
}

export interface SettingsCategory {
  id: string;
  name: string;
  color: string;
}

export type SettingsViewMode = 'drawer' | 'modal' | 'route';
