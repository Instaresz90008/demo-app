
import { Service } from '@/services/api/serviceApi';
import { UserSubscription } from '@/types/subscription';

export interface ServiceCatalog {
  id: string;
  userId: string;
  name: string;
  description: string;
  services: Service[];
  embedCode: string;
  isPublic: boolean;
  customDomain?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    totalBookings: number;
  };
}

export interface ServicePublication {
  id: string;
  serviceId: string;
  userId: string;
  isPublished: boolean;
  publicUrl: string;
  embedCode: string;
  customSettings: {
    allowDirectBooking: boolean;
    requireApproval: boolean;
    collectPayment: boolean;
  };
  analytics: {
    views: number;
    bookings: number;
    conversionRate: number;
  };
}

export class ServiceManagementService {
  // Get service limits based on subscription
  static getServiceLimits(subscription: UserSubscription | null): {
    maxServices: number;
    canCreateCatalog: boolean;
    canUseCustomDomain: boolean;
  } {
    if (!subscription || subscription.status !== 'active') {
      return {
        maxServices: 1,
        canCreateCatalog: false,
        canUseCustomDomain: false
      };
    }

    switch (subscription.planId) {
      case 'free':
        return {
          maxServices: 1,
          canCreateCatalog: false,
          canUseCustomDomain: false
        };
      case 'basic':
        return {
          maxServices: 3,
          canCreateCatalog: true,
          canUseCustomDomain: false
        };
      case 'pro':
        return {
          maxServices: 5,
          canCreateCatalog: true,
          canUseCustomDomain: true
        };
      case 'enterprise':
        return {
          maxServices: -1, // unlimited
          canCreateCatalog: true,
          canUseCustomDomain: true
        };
      default:
        return {
          maxServices: 1,
          canCreateCatalog: false,
          canUseCustomDomain: false
        };
    }
  }

  // Check if user can create more services
  static canCreateService(currentServices: Service[], subscription: UserSubscription | null): boolean {
    const limits = this.getServiceLimits(subscription);
    if (limits.maxServices === -1) return true;
    return currentServices.length < limits.maxServices;
  }

  // Publish a service individually
  static publishService(service: Service, userId: string): ServicePublication {
    const publicUrl = `${window.location.origin}/book/${service.id}`;
    const embedCode = `<iframe src="${publicUrl}" width="100%" height="600" frameborder="0"></iframe>`;

    return {
      id: `pub-${service.id}-${Date.now()}`,
      serviceId: service.id,
      userId,
      isPublished: true,
      publicUrl,
      embedCode,
      customSettings: {
        allowDirectBooking: true,
        requireApproval: false,
        collectPayment: false
      },
      analytics: {
        views: 0,
        bookings: 0,
        conversionRate: 0
      }
    };
  }

  // Create a service catalog
  static createServiceCatalog(
    services: Service[], 
    userId: string, 
    catalogName: string,
    description: string = ''
  ): ServiceCatalog {
    const catalogId = `catalog-${userId}-${Date.now()}`;
    const publicUrl = `${window.location.origin}/catalog/${catalogId}`;
    const embedCode = `<iframe src="${publicUrl}" width="100%" height="800" frameborder="0"></iframe>`;

    return {
      id: catalogId,
      userId,
      name: catalogName,
      description,
      services,
      embedCode,
      isPublic: true,
      theme: {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        fontFamily: 'Inter'
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalBookings: 0
      }
    };
  }

  // Get booking link for individual service
  static getServiceBookingLink(service: Service): string {
    return `${window.location.origin}/book/${service.id}`;
  }

  // Get catalog booking link
  static getCatalogBookingLink(catalog: ServiceCatalog): string {
    return `${window.location.origin}/catalog/${catalog.id}`;
  }

  // Generate service embed code
  static generateServiceEmbedCode(service: Service, customization?: {
    width?: string;
    height?: string;
    theme?: string;
  }): string {
    const width = customization?.width || '100%';
    const height = customization?.height || '600';
    const theme = customization?.theme || 'light';
    const url = `${window.location.origin}/book/${service.id}?theme=${theme}`;
    
    return `<iframe src="${url}" width="${width}" height="${height}" frameborder="0" style="border-radius: 8px;"></iframe>`;
  }

  // Generate catalog embed code
  static generateCatalogEmbedCode(catalog: ServiceCatalog, customization?: {
    width?: string;
    height?: string;
    theme?: string;
  }): string {
    const width = customization?.width || '100%';
    const height = customization?.height || '800';
    const theme = customization?.theme || 'light';
    const url = `${window.location.origin}/catalog/${catalog.id}?theme=${theme}`;
    
    return `<iframe src="${url}" width="${width}" height="${height}" frameborder="0" style="border-radius: 8px;"></iframe>`;
  }

  // Update service publication settings
  static updateServicePublication(
    publication: ServicePublication, 
    settings: Partial<ServicePublication['customSettings']>
  ): ServicePublication {
    return {
      ...publication,
      customSettings: {
        ...publication.customSettings,
        ...settings
      }
    };
  }

  // Get analytics for published services
  static getServiceAnalytics(publications: ServicePublication[]): {
    totalViews: number;
    totalBookings: number;
    averageConversion: number;
    topPerforming: ServicePublication | null;
  } {
    const totalViews = publications.reduce((sum, pub) => sum + pub.analytics.views, 0);
    const totalBookings = publications.reduce((sum, pub) => sum + pub.analytics.bookings, 0);
    const averageConversion = totalViews > 0 ? (totalBookings / totalViews) * 100 : 0;
    
    const topPerforming = publications.reduce((top, current) => {
      if (!top) return current;
      return current.analytics.bookings > top.analytics.bookings ? current : top;
    }, null as ServicePublication | null);

    return {
      totalViews,
      totalBookings,
      averageConversion,
      topPerforming
    };
  }
}
