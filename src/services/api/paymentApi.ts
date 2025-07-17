import { API_URL, handleDataApiError } from './utils';

// Payment API interfaces
export interface PaymentGatewayConfig {
  id?: string;
  provider: string;
  api_key: string;
  is_test_mode: boolean;
  merchant_id?: string;
  webhook_secret?: string;
  is_active: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethodConfig {
  id: string;
  gateway_id: string;
  method_type: 'card' | 'google_pay' | 'apple_pay' | 'upi' | 'net_banking';
  is_enabled: boolean;
}

export interface PaymentResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Payment management API functions
const paymentApi = {
  // N9IZ-API - Get Payment Gateway Configuration
  getConfig: async (provider: string): Promise<PaymentResponse<PaymentGatewayConfig>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/payments/config/${provider}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch payment configuration');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, {} as PaymentGatewayConfig);
    }
  },
  
  // N9IZ-API - Save Payment Gateway Configuration
  saveConfig: async (config: Omit<PaymentGatewayConfig, 'user_id' | 'created_at' | 'updated_at'>): Promise<PaymentResponse<PaymentGatewayConfig>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/payments/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save payment configuration');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, {} as PaymentGatewayConfig);
    }
  },
  
  // N9IZ-API - Test Payment Gateway Connection
  testConnection: async (provider: string): Promise<PaymentResponse<{ success: boolean }>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/payments/test/${provider}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to test connection');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, { success: false });
    }
  },
  
  // N9IZ-API - Get Payment Methods
  getPaymentMethods: async (provider: string): Promise<PaymentResponse<PaymentMethodConfig[]>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/payments/methods/${provider}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch payment methods');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, []);
    }
  },
  
  // N9IZ-API - Update Payment Method
  updatePaymentMethod: async (methodId: string, isEnabled: boolean): Promise<PaymentResponse<PaymentMethodConfig>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/payments/methods/${methodId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_enabled: isEnabled }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update payment method');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, {} as PaymentMethodConfig);
    }
  }
};

export default paymentApi;
