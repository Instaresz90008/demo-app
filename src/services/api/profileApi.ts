import { apiRequest } from './utils';

export interface ProfileData {
  id?: string;
  user_id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  industry?: string;
  bio?: string;
  location?: string;
  website?: string;
  timezone?: string;
  language?: string;
  avatar?: string | null;
  linkedinUrl?: string;
  twitterUrl?: string;
  workingHours?: {
    start: string;
    end: string;
  };
  workingDays?: string[];
  breakTime?: {
    start: string;
    end: string;
  };
  privacySettings?: {
    showProfile: boolean;
    showContact: boolean;
    showAvailability: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export interface ProfileApiResponse {
  success: boolean;
  data: ProfileData;
  message?: string;
}

export interface ProfileListResponse {
  success: boolean;
  data: ProfileData[];
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}

const profileApi = {
  // Get current user's profile
  getProfile: async (): Promise<ProfileData> => {
    const response = await apiRequest<ProfileApiResponse>('/api/profile', {
      method: 'GET',
    });
    return response.data;
  },

  // Create profile
  createProfile: async (profileData: Omit<ProfileData, 'id' | 'created_at' | 'updated_at'>): Promise<ProfileData> => {
    const response = await apiRequest<ProfileApiResponse>('/api/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData: Partial<ProfileData>): Promise<ProfileData> => {
    const response = await apiRequest<ProfileApiResponse>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data;
  },

  // Delete profile
  deleteProfile: async (): Promise<void> => {
    await apiRequest('/api/profile', {
      method: 'DELETE',
    });
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch('/api/profile/avatar', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload avatar');
    }

    const result = await response.json();
    return result.data;
  },

  // Get profile by user ID (admin only)
  getProfileById: async (userId: string): Promise<ProfileData> => {
    const response = await apiRequest<ProfileApiResponse>(`/api/profile/${userId}`, {
      method: 'GET',
    });
    return response.data;
  },

  // Get all profiles (admin only)
  getAllProfiles: async (limit = 50, offset = 0): Promise<ProfileListResponse> => {
    const response = await apiRequest<ProfileListResponse>(`/api/profile/all?limit=${limit}&offset=${offset}`, {
      method: 'GET',
    });
    return response;
  },
};

export default profileApi;