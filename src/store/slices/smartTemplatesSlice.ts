
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { ServiceTemplate, fetchServiceTemplates, createServiceTemplate, updateServiceTemplate, deleteServiceTemplate } from '@/services/api/serviceTemplateApi';

// ServiceTemplate interface is imported from the API file

interface SmartTemplatesState {
  templates: ServiceTemplate[];
  selectedTemplate: ServiceTemplate | null;
  loading: boolean;
  error: string | null;
  filters: {
    industry?: string;
    subcategory?: string;
    bookingType?: string;
    tags?: string[];
  };
}

const initialState: SmartTemplatesState = {
  templates: [],
  selectedTemplate: null,
  loading: false,
  error: null,
  filters: {}
};

// Async thunks
export const fetchTemplates = createAsyncThunk(
  'smartTemplates/fetchTemplates',
  async (params: { industry?: string; subcategory?: string; bookingType?: string }) => {
    const response = await fetchServiceTemplates(params);
    return response;
  }
);

export const createTemplate = createAsyncThunk(
  'smartTemplates/createTemplate',
  async ({ serviceId, templateData }: { serviceId: string; templateData: { title: string; description: string; tags: string[]; is_public?: boolean; } }) => {
    const response = await createServiceTemplate(serviceId, templateData);
    toast.success('Template created successfully');
    return response;
  }
);

export const updateTemplate = createAsyncThunk(
  'smartTemplates/updateTemplate',
  async ({ id, template }: { id: string; template: Partial<ServiceTemplate> }) => {
    const response = await updateServiceTemplate(id, template);
    toast.success('Template updated successfully');
    return response;
  }
);

export const deleteTemplate = createAsyncThunk(
  'smartTemplates/deleteTemplate',
  async (id: string) => {
    await deleteServiceTemplate(id);
    toast.success('Template deleted successfully');
    return id;
  }
);

const smartTemplatesSlice = createSlice({
  name: 'smartTemplates',
  initialState,
  reducers: {
    setSelectedTemplate: (state, action: PayloadAction<ServiceTemplate | null>) => {
      state.selectedTemplate = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<SmartTemplatesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch templates
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch templates';
      });

    // Create template
    builder
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.push(action.payload);
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create template';
      });

    // Update template
    builder
      .addCase(updateTemplate.fulfilled, (state, action) => {
        const index = state.templates.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
        if (state.selectedTemplate?.id === action.payload.id) {
          state.selectedTemplate = action.payload;
        }
      });

    // Delete template
    builder
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.filter(t => t.id !== action.payload);
        if (state.selectedTemplate?.id === action.payload) {
          state.selectedTemplate = null;
        }
      });
  }
});

export const { setSelectedTemplate, setFilters, clearFilters, clearError } = smartTemplatesSlice.actions;
export default smartTemplatesSlice.reducer;
