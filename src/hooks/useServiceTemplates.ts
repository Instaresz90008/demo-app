
import { useQuery } from '@tanstack/react-query';
import serviceTemplateApi, { ServiceTemplate } from '@/services/api/serviceTemplateApi';

interface TemplateFilters {
  bookingType?: string;
  industry?: string;
  subcategory?: string;
  tags?: string[];
}

export const useServiceTemplates = (filters: TemplateFilters = {}) => {
  return useQuery({
    queryKey: ['service-templates', filters],
    queryFn: async () => {
      console.log('🔍 useServiceTemplates: Fetching with filters:', filters);
      try {
        const result = await serviceTemplateApi.getTemplates(filters);
        console.log('✅ useServiceTemplates: Success, got', result.length, 'templates');
        return result;
      } catch (error) {
        console.error('❌ useServiceTemplates: Error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

export const useServiceTemplate = (id: string) => {
  return useQuery({
    queryKey: ['service-template', id],
    queryFn: () => serviceTemplateApi.getTemplate(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
