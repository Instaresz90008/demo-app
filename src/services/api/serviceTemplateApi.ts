
import { api } from '@/lib/api';

export interface ServiceTemplate {
  id: string;
  title: string;
  description: string;
  booking_type_id: string;
  booking_type_name: string;
  booking_type_key: string;
  booking_type_icon: string;
  default_config: {
    duration_mins?: number;
    capacity?: number;
    pricing_config?: {
      price?: number;
      hourly_rate?: number;
      monthly_price?: number;
      price_per_person?: number;
      bundle_price?: number;
    };
  };
  tags: string[];
  popularity_score: number;
  industry?: string;
  subcategory?: string;
  display_price?: {
    amount: number;
    currency: string;
    label: string;
  };
  is_active: boolean;
  created_at: string;
}

interface TemplateFilters {
  bookingType?: string;
  industry?: string;
  subcategory?: string;
  tags?: string[];
}

// Enhanced mock data with proper industry mapping
const MOCK_TEMPLATES: ServiceTemplate[] = [
  {
    id: 'therapy-session-1',
    title: 'Mental Health Therapy Session',
    description: 'Professional mental health counseling session',
    booking_type_id: 'one-to-one',
    booking_type_name: 'One-on-One',
    booking_type_key: 'one-to-one',
    booking_type_icon: '👥',
    default_config: {
      duration_mins: 60,
      capacity: 1,
      pricing_config: {
        price: 200
      }
    },
    tags: ['therapy', 'mental health', 'counseling', 'recommended', 'healthcare', 'wellness'],
    popularity_score: 95,
    industry: 'healthcare-therapy',
    subcategory: 'therapy',
    display_price: {
      amount: 200,
      currency: 'USD',
      label: '$200/session'
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'fitness-training-1',
    title: 'Personal Fitness Training',
    description: 'One-on-one fitness coaching and training session',
    booking_type_id: 'one-to-one',
    booking_type_name: 'One-on-One',
    booking_type_key: 'one-to-one',
    booking_type_icon: '👥',
    default_config: {
      duration_mins: 60,
      capacity: 1,
      pricing_config: {
        price: 100
      }
    },
    tags: ['fitness', 'training', 'exercise', 'health', 'recommended', 'wellness'],
    popularity_score: 90,
    industry: 'fitness-wellness',
    subcategory: 'fitness',
    display_price: {
      amount: 100,
      currency: 'USD',
      label: '$100/session'
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'nutrition-consultation-1',
    title: 'Nutrition Consultation',
    description: 'Personalized nutrition and diet planning session',
    booking_type_id: 'one-to-one',
    booking_type_name: 'One-on-One',
    booking_type_key: 'one-to-one',
    booking_type_icon: '👥',
    default_config: {
      duration_mins: 45,
      capacity: 1,
      pricing_config: {
        price: 120
      }
    },
    tags: ['nutrition', 'diet', 'health', 'wellness', 'fitness'],
    popularity_score: 88,
    industry: 'fitness-wellness',
    subcategory: 'nutrition',
    display_price: {
      amount: 120,
      currency: 'USD',
      label: '$120/session'
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'group-fitness-1',
    title: 'Group Fitness Class',
    description: 'Small group workout sessions for fitness enthusiasts',
    booking_type_id: 'group',
    booking_type_name: 'Group Session',
    booking_type_key: 'group',
    booking_type_icon: '👥',
    default_config: {
      duration_mins: 45,
      capacity: 8,
      pricing_config: {
        price_per_person: 25
      }
    },
    tags: ['fitness', 'group', 'exercise', 'community', 'wellness'],
    popularity_score: 87,
    industry: 'fitness-wellness',
    subcategory: 'fitness',
    display_price: {
      amount: 25,
      currency: 'USD',
      label: '$25/person'
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'physical-therapy-1',
    title: 'Physical Therapy Session',
    description: 'Professional physical rehabilitation and therapy',
    booking_type_id: 'one-to-one',
    booking_type_name: 'One-on-One',
    booking_type_key: 'one-to-one',
    booking_type_icon: '👥',
    default_config: {
      duration_mins: 60,
      capacity: 1,
      pricing_config: {
        price: 150
      }
    },
    tags: ['therapy', 'physical', 'rehabilitation', 'healthcare', 'recommended', 'wellness'],
    popularity_score: 88,
    industry: 'healthcare-therapy',
    subcategory: 'physical-therapy',
    display_price: {
      amount: 150,
      currency: 'USD',
      label: '$150/session'
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'wellness-coaching-1',
    title: 'Wellness Coaching Session',
    description: 'Holistic health and wellness coaching',
    booking_type_id: 'one-to-one',
    booking_type_name: 'One-on-One',
    booking_type_key: 'one-to-one',
    booking_type_icon: '👥',
    default_config: {
      duration_mins: 45,
      capacity: 1,
      pricing_config: {
        price: 90
      }
    },
    tags: ['wellness', 'coaching', 'health', 'lifestyle', 'fitness'],
    popularity_score: 85,
    industry: 'fitness-wellness',
    subcategory: 'wellness',
    display_price: {
      amount: 90,
      currency: 'USD',
      label: '$90/session'
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'yoga-class-1',
    title: 'Yoga & Mindfulness Session',
    description: 'Relaxing yoga and mindfulness practice',
    booking_type_id: 'one-to-one',
    booking_type_name: 'One-on-One',
    booking_type_key: 'one-to-one',
    booking_type_icon: '👥',
    default_config: {
      duration_mins: 60,
      capacity: 1,
      pricing_config: {
        price: 80
      }
    },
    tags: ['yoga', 'mindfulness', 'wellness', 'fitness', 'health'],
    popularity_score: 92,
    industry: 'fitness-wellness',
    subcategory: 'yoga',
    display_price: {
      amount: 80,
      currency: 'USD',
      label: '$80/session'
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'pilates-session-1',
    title: 'Pilates Training',
    description: 'Core strengthening and flexibility training',
    booking_type_id: 'one-to-one',
    booking_type_name: 'One-on-One',
    booking_type_key: 'one-to-one',
    booking_type_icon: '👥',
    default_config: {
      duration_mins: 50,
      capacity: 1,
      pricing_config: {
        price: 95
      }
    },
    tags: ['pilates', 'fitness', 'core', 'strength', 'wellness'],
    popularity_score: 86,
    industry: 'fitness-wellness',
    subcategory: 'pilates',
    display_price: {
      amount: 95,
      currency: 'USD',
      label: '$95/session'
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  }
];

const serviceTemplateApi = {
  // Get all templates with optional filters
  getTemplates: async (filters: TemplateFilters = {}): Promise<ServiceTemplate[]> => {
    try {
      console.log('=== TEMPLATE FILTERING DEBUG ===');
      console.log('Input filters:', filters);
      
      let filteredTemplates = [...MOCK_TEMPLATES];
      console.log('Starting with', filteredTemplates.length, 'templates');

      // Industry filtering with flexible matching
      if (filters.industry) {
        console.log('Filtering by industry:', filters.industry);
        
        filteredTemplates = filteredTemplates.filter(template => {
          // Direct industry match
          const directMatch = template.industry === filters.industry;
          
          // Tag-based matching
          const tagMatch = template.tags.some(tag => {
            const normalizedTag = tag.toLowerCase();
            const normalizedIndustry = filters.industry!.toLowerCase();
            
            // Check if industry contains tag or vice versa
            return normalizedTag.includes(normalizedIndustry) || 
                   normalizedIndustry.includes(normalizedTag);
          });
          
          // Special industry mappings
          let specialMatch = false;
          if (filters.industry === 'fitness-wellness') {
            specialMatch = template.tags.some(tag => 
              ['fitness', 'wellness', 'health', 'yoga', 'pilates', 'nutrition'].includes(tag.toLowerCase())
            ) || template.industry?.includes('fitness') || template.industry?.includes('wellness');
          }
          
          if (filters.industry === 'healthcare-therapy') {
            specialMatch = template.tags.some(tag => 
              ['healthcare', 'therapy', 'mental', 'physical'].includes(tag.toLowerCase())
            ) || template.industry?.includes('healthcare') || template.industry?.includes('therapy');
          }
          
          const matches = directMatch || tagMatch || specialMatch;
          console.log(`Template "${template.title}": direct=${directMatch}, tag=${tagMatch}, special=${specialMatch}, final=${matches}`);
          
          return matches;
        });
        
        console.log('After industry filtering:', filteredTemplates.length, 'templates');
      }

      // Subcategory filtering (more lenient)
      if (filters.subcategory) {
        console.log('Filtering by subcategory:', filters.subcategory);
        filteredTemplates = filteredTemplates.filter(template => {
          const subcategoryMatch = template.subcategory === filters.subcategory ||
            template.tags.some(tag => tag.toLowerCase().includes(filters.subcategory!.toLowerCase())) ||
            filters.subcategory!.toLowerCase().includes(template.subcategory?.toLowerCase() || '');
          
          console.log(`Template "${template.title}" subcategory match:`, subcategoryMatch);
          return subcategoryMatch;
        });
        console.log('After subcategory filtering:', filteredTemplates.length, 'templates');
      }

      // Booking type filtering
      if (filters.bookingType) {
        console.log('Filtering by booking type:', filters.bookingType);
        filteredTemplates = filteredTemplates.filter(template => {
          const match = template.booking_type_key === filters.bookingType;
          console.log(`Template "${template.title}" booking type match:`, match);
          return match;
        });
        console.log('After booking type filtering:', filteredTemplates.length, 'templates');
      }

      console.log('=== FINAL RESULT ===');
      console.log('Returning', filteredTemplates.length, 'templates');
      filteredTemplates.forEach(t => console.log(`- ${t.title} (${t.industry})`));
      
      return filteredTemplates;
    } catch (error) {
      console.error('Error in getTemplates:', error);
      // Return a fallback set of templates instead of empty array
      return MOCK_TEMPLATES.slice(0, 3);
    }
  },

  // Get template by ID
  getTemplate: async (id: string): Promise<ServiceTemplate | null> => {
    try {
      return MOCK_TEMPLATES.find(t => t.id === id) || null;
    } catch (error) {
      console.error('Error fetching template:', error);
      return null;
    }
  },

  // Create template from existing service
  createFromService: async (serviceId: string, templateData: {
    title: string;
    description: string;
    tags: string[];
    is_public?: boolean;
  }): Promise<ServiceTemplate> => {
    try {
      const result = await api.post(`/service-templates/from-service/${serviceId}`, templateData);
      return result.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },
};

// Named exports for Redux compatibility
export const fetchServiceTemplates = serviceTemplateApi.getTemplates;
export const createServiceTemplate = serviceTemplateApi.createFromService;
export const updateServiceTemplate = async (id: string, template: Partial<ServiceTemplate>) => {
  return { ...template, id } as ServiceTemplate;
};
export const deleteServiceTemplate = async (id: string) => {
  return { success: true };
};

export default serviceTemplateApi;
