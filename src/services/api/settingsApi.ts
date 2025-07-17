import { apiRequest } from './utils';

export interface NotificationSettings {
  email: {
    bookingConfirmations: boolean;
    reminderEmails: boolean;
    promotionalEmails: boolean;
    systemUpdates: boolean;
  };
  push: {
    bookingReminders: boolean;
    newBookings: boolean;
    cancellations: boolean;
    systemAlerts: boolean;
  };
  sms: {
    urgentNotifications: boolean;
    bookingReminders: boolean;
  };
}

export interface PrivacySettings {
  showProfile: boolean;
  showCalendar: boolean;
  allowDirectBooking: boolean;
  requireApproval: boolean;
}

export interface CalendarSettings {
  defaultView: string;
  startTime: string;
  endTime: string;
  timeFormat: string;
  firstDayOfWeek: number;
}

export interface BookingSettings {
  defaultDuration: number;
  bufferTime: number;
  maxAdvanceBooking: number;
  allowBackToBack: boolean;
  requirePayment: boolean;
}

export interface IntegrationSettings {
  googleCalendar: {
    enabled: boolean;
    syncEvents: boolean;
    calendarId: string | null;
  };
  zoom: {
    enabled: boolean;
    autoCreateMeetings: boolean;
    apiKey: string | null;
  };
  slack: {
    enabled: boolean;
    notifications: boolean;
    webhookUrl: string | null;
  };
}

export interface UserSettings {
  theme: string;
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  calendar: CalendarSettings;
  booking: BookingSettings;
  integrations: IntegrationSettings;
}

export interface SettingsApiResponse {
  success: boolean;
  data: {
    id: string;
    user_id: string;
    settings_data: UserSettings;
    created_at: string;
    updated_at: string;
  };
  message?: string;
}

const settingsApi = {
  // Get current user's settings
  getSettings: async (): Promise<UserSettings> => {
    const response = await apiRequest<SettingsApiResponse>('/api/settings', {
      method: 'GET',
    });
    return response.data.settings_data;
  },

  // Update all settings
  updateSettings: async (settings: UserSettings): Promise<UserSettings> => {
    const response = await apiRequest<SettingsApiResponse>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return response.data.settings_data;
  },

  // Update specific settings section
  updateSection: async (section: string, sectionData: any): Promise<UserSettings> => {
    const response = await apiRequest<SettingsApiResponse>(`/api/settings/section/${section}`, {
      method: 'PUT',
      body: JSON.stringify(sectionData),
    });
    return response.data.settings_data;
  },

  // Update notification preferences
  updateNotifications: async (notifications: NotificationSettings): Promise<UserSettings> => {
    const response = await apiRequest<SettingsApiResponse>('/api/settings/notifications', {
      method: 'PUT',
      body: JSON.stringify(notifications),
    });
    return response.data.settings_data;
  },

  // Update privacy settings
  updatePrivacy: async (privacy: PrivacySettings): Promise<UserSettings> => {
    const response = await apiRequest<SettingsApiResponse>('/api/settings/privacy', {
      method: 'PUT',
      body: JSON.stringify(privacy),
    });
    return response.data.settings_data;
  },

  // Update integration settings
  updateIntegration: async (integration: string, integrationData: any): Promise<UserSettings> => {
    const response = await apiRequest<SettingsApiResponse>(`/api/settings/integrations/${integration}`, {
      method: 'PUT',
      body: JSON.stringify(integrationData),
    });
    return response.data.settings_data;
  },

  // Reset settings to default
  resetToDefault: async (): Promise<UserSettings> => {
    const response = await apiRequest<SettingsApiResponse>('/api/settings/reset', {
      method: 'POST',
    });
    return response.data.settings_data;
  },

  // Export settings
  exportSettings: async (): Promise<Blob> => {
    const response = await fetch('/api/settings/export', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to export settings');
    }

    return response.blob();
  },

  // Import settings
  importSettings: async (settings: UserSettings): Promise<UserSettings> => {
    const response = await apiRequest<SettingsApiResponse>('/api/settings/import', {
      method: 'POST',
      body: JSON.stringify({ settings }),
    });
    return response.data.settings_data;
  },
};

export default settingsApi;