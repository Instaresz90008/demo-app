
import { NotificationJob, QueueMetrics, RateLimitConfig, DeadLetterQueueItem } from '@/types/notificationQueue';

class NotificationQueueManager {
  private jobs: Map<string, NotificationJob> = new Map();
  private deadLetterQueue: Map<string, DeadLetterQueueItem> = new Map();
  private rateLimitConfig: RateLimitConfig;
  private userRateLimits: Map<string, { hourly: number; daily: number; lastReset: Date }> = new Map();
  private channelRateLimits: Map<string, { count: number; lastReset: Date }> = new Map();
  private globalRateLimit: { count: number; lastReset: Date } = { count: 0, lastReset: new Date() };

  constructor() {
    this.rateLimitConfig = {
      perUser: {
        maxPerHour: 10,
        maxPerDay: 50
      },
      perChannel: {
        sms: 5,
        email: 20,
        whatsapp: 10,
        push: 30,
        in_app: 50
      },
      global: {
        maxPerSecond: 100,
        maxConcurrent: 50
      },
      backoffMultiplier: 2,
      maxBackoffDelay: 900000 // 15 minutes
    };

    // Start background workers
    this.startWorkers();
    this.startMetricsCollection();
  }

  async enqueue(job: Omit<NotificationJob, 'id' | 'status' | 'createdAt' | 'retryCount'>): Promise<string> {
    const jobId = this.generateJobId();
    const fullJob: NotificationJob = {
      ...job,
      id: jobId,
      status: 'pending',
      createdAt: new Date(),
      retryCount: 0,
      maxRetries: 3
    };

    // Check rate limits
    if (!await this.checkRateLimit(fullJob)) {
      throw new Error('Rate limit exceeded');
    }

    // Add to appropriate queue based on priority and scheduling
    this.jobs.set(jobId, fullJob);
    
    console.log(`Job ${jobId} enqueued with priority ${fullJob.priority}`);
    return jobId;
  }

  async processJob(jobId: string): Promise<boolean> {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'pending') {
      return false;
    }

    job.status = 'processing';
    job.startedAt = new Date();

    try {
      // Simulate processing delay based on channel
      const processingTime = this.getProcessingTime(job.channel);
      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Simulate success/failure (90% success rate)
      const success = Math.random() > 0.1;
      
      if (success) {
        job.status = 'completed';
        job.completedAt = new Date();
        job.processingTime = Date.now() - job.startedAt.getTime();
        console.log(`Job ${jobId} completed successfully`);
        return true;
      } else {
        throw new Error('Simulated processing failure');
      }
    } catch (error) {
      job.lastError = error instanceof Error ? error.message : 'Unknown error';
      
      if (job.retryCount < job.maxRetries) {
        job.status = 'retrying';
        job.retryCount++;
        
        // Calculate backoff delay
        const baseDelay = [60000, 300000, 900000][job.retryCount - 1]; // 1m, 5m, 15m
        const backoffDelay = Math.min(
          baseDelay * Math.pow(this.rateLimitConfig.backoffMultiplier, job.retryCount - 1),
          this.rateLimitConfig.maxBackoffDelay
        );
        
        job.scheduledFor = new Date(Date.now() + backoffDelay);
        console.log(`Job ${jobId} scheduled for retry ${job.retryCount} in ${backoffDelay}ms`);
        
        // Reset to pending after delay
        setTimeout(() => {
          if (job.status === 'retrying') {
            job.status = 'pending';
          }
        }, backoffDelay);
      } else {
        job.status = 'failed';
        this.moveToDeadLetterQueue(job, 'Max retries exceeded');
        console.log(`Job ${jobId} moved to dead letter queue`);
      }
      
      return false;
    }
  }

  private async checkRateLimit(job: NotificationJob): Promise<boolean> {
    const now = new Date();
    
    // Check global rate limit
    if (now.getTime() - this.globalRateLimit.lastReset.getTime() > 1000) {
      this.globalRateLimit.count = 0;
      this.globalRateLimit.lastReset = now;
    }
    
    if (this.globalRateLimit.count >= this.rateLimitConfig.global.maxPerSecond) {
      return false;
    }

    // Check user rate limits
    const userLimits = this.userRateLimits.get(job.userId);
    if (userLimits) {
      const hoursSinceReset = (now.getTime() - userLimits.lastReset.getTime()) / (1000 * 60 * 60);
      const daysSinceReset = hoursSinceReset / 24;
      
      if (hoursSinceReset >= 1) {
        userLimits.hourly = 0;
        if (daysSinceReset >= 1) {
          userLimits.daily = 0;
        }
        userLimits.lastReset = now;
      }
      
      if (userLimits.hourly >= this.rateLimitConfig.perUser.maxPerHour ||
          userLimits.daily >= this.rateLimitConfig.perUser.maxPerDay) {
        return false;
      }
    }

    // Check channel rate limits
    const channelLimit = this.rateLimitConfig.perChannel[job.channel];
    if (channelLimit) {
      const channelLimits = this.channelRateLimits.get(job.channel);
      if (channelLimits) {
        const daysSinceReset = (now.getTime() - channelLimits.lastReset.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceReset >= 1) {
          channelLimits.count = 0;
          channelLimits.lastReset = now;
        }
        
        if (channelLimits.count >= channelLimit) {
          return false;
        }
      }
    }

    // Update rate limit counters
    this.globalRateLimit.count++;
    
    const userRateLimit = this.userRateLimits.get(job.userId) || { hourly: 0, daily: 0, lastReset: now };
    userRateLimit.hourly++;
    userRateLimit.daily++;
    this.userRateLimits.set(job.userId, userRateLimit);
    
    const channelRateLimit = this.channelRateLimits.get(job.channel) || { count: 0, lastReset: now };
    channelRateLimit.count++;
    this.channelRateLimits.set(job.channel, channelRateLimit);

    return true;
  }

  private moveToDeadLetterQueue(job: NotificationJob, reason: string): void {
    const dlqItem: DeadLetterQueueItem = {
      originalJob: job,
      failureReason: reason,
      failedAt: new Date(),
      canRetry: true
    };
    
    this.deadLetterQueue.set(job.id, dlqItem);
    this.jobs.delete(job.id);

    // Alert admins if DLQ threshold exceeded
    if (this.deadLetterQueue.size > 100) {
      this.alertAdmins();
    }
  }

  private alertAdmins(): void {
    console.warn(`Dead letter queue threshold exceeded: ${this.deadLetterQueue.size} items`);
    // In real implementation, send alert to admin notification system
  }

  private getProcessingTime(channel: string): number {
    const times = {
      in_app: 100,
      push: 200,
      email: 500,
      sms: 1000,
      whatsapp: 800
    };
    return times[channel as keyof typeof times] || 500;
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startWorkers(): void {
    // Start multiple workers for different priority levels
    this.startWorker('critical', 5);
    this.startWorker('high', 3);
    this.startWorker('normal', 2);
    this.startWorker('low', 1);
  }

  private startWorker(priority: string, concurrency: number): void {
    const processNext = async () => {
      const pendingJobs = Array.from(this.jobs.values())
        .filter(job => job.status === 'pending' && job.priority === priority)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      const jobsToProcess = pendingJobs.slice(0, concurrency);
      
      await Promise.all(
        jobsToProcess.map(job => this.processJob(job.id))
      );

      // Continue processing
      setTimeout(processNext, 1000);
    };

    processNext();
  }

  private startMetricsCollection(): void {
    setInterval(() => {
      const metrics = this.getMetrics();
      console.log('Queue metrics:', metrics);
    }, 30000); // Every 30 seconds
  }

  getMetrics(): QueueMetrics {
    const jobs = Array.from(this.jobs.values());
    const completed = jobs.filter(j => j.status === 'completed');
    
    const totalProcessingTime = completed.reduce((sum, job) => 
      sum + (job.processingTime || 0), 0
    );

    return {
      total: jobs.length,
      pending: jobs.filter(j => j.status === 'pending').length,
      processing: jobs.filter(j => j.status === 'processing').length,
      completed: completed.length,
      failed: jobs.filter(j => j.status === 'failed').length,
      deadLetterQueue: this.deadLetterQueue.size,
      avgProcessingTime: completed.length > 0 ? totalProcessingTime / completed.length : 0,
      successRate: jobs.length > 0 ? (completed.length / jobs.length) * 100 : 0
    };
  }

  getDeadLetterQueue(): DeadLetterQueueItem[] {
    return Array.from(this.deadLetterQueue.values());
  }

  async retryFromDeadLetterQueue(jobId: string): Promise<boolean> {
    const dlqItem = this.deadLetterQueue.get(jobId);
    if (!dlqItem || !dlqItem.canRetry) {
      return false;
    }

    const job = { ...dlqItem.originalJob };
    job.status = 'pending';
    job.retryCount = 0;
    job.lastError = undefined;
    job.startedAt = undefined;
    job.completedAt = undefined;

    this.jobs.set(jobId, job);
    this.deadLetterQueue.delete(jobId);
    
    console.log(`Job ${jobId} restored from dead letter queue`);
    return true;
  }

  async dismissFromDeadLetterQueue(jobId: string, adminNotes?: string): Promise<boolean> {
    const dlqItem = this.deadLetterQueue.get(jobId);
    if (!dlqItem) {
      return false;
    }

    dlqItem.adminNotes = adminNotes;
    dlqItem.canRetry = false;
    
    console.log(`Job ${jobId} dismissed from dead letter queue`);
    return true;
  }
}

export const queueManager = new NotificationQueueManager();
