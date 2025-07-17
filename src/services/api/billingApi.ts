import { API_URL, handleDataApiError } from './utils';

// Billing API interfaces
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: Array<{
    title: string;
    included: boolean;
  }>;
  highlight?: boolean;
}

export interface UserSubscription {
  id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  current_period_end: string;
  cancel_at_period_end: boolean;
  payment_method?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  usage?: {
    events: {
      used: number;
      total: number;
    };
  };
}

export interface Invoice {
  id: string;
  amount_paid: number;
  currency: string;
  created: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  invoice_pdf?: string;
}

export interface BillingResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Billing management API functions
const billingApi = {
  // N9IZ-API - Get Available Plans
  getPlans: async (): Promise<BillingResponse<SubscriptionPlan[]>> => {
    try {
      const response = await fetch(`${API_URL}/billing/plans`);
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch plans');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, []);
    }
  },
  
  // N9IZ-API - Get User Subscription
  getUserSubscription: async (): Promise<BillingResponse<UserSubscription>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/billing/subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch subscription');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, {} as UserSubscription);
    }
  },
  
  // N9IZ-API - Create Checkout Session
  createCheckoutSession: async (planId: string): Promise<BillingResponse<{ url: string }>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/billing/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ plan_id: planId }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create checkout session');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, { url: '' });
    }
  },
  
  // N9IZ-API - Create Customer Portal Session
  createCustomerPortalSession: async (): Promise<BillingResponse<{ url: string }>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/billing/customer-portal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create customer portal session');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, { url: '' });
    }
  },
  
  // N9IZ-API - Get Invoices
  getInvoices: async (): Promise<BillingResponse<Invoice[]>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/billing/invoices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch invoices');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, []);
    }
  }
};

export default billingApi;
