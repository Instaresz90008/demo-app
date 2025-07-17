
import { BaseNotification, NotificationCounts, NotificationActionResult } from '@/types/notifications';

export interface NotificationPreferences {
  userId: string;
  channels: Record<string, boolean>;
  settings: Record<string, any>;
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

export interface NotificationStats {
  totalSent: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  byChannel: Record<string, {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  }>;
  byPriority: Record<string, number>;
}

class NotificationsApi {
  private baseUrl = '/api/notifications';

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // User Notification Endpoints
  async getNotifications(params?: {
    limit?: number;
    offset?: number;
    type?: string;
    status?: 'read' | 'unread';
  }): Promise<{ notifications: BaseNotification[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);

    return this.makeRequest<{ notifications: BaseNotification[]; total: number }>(
      `?${queryParams.toString()}`
    );
  }

  async getCounts(): Promise<NotificationCounts> {
    return this.makeRequest<NotificationCounts>('/counts');
  }

  async markAsRead(id: string): Promise<BaseNotification> {
    return this.makeRequest<BaseNotification>(`/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllAsRead(): Promise<{ success: boolean; count: number }> {
    return this.makeRequest<{ success: boolean; count: number }>('/mark-all-read', {
      method: 'PATCH',
    });
  }

  async deleteNotification(id: string): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>(`/${id}`, {
      method: 'DELETE',
    });
  }

  async clearAllNotifications(): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>('/clear-all', {
      method: 'DELETE',
    });
  }

  async performAction(notificationId: string, action: string, data?: any): Promise<NotificationActionResult> {
    return this.makeRequest<NotificationActionResult>(`/${notificationId}/actions/${action}`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  // Preferences Endpoints
  async getPreferences(): Promise<NotificationPreferences> {
    return this.makeRequest<NotificationPreferences>('/preferences');
  }

  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    return this.makeRequest<NotificationPreferences>('/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Settings Endpoints
  async getSettings(): Promise<{ success: boolean; data?: NotificationSettings; error?: string }> {
    try {
      const data = await this.makeRequest<NotificationSettings>('/settings');
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateSettings(settings: NotificationSettings): Promise<{ success: boolean; error?: string }> {
    try {
      await this.makeRequest<NotificationSettings>('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Admin Endpoints
  async sendNotification(notification: {
    userId?: string;
    type: string;
    title: string;
    message: string;
    priority: string;
    channels: string[];
  }): Promise<{ success: boolean; id: string }> {
    return this.makeRequest<{ success: boolean; id: string }>('', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
  }

  async getStats(params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<NotificationStats> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.groupBy) queryParams.append('groupBy', params.groupBy);

    return this.makeRequest<NotificationStats>(`/stats?${queryParams.toString()}`);
  }

  async getNotificationLogs(params?: {
    notificationId?: string;
    userId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    logs: Array<{
      id: string;
      notificationId: string;
      channel: string;
      status: string;
      sentAt: Date;
      deliveredAt?: Date;
      errorMessage?: string;
    }>;
    total: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.notificationId) queryParams.append('notificationId', params.notificationId);
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    return this.makeRequest(`/logs?${queryParams.toString()}`);
  }
}

export const notificationsApi = new NotificationsApi();
