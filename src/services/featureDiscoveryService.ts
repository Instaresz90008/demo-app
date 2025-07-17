import { Feature, FeatureCategory } from '@/config/features';

export interface SubFeature {
  id: string;
  name: string;
  description: string;
  parentFeatureId: string;
  isActive: boolean;
  dependencies?: string[];
  componentPath?: string;
  routePath?: string;
  adminLevel?: 'platform' | 'organization' | 'both';
  metadata?: Record<string, any>;
}

export interface FeatureMap {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  isActive: boolean;
  subFeatures: SubFeature[];
  dependencies: string[];
  componentPaths: string[];
  routePaths: string[];
  adminLevel: 'platform' | 'organization' | 'both';
  lastUpdated: Date;
  // Enhancement properties
  rbacMappable: boolean;
  planMappable: boolean;
  usageTracking: boolean;
  rateLimit?: {
    enabled: boolean;
    defaultLimit: number;
    period: 'hour' | 'day' | 'month';
  };
  metadata?: Record<string, any>;
}

export interface FeatureDependencyGraph {
  featureId: string;
  dependsOn: string[];
  requiredBy: string[];
  criticalPath: boolean;
}

export interface FeatureUsagePattern {
  featureId: string;
  usageFrequency: 'high' | 'medium' | 'low';
  peakUsageTimes: string[];
  averageSessionDuration: number;
  userRetention: number;
}

class FeatureDiscoveryService {
  private featureMaps: Map<string, FeatureMap> = new Map();
  private listeners: Set<(maps: FeatureMap[]) => void> = new Set();
  private dependencyGraph: Map<string, FeatureDependencyGraph> = new Map();
  private usagePatterns: Map<string, FeatureUsagePattern> = new Map();

  // Auto-discover features from codebase patterns
  async discoverFeatures(): Promise<FeatureMap[]> {
    console.log('🔍 Starting enhanced feature discovery...');
    
    const discoveredFeatures = await this.scanCodebaseForFeatures();
    
    // Update our internal maps
    discoveredFeatures.forEach(feature => {
      this.featureMaps.set(feature.id, feature);
    });
    
    // Build dependency graph
    this.buildDependencyGraph();
    
    this.notifyListeners();
    return Array.from(this.featureMaps.values());
  }

  private async scanCodebaseForFeatures(): Promise<FeatureMap[]> {
    return [
      {
        id: 'booking_system',
        name: 'Booking System',
        description: 'Complete booking management system',
        category: 'booking',
        isActive: true,
        adminLevel: 'both',
        rbacMappable: true,
        planMappable: true,
        usageTracking: true,
        rateLimit: {
          enabled: true,
          defaultLimit: 100,
          period: 'hour'
        },
        subFeatures: [
          {
            id: 'booking_form',
            name: 'Booking Form',
            description: 'User booking form interface',
            parentFeatureId: 'booking_system',
            isActive: true,
            adminLevel: 'organization',
            componentPath: '/components/booking/BookingDetailsForm.tsx',
            routePath: '/booking'
          },
          {
            id: 'booking_confirmation',
            name: 'Booking Confirmation',
            description: 'Booking confirmation and receipt',
            parentFeatureId: 'booking_system',
            isActive: true,
            adminLevel: 'organization',
            componentPath: '/components/booking/BookingConfirmationCard.tsx'
          },
          {
            id: 'booking_link_generation',
            name: 'Booking Link Generation',
            description: 'Generate shareable booking links',
            parentFeatureId: 'booking_system',
            isActive: true,
            adminLevel: 'organization',
            routePath: '/booking-link'
          },
          {
            id: 'time_slot_management',
            name: 'Time Slot Management',
            description: 'Manage available time slots',
            parentFeatureId: 'booking_system',
            isActive: true,
            adminLevel: 'organization',
            componentPath: '/components/booking/TimeSlotGrid.tsx'
          }
        ],
        dependencies: ['calendar_sync', 'notification_system'],
        componentPaths: [
          '/components/booking/',
          '/pages/BookingForm.tsx',
          '/pages/BookingPage.tsx'
        ],
        routePaths: ['/booking', '/booking-link', '/book/:linkCode'],
        lastUpdated: new Date()
      },
      {
        id: 'platform_administration',
        name: 'Platform Administration',
        description: 'System-wide platform administration',
        category: 'team',
        isActive: true,
        adminLevel: 'platform',
        rbacMappable: true,
        planMappable: false,
        usageTracking: true,
        subFeatures: [
          {
            id: 'user_management',
            name: 'Global User Management',
            description: 'Manage all platform users',
            parentFeatureId: 'platform_administration',
            isActive: true,
            adminLevel: 'platform',
            routePath: '/platform-admin/users'
          },
          {
            id: 'organization_management',
            name: 'Organization Management',
            description: 'Create and manage organizations',
            parentFeatureId: 'platform_administration',
            isActive: true,
            adminLevel: 'platform',
            routePath: '/platform-admin/organizations'
          },
          {
            id: 'feature_management',
            name: 'Feature Management',
            description: 'Enable/disable platform features',
            parentFeatureId: 'platform_administration',
            isActive: true,
            adminLevel: 'platform',
            routePath: '/platform-admin/features'
          },
          {
            id: 'system_monitoring',
            name: 'System Monitoring',
            description: 'Monitor platform health and performance',
            parentFeatureId: 'platform_administration',
            isActive: true,
            adminLevel: 'platform',
            routePath: '/platform-admin/monitoring'
          }
        ],
        dependencies: ['access_control'],
        componentPaths: ['/pages/PlatformAdmin.tsx', '/components/platform-admin/'],
        routePaths: ['/platform-admin'],
        lastUpdated: new Date()
      },
      {
        id: 'organization_administration',
        name: 'Organization Administration',
        description: 'Organization-level administration',
        category: 'team',
        isActive: true,
        adminLevel: 'organization',
        rbacMappable: true,
        planMappable: true,
        usageTracking: true,
        subFeatures: [
          {
            id: 'org_user_management',
            name: 'Organization User Management',
            description: 'Manage organization members',
            parentFeatureId: 'organization_administration',
            isActive: true,
            adminLevel: 'organization',
            routePath: '/org-admin/users'
          },
          {
            id: 'org_settings',
            name: 'Organization Settings',
            description: 'Configure organization preferences',
            parentFeatureId: 'organization_administration',
            isActive: true,
            adminLevel: 'organization',
            routePath: '/org-admin/settings'
          },
          {
            id: 'org_billing',
            name: 'Organization Billing',
            description: 'Manage organization subscription and billing',
            parentFeatureId: 'organization_administration',
            isActive: true,
            adminLevel: 'organization',
            routePath: '/org-admin/billing'
          },
          {
            id: 'org_integrations',
            name: 'Organization Integrations',
            description: 'Manage third-party integrations',
            parentFeatureId: 'organization_administration',
            isActive: true,
            adminLevel: 'organization',
            routePath: '/org-admin/integrations'
          }
        ],
        dependencies: ['user_management'],
        componentPaths: ['/pages/OrgAdmin.tsx', '/components/org-admin/'],
        routePaths: ['/org-admin'],
        lastUpdated: new Date()
      },
      {
        id: 'calendar_system',
        name: 'Calendar System',
        description: 'Calendar management and scheduling',
        category: 'calendar',
        isActive: true,
        adminLevel: 'organization',
        rbacMappable: true,
        planMappable: true,
        usageTracking: true,
        rateLimit: {
          enabled: true,
          defaultLimit: 1000,
          period: 'day'
        },
        subFeatures: [
          {
            id: 'calendar_views',
            name: 'Calendar Views',
            description: 'Day, week, month calendar views',
            parentFeatureId: 'calendar_system',
            isActive: true,
            adminLevel: 'organization',
            componentPath: '/components/calendar/views/'
          },
          {
            id: 'event_management',
            name: 'Event Management',
            description: 'Create and manage calendar events',
            parentFeatureId: 'calendar_system',
            isActive: true,
            adminLevel: 'organization',
            routePath: '/event-management'
          },
          {
            id: 'calendar_sync',
            name: 'External Calendar Sync',
            description: 'Sync with Google Calendar, Outlook',
            parentFeatureId: 'calendar_system',
            isActive: true,
            adminLevel: 'organization',
            dependencies: ['integration_system']
          }
        ],
        dependencies: ['date_time_utilities'],
        componentPaths: ['/components/calendar/', '/pages/Calendar.tsx'],
        routePaths: ['/calendar', '/availability', '/events'],
        lastUpdated: new Date()
      },
      {
        id: 'ai_assistant',
        name: 'AI Assistant (Tara)',
        description: 'AI-powered scheduling assistant',
        category: 'ai',
        isActive: true,
        adminLevel: 'both',
        rbacMappable: true,
        planMappable: true,
        usageTracking: true,
        rateLimit: {
          enabled: true,
          defaultLimit: 50,
          period: 'hour'
        },
        subFeatures: [
          {
            id: 'voice_assistant',
            name: 'Voice Assistant',
            description: 'Voice-powered booking assistant',
            parentFeatureId: 'ai_assistant',
            isActive: true,
            adminLevel: 'organization',
            routePath: '/voice-assistant'
          },
          {
            id: 'smart_scheduling',
            name: 'Smart Scheduling',
            description: 'AI-powered optimal scheduling suggestions',
            parentFeatureId: 'ai_assistant',
            isActive: true,
            adminLevel: 'organization'
          },
          {
            id: 'booking_chatbot',
            name: 'Booking Chatbot',
            description: 'Interactive booking assistance',
            parentFeatureId: 'ai_assistant',
            isActive: true,
            adminLevel: 'organization',
            componentPath: '/components/booking/BookingChatbot.tsx'
          }
        ],
        dependencies: ['booking_system', 'calendar_system'],
        componentPaths: ['/components/booking/BookingChatbot.tsx', '/pages/VoiceAssistant.tsx'],
        routePaths: ['/voice-assistant'],
        lastUpdated: new Date()
      }
    ];
  }

  // Enhancement: Build dependency graph for RBAC mapping
  private buildDependencyGraph(): void {
    this.dependencyGraph.clear();
    
    this.featureMaps.forEach(feature => {
      const graph: FeatureDependencyGraph = {
        featureId: feature.id,
        dependsOn: feature.dependencies,
        requiredBy: [],
        criticalPath: feature.dependencies.length === 0
      };
      
      this.dependencyGraph.set(feature.id, graph);
    });
    
    // Build reverse dependencies
    this.dependencyGraph.forEach((graph, featureId) => {
      graph.dependsOn.forEach(depId => {
        const depGraph = this.dependencyGraph.get(depId);
        if (depGraph) {
          depGraph.requiredBy.push(featureId);
        }
      });
    });
  }

  // Enhancement: Get features by admin level
  getFeaturesByAdminLevel(adminLevel: 'platform' | 'organization' | 'both'): FeatureMap[] {
    return Array.from(this.featureMaps.values()).filter(
      f => f.adminLevel === adminLevel || f.adminLevel === 'both'
    );
  }

  // Enhancement: Get RBAC mappable features
  getRBACMappableFeatures(): FeatureMap[] {
    return Array.from(this.featureMaps.values()).filter(f => f.rbacMappable);
  }

  // Enhancement: Get plan mappable features
  getPlanMappableFeatures(): FeatureMap[] {
    return Array.from(this.featureMaps.values()).filter(f => f.planMappable);
  }

  // Enhancement: Get dependency impact analysis
  getDependencyImpact(featureId: string): {
    affectedFeatures: string[];
    criticalDependencies: string[];
    riskLevel: 'low' | 'medium' | 'high';
  } {
    const graph = this.dependencyGraph.get(featureId);
    if (!graph) {
      return { affectedFeatures: [], criticalDependencies: [], riskLevel: 'low' };
    }

    const affectedFeatures = [...graph.requiredBy];
    const criticalDependencies = graph.dependsOn.filter(depId => {
      const depGraph = this.dependencyGraph.get(depId);
      return depGraph?.criticalPath;
    });

    const riskLevel = affectedFeatures.length > 5 ? 'high' : 
                     affectedFeatures.length > 2 ? 'medium' : 'low';

    return { affectedFeatures, criticalDependencies, riskLevel };
  }

  // Enhancement: Feature compatibility matrix
  getFeatureCompatibilityMatrix(): Map<string, string[]> {
    const matrix = new Map<string, string[]>();
    
    this.featureMaps.forEach(feature => {
      const compatibleFeatures = Array.from(this.featureMaps.values())
        .filter(f => f.id !== feature.id && this.areCompatible(feature, f))
        .map(f => f.id);
      
      matrix.set(feature.id, compatibleFeatures);
    });
    
    return matrix;
  }

  private areCompatible(feature1: FeatureMap, feature2: FeatureMap): boolean {
    // Check if features have conflicting dependencies or admin levels
    const hasConflictingDeps = feature1.dependencies.some(dep => 
      feature2.dependencies.includes(dep) && feature1.adminLevel !== feature2.adminLevel
    );
    
    return !hasConflictingDeps;
  }

  // Enhancement: Generate RBAC recommendations
  generateRBACRecommendations(): Array<{
    featureId: string;
    recommendedRoles: string[];
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }> {
    const recommendations: Array<{
      featureId: string;
      recommendedRoles: string[];
      reason: string;
      priority: 'high' | 'medium' | 'low';
    }> = [];

    this.featureMaps.forEach(feature => {
      if (!feature.rbacMappable) return;

      let recommendedRoles: string[] = [];
      let reason = '';
      let priority: 'high' | 'medium' | 'low' = 'medium';

      if (feature.adminLevel === 'platform') {
        recommendedRoles = ['platform_admin'];
        reason = 'Platform-level feature requires platform admin access';
        priority = 'high';
      } else if (feature.adminLevel === 'organization') {
        recommendedRoles = ['org_admin', 'team_admin'];
        reason = 'Organization-level feature suitable for org/team admins';
        priority = 'medium';
      } else {
        recommendedRoles = ['member', 'team_admin', 'org_admin'];
        reason = 'Multi-level feature can be used by various roles';
        priority = 'low';
      }

      recommendations.push({
        featureId: feature.id,
        recommendedRoles,
        reason,
        priority
      });
    });

    return recommendations;
  }

  async addFeature(feature: FeatureMap): Promise<void> {
    console.log('➕ Adding new feature:', feature.name);
    this.featureMaps.set(feature.id, {
      ...feature,
      lastUpdated: new Date()
    });
    this.buildDependencyGraph();
    this.notifyListeners();
  }

  async updateFeature(featureId: string, updates: Partial<FeatureMap>): Promise<void> {
    const existing = this.featureMaps.get(featureId);
    if (existing) {
      this.featureMaps.set(featureId, {
        ...existing,
        ...updates,
        lastUpdated: new Date()
      });
      this.buildDependencyGraph();
      this.notifyListeners();
    }
  }

  async addSubFeature(parentFeatureId: string, subFeature: SubFeature): Promise<void> {
    const parentFeature = this.featureMaps.get(parentFeatureId);
    if (parentFeature) {
      parentFeature.subFeatures.push(subFeature);
      parentFeature.lastUpdated = new Date();
      this.notifyListeners();
    }
  }

  getFeatures(): FeatureMap[] {
    return Array.from(this.featureMaps.values());
  }

  getFeature(id: string): FeatureMap | undefined {
    return this.featureMaps.get(id);
  }

  getFeaturesByCategory(category: FeatureCategory): FeatureMap[] {
    return Array.from(this.featureMaps.values()).filter(f => f.category === category);
  }

  subscribe(callback: (maps: FeatureMap[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    const features = Array.from(this.featureMaps.values());
    this.listeners.forEach(callback => callback(features));
  }

  generateDependencyGraph(): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    
    this.featureMaps.forEach(feature => {
      graph.set(feature.id, feature.dependencies);
      
      // Add sub-feature dependencies
      feature.subFeatures.forEach(subFeature => {
        if (subFeature.dependencies) {
          graph.set(subFeature.id, subFeature.dependencies);
        }
      });
    });
    
    return graph;
  }

  getFeatureStats() {
    const features = Array.from(this.featureMaps.values());
    const totalSubFeatures = features.reduce((sum, f) => sum + f.subFeatures.length, 0);
    const activeFeatures = features.filter(f => f.isActive).length;
    const platformFeatures = features.filter(f => f.adminLevel === 'platform').length;
    const orgFeatures = features.filter(f => f.adminLevel === 'organization').length;
    const bothFeatures = features.filter(f => f.adminLevel === 'both').length;
    const rbacMappable = features.filter(f => f.rbacMappable).length;
    const planMappable = features.filter(f => f.planMappable).length;
    
    const categoryCounts = features.reduce((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFeatures: features.length,
      totalSubFeatures,
      activeFeatures,
      inactiveFeatures: features.length - activeFeatures,
      platformFeatures,
      orgFeatures,
      bothFeatures,
      rbacMappable,
      planMappable,
      categoryCounts,
      lastDiscovery: new Date()
    };
  }
}

export const featureDiscoveryService = new FeatureDiscoveryService();
