// Core API types
export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  org_id: string;
  roles: string[];
  plan_type: string;
  is_active: boolean;
  segment?: 'individual' | 'team_admin' | 'org_admin' | 'sub_team_admin' | 'team_member';
  primaryRole?: 'end_user' | 'admin' | 'org_admin' | 'platform_admin';
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  } | null;
  error?: string;
}

export interface Conversation {
  id: number;
  user_id: string;
  user_query: string;
  response: string;
  created_at: string;
}

export interface NotificationSettings {
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  sms_enabled: boolean;
  booking_notifications: boolean;
  reminder_notifications: boolean;
  marketing_notifications: boolean;
  update_notifications: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
