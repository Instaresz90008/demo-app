
export type NotificationType = 'booking_confirmation' | 'booking_reminder' | 'payment_received' | 'cancellation' | 'system_update';

export type NotificationStatus = 'unread' | 'read';

export type NotificationAction = 'approve' | 'decline' | 'view' | 'reschedule';

export interface NotificationActionButton {
  id: NotificationAction;
  label: string;
  variant: 'default' | 'destructive' | 'outline';
  icon?: string;
}

export interface BaseNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  actions?: NotificationActionButton[];
  metadata?: Record<string, any>;
}

export interface NotificationGroup {
  type: NotificationType;
  count: number;
  latestNotification: BaseNotification;
  notifications: BaseNotification[];
  isExpanded: boolean;
}

export interface NotificationCounts {
  total: number;
  unread: number;
  read: number;
  byType: Record<NotificationType, number>;
}

export interface NotificationActionResult {
  success: boolean;
  message: string;
  updatedNotification?: BaseNotification;
}
