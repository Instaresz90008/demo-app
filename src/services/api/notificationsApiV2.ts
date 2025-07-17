
import { BaseNotification, NotificationCounts, NotificationActionResult, NotificationAction } from '@/types/notifications';

const API_BASE = '/api/notifications';

class NotificationsApiV2 {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE}${endpoint}`, {
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

  async getNotifications(): Promise<BaseNotification[]> {
    return this.makeRequest<BaseNotification[]>('/');
  }

  async getCounts(): Promise<NotificationCounts> {
    return this.makeRequest<NotificationCounts>('/counts');
  }

  async markAsRead(id: string): Promise<BaseNotification> {
    return this.makeRequest<BaseNotification>(`/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAsUnread(id: string): Promise<BaseNotification> {
    return this.makeRequest<BaseNotification>(`/${id}/unread`, {
      method: 'PATCH',
    });
  }

  async markAllAsRead(): Promise<{ success: boolean; count: number }> {
    return this.makeRequest<{ success: boolean; count: number }>('/mark-all-read', {
      method: 'PATCH',
    });
  }

  async performAction(notificationId: string, action: NotificationAction, data?: any): Promise<NotificationActionResult> {
    return this.makeRequest<NotificationActionResult>(`/${notificationId}/actions/${action}`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  async deleteNotification(id: string): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>(`/${id}`, {
      method: 'DELETE',
    });
  }
}

export const notificationsApiV2 = new NotificationsApiV2();
