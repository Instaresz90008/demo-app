
import { Feature, FeatureId, SubscriptionTier, UserRole, FeatureCategory } from "./features";

/**
 * All theme and theme-animated feature variants
 */
export const THEME_FEATURES: Record<FeatureId, Feature> = {
  'theme_light_simple': {
    id: 'theme_light_simple',
    name: 'Light Simple',
    description: 'Clean light theme - WCAG AAA compliant.',
    category: 'customization',
    minimumTier: 'freemium',
    allowedTiers: ['freemium', 'advanced', 'professional', 'enterprise'],
    requiredRoles: ['member'],
    isActive: true
  },
  'theme_dark_simple': {
    id: 'theme_dark_simple',
    name: 'Dark Simple',
    description: 'Professional dark theme - WCAG AAA compliant.',
    category: 'customization',
    minimumTier: 'freemium',
    allowedTiers: ['freemium', 'advanced', 'professional', 'enterprise'],
    requiredRoles: ['member'],
    isActive: true
  }
};
