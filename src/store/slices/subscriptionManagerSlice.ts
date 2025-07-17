import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface SubscriptionPlan {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  features: string[];
  limits: Record<string, number>;
  billing_cycle: 'monthly' | 'yearly' | 'one-time';
  base_price: number;
  regional_overrides: Record<string, any>;
  is_template: boolean;
  status: 'active' | 'inactive' | 'draft';
  trial_period_days: number;
  created_at: string;
  updated_at: string;
}

export interface TenantSubscription {
  id: string;
  tenant_id: string;
  user_id: number;
  plan_id: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'paused';
  usage: Record<string, any>;
  start_date: string;
  next_billing_date?: string;
  external_customer_id?: string;
  external_subscription_id?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Joined fields
  plan_name?: string;
  base_price?: number;
  user_email?: string;
  amount?: number; // Added for subscription amount
}

// Export alias for backward compatibility
export type Subscription = TenantSubscription;

export interface SubscriptionAnalytics {
  total_subscriptions: number;
  active_subscriptions: number;
  mrr: number;
  avg_revenue_per_user: number;
  growth_rate?: number; // Added missing property
  churn_rate?: number; // Added missing property
}

interface SubscriptionManagerState {
  plans: SubscriptionPlan[];
  subscriptions: TenantSubscription[];
  analytics: SubscriptionAnalytics | null;
  currentTenantId: string;
  loading: {
    plans: boolean;
    subscriptions: boolean;
    analytics: boolean;
  };
  error: string | null;
}

const initialState: SubscriptionManagerState = {
  plans: [],
  subscriptions: [],
  analytics: null,
  currentTenantId: 'platform',
  loading: {
    plans: false,
    subscriptions: false,
    analytics: false,
  },
  error: null,
};

// Async thunks
export const fetchPlans = createAsyncThunk(
  'subscriptionManager/fetchPlans',
  async (params: { tenantId?: string; includeTemplates?: boolean } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.tenantId) queryParams.append('tenant_id', params.tenantId);
    if (params.includeTemplates) queryParams.append('include_templates', 'true');

    const response = await fetch(`/api/subscription-manager/plans?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch plans');
    }

    const data = await response.json();
    return data;
  }
);

export const createPlan = createAsyncThunk(
  'subscriptionManager/createPlan',
  async (planData: Partial<SubscriptionPlan>) => {
    const response = await fetch('/api/subscription-manager/plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(planData),
    });

    if (!response.ok) {
      throw new Error('Failed to create plan');
    }

    const data = await response.json();
    return data.data;
  }
);

export const updatePlan = createAsyncThunk(
  'subscriptionManager/updatePlan',
  async ({ id, updates }: { id: string; updates: Partial<SubscriptionPlan> }) => {
    const response = await fetch(`/api/subscription-manager/plans/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update plan');
    }

    const data = await response.json();
    return data.data;
  }
);

export const deletePlan = createAsyncThunk(
  'subscriptionManager/deletePlan',
  async (id: string) => {
    const response = await fetch(`/api/subscription-manager/plans/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete plan');
    }

    return id;
  }
);

export const fetchSubscriptions = createAsyncThunk(
  'subscriptionManager/fetchSubscriptions',
  async (params: { tenantId?: string; userId?: string; status?: string } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.tenantId) queryParams.append('tenant_id', params.tenantId);
    if (params.userId) queryParams.append('user_id', params.userId);
    if (params.status) queryParams.append('status', params.status);

    const response = await fetch(`/api/subscription-manager/subscriptions?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscriptions');
    }

    const data = await response.json();
    return data.data;
  }
);

export const updateSubscription = createAsyncThunk(
  'subscriptionManager/updateSubscription',
  async ({ id, updates }: { id: string; updates: Partial<TenantSubscription> }) => {
    const response = await fetch(`/api/subscription-manager/subscriptions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }

    const data = await response.json();
    return data.data;
  }
);

export const fetchAnalytics = createAsyncThunk(
  'subscriptionManager/fetchAnalytics',
  async (params: { tenantId?: string } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.tenantId) queryParams.append('tenant_id', params.tenantId);

    const response = await fetch(`/api/subscription-manager/analytics?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    const data = await response.json();
    return data.data;
  }
);

const subscriptionManagerSlice = createSlice({
  name: 'subscriptionManager',
  initialState,
  reducers: {
    setCurrentTenantId: (state, action: PayloadAction<string>) => {
      state.currentTenantId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Plans
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.loading.plans = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading.plans = false;
        state.plans = action.payload.data;
        if (action.payload.tenant_id) {
          state.currentTenantId = action.payload.tenant_id;
        }
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading.plans = false;
        state.error = action.error.message || 'Failed to fetch plans';
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.plans.unshift(action.payload);
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        const index = state.plans.findIndex(plan => plan.id === action.payload.id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.plans = state.plans.filter(plan => plan.id !== action.payload);
      })
      // Subscriptions
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading.subscriptions = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading.subscriptions = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading.subscriptions = false;
        state.error = action.error.message || 'Failed to fetch subscriptions';
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        const index = state.subscriptions.findIndex(sub => sub.id === action.payload.id);
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
      })
      // Analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading.analytics = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading.analytics = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading.analytics = false;
        state.error = action.error.message || 'Failed to fetch analytics';
      });
  },
});

export const { setCurrentTenantId, clearError, resetState } = subscriptionManagerSlice.actions;
export default subscriptionManagerSlice.reducer;
