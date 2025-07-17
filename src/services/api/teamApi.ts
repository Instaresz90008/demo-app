import { API_URL, handleDataApiError } from './utils';

// Team API interfaces
export interface TeamMember {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  avatar_url?: string;
  initials?: string;
  created_at: string;
}

export interface TeamSettings {
  id: string;
  name: string;
  default_role: 'admin' | 'member' | 'viewer';
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface TeamResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Team management API functions
const teamApi = {
  // N9IZ-API - Get Team Members
  getTeamMembers: async (): Promise<TeamResponse<TeamMember[]>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/team/members`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch team members');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, []);
    }
  },
  
  // N9IZ-API - Get Pending Invitations
  getPendingInvitations: async (): Promise<TeamResponse<TeamMember[]>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/team/invitations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch pending invitations');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, []);
    }
  },
  
  // N9IZ-API - Invite Team Member
  inviteTeamMember: async (email: string, role: string, message?: string): Promise<TeamResponse<{ id: string }>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/team/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email, role, message }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to invite team member');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, { id: '' });
    }
  },
  
  // N9IZ-API - Update Team Member Role
  updateTeamMemberRole: async (memberId: string, role: string): Promise<TeamResponse<{ success: boolean }>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/team/members/${memberId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update team member role');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, { success: false });
    }
  },
  
  // N9IZ-API - Remove Team Member
  removeTeamMember: async (memberId: string): Promise<TeamResponse<{ success: boolean }>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/team/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to remove team member');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, { success: false });
    }
  },
  
  // N9IZ-API - Resend Invitation
  resendInvitation: async (invitationId: string): Promise<TeamResponse<{ success: boolean }>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/team/invitations/${invitationId}/resend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to resend invitation');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, { success: false });
    }
  },
  
  // N9IZ-API - Cancel Invitation
  cancelInvitation: async (invitationId: string): Promise<TeamResponse<{ success: boolean }>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/team/invitations/${invitationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to cancel invitation');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, { success: false });
    }
  },
  
  // N9IZ-API - Get Team Settings
  getTeamSettings: async (): Promise<TeamResponse<TeamSettings>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/team/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch team settings');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, {} as TeamSettings);
    }
  },
  
  // N9IZ-API - Update Team Name
  updateTeamName: async (name: string): Promise<TeamResponse<{ success: boolean }>> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/team/settings/name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update team name');
      
      return data;
    } catch (error) {
      return handleDataApiError(error, { success: false });
    }
  }
};

export default teamApi;
