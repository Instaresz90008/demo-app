
export interface NotificationChannel {
  id: 'in_app' | 'email' | 'sms' | 'push' | 'whatsapp';
  name: string;
  enabled: boolean;
  icon: string;
}

export interface NotificationPriority {
  id: 'critical' | 'high' | 'normal' | 'low';
  name: string;
  color: string;
}

export interface QuietHours {
  enabled: boolean;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  timezone: string;
}

export interface FrequencyLimits {
  maxPerHour: number;
  maxPerDay: number;
  perChannelLimits: Record<string, number>;
}

export interface NotificationPreferences {
  userId: string;
  channels: NotificationChannel[];
  prioritySettings: Record<string, NotificationPriority['id']>;
  quietHours: QuietHours;
  frequencyLimits: FrequencyLimits;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreview {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: NotificationPriority['id'];
  channels: string[];
  scheduledFor?: Date;
}
