import { API_URL, handleSecurityApiError } from './utils';

// Security API interfaces
export interface Device {
  id: string;
  name: string;
  type: string;
  last_seen: string;
  is_trusted: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  created_at: string;
  last_used?: string;
}

export interface SecurityResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Security management API functions
const securityApi = {
  // N9IZ-API - Enable Two-Factor Authentication
  enableTwoFactor: async (): Promise<SecurityResponse<{ setup_url: string; secret: string }>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/security/2fa/enable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to enable 2FA');
      
      return data;
    } catch (error) {
      return handleSecurityApiError(error, { setup_url: '', secret: '' });
    }
  },
  
  // N9IZ-API - Verify Two-Factor Authentication
  verifyTwoFactor: async (code: string): Promise<SecurityResponse<{ success: boolean }>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/security/2fa/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to verify 2FA code');
      
      return data;
    } catch (error) {
      return handleSecurityApiError(error, { success: false });
    }
  },
  
  // N9IZ-API - Disable Two-Factor Authentication
  disableTwoFactor: async (code: string): Promise<SecurityResponse<{ success: boolean }>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/security/2fa/disable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to disable 2FA');
      
      return data;
    } catch (error) {
      return handleSecurityApiError(error, { success: false });
    }
  },
  
  // N9IZ-API - Get Trusted Devices
  getTrustedDevices: async (): Promise<SecurityResponse<Device[]>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/security/devices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch trusted devices');
      
      return data;
    } catch (error) {
      return handleSecurityApiError(error, []);
    }
  },
  
  // N9IZ-API - Remove Trusted Device
  removeTrustedDevice: async (deviceId: string): Promise<SecurityResponse<{ success: boolean }>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/security/devices/${deviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to remove trusted device');
      
      return data;
    } catch (error) {
      return handleSecurityApiError(error, { success: false });
    }
  },
  
  // N9IZ-API - Get API Keys
  getApiKeys: async (): Promise<SecurityResponse<ApiKey[]>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/security/api-keys`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch API keys');
      
      return data;
    } catch (error) {
      return handleSecurityApiError(error, []);
    }
  },
  
  // N9IZ-API - Create API Key
  createApiKey: async (name: string, permissions: string[]): Promise<SecurityResponse<ApiKey>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/security/api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, permissions }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create API key');
      
      return data;
    } catch (error) {
      return handleSecurityApiError(error, {} as ApiKey);
    }
  },
  
  // N9IZ-API - Delete API Key
  deleteApiKey: async (keyId: string): Promise<SecurityResponse<{ success: boolean }>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/security/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete API key');
      
      return data;
    } catch (error) {
      return handleSecurityApiError(error, { success: false });
    }
  }
};

export default securityApi;
