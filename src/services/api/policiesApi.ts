import { API_URL, handleDataApiError } from './utils';

// Policy API interfaces
export interface Policy {
  id: string;
  type: 'cancellation' | 'rescheduling' | 'refund' | 'noShow';
  title: string;
  description: string;
  content: string;
  variables: Record<string, string>;
  document_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PolicyResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Policy management API functions
const policiesApi = {
  // N9IZ-API - Get All Policies
  getAllPolicies: async (): Promise<PolicyResponse<Record<string, Policy>>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/policies`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch policies');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, {});
    }
  },
  
  // N9IZ-API - Get Policy
  getPolicy: async (type: string): Promise<PolicyResponse<Policy>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/policies/${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch policy');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, {} as Policy);
    }
  },
  
  // N9IZ-API - Save Policy
  savePolicy: async (policy: Omit<Policy, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<PolicyResponse<Policy>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/policies/${policy.type}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(policy),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save policy');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, {} as Policy);
    }
  },
  
  // N9IZ-API - Upload Policy Document
  uploadPolicyDocument: async (type: string, file: File): Promise<PolicyResponse<{ document_url: string }>> => {
    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await fetch(`${API_URL}/policies/${type}/document`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to upload document');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, { document_url: '' });
    }
  }
};

export default policiesApi;
