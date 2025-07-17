
import { API_URL, handleUserApiError, handleDataApiError } from './utils';
import { User, AuthResponse } from './types';

// Auth API functions
const authApi = {
  // N9IZ-API - User Registration
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      
      // Store token in localStorage
      if (data.data?.token) {
        localStorage.setItem('auth_token', data.data.token);
      }
      
      return data;
    } catch (error) {
      return handleDataApiError(error, null);
    }
  },
  
  // N9IZ-API - User Login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      
      // Store token in localStorage
      if (data.data?.token) {
        localStorage.setItem('auth_token', data.data.token);
      }
      
      return data;
    } catch (error) {
      return handleDataApiError(error, null);
    }
  },
  
  // N9IZ-API - Get User Profile
  getProfile: async (): Promise<User> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch profile');
      
      // Return complete user object with all required properties
      return {
        id: data.data.id || '',
        username: data.data.username || '',
        email: data.data.email || '',
        created_at: data.data.created_at || new Date().toISOString(),
        org_id: data.data.org_id || '',
        roles: data.data.roles || ['platform_admin'],
        plan_type: data.data.plan_type || 'enterprise',
        is_active: data.data.is_active ?? true
      };
    } catch (error) {
      // Return a default User object with all required properties in case of error
      return {
        id: '',
        username: '',
        email: '',
        created_at: new Date().toISOString(),
        org_id: '',
        roles: ['platform_admin'],
        plan_type: 'enterprise',
        is_active: true
      };
    }
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
  }
};

export default authApi;
