
export interface NotificationJob {
  id: string;
  type: string;
  priority: 'critical' | 'high' | 'normal' | 'low';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'retrying';
  channel: 'in_app' | 'email' | 'sms' | 'push' | 'whatsapp';
  userId: string;
  payload: {
    title: string;
    message: string;
    metadata?: Record<string, any>;
  };
  scheduledFor?: Date;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  processingTime?: number;
}

export interface QueueMetrics {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  deadLetterQueue: number;
  avgProcessingTime: number;
  successRate: number;
}

export interface RateLimitConfig {
  perUser: {
    maxPerHour: number;
    maxPerDay: number;
  };
  perChannel: Record<string, number>;
  global: {
    maxPerSecond: number;
    maxConcurrent: number;
  };
  backoffMultiplier: number;
  maxBackoffDelay: number;
}

export interface WorkerConfig {
  concurrency: number;
  channels: string[];
  retryDelays: number[]; // in milliseconds
  processingTimeout: number;
  healthCheckInterval: number;
}

export interface DeadLetterQueueItem {
  originalJob: NotificationJob;
  failureReason: string;
  failedAt: Date;
  adminNotes?: string;
  canRetry: boolean;
}
