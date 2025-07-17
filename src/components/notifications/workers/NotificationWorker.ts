
import { NotificationJob, WorkerConfig } from '@/types/notificationQueue';

export class NotificationWorker {
  private config: WorkerConfig;
  private isRunning: boolean = false;
  private processedJobs: number = 0;
  private errors: number = 0;
  private lastHealthCheck: Date = new Date();

  constructor(config: WorkerConfig) {
    this.config = config;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Worker already running');
      return;
    }

    this.isRunning = true;
    console.log(`Starting worker for channels: ${this.config.channels.join(', ')}`);
    
    // Start health check interval
    setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckInterval);

    // Start processing loop
    this.processLoop();
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    console.log('Worker stopped');
  }

  private async processLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        await this.processBatch();
        await this.sleep(1000); // Wait 1 second between batches
      } catch (error) {
        this.errors++;
        console.error('Error in worker process loop:', error);
        await this.sleep(5000); // Wait longer on error
      }
    }
  }

  private async processBatch(): Promise<void> {
    const jobs = await this.getJobsToProcess();
    const promises = jobs.map(job => this.processJob(job));
    
    await Promise.allSettled(promises);
  }

  private async getJobsToProcess(): Promise<NotificationJob[]> {
    // In real implementation, this would fetch from Redis/Database
    // For now, return mock jobs
    return [];
  }

  private async processJob(job: NotificationJob): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Set processing timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Processing timeout')), this.config.processingTimeout);
      });

      const processingPromise = this.executeJobByChannel(job);
      
      await Promise.race([processingPromise, timeoutPromise]);
      
      this.processedJobs++;
      console.log(`Job ${job.id} processed successfully in ${Date.now() - startTime}ms`);
      
    } catch (error) {
      this.errors++;
      console.error(`Job ${job.id} failed:`, error);
      
      // Handle retry logic
      await this.handleJobFailure(job, error);
    }
  }

  private async executeJobByChannel(job: NotificationJob): Promise<void> {
    switch (job.channel) {
      case 'in_app':
        await this.processInAppNotification(job);
        break;
      case 'email':
        await this.processEmailNotification(job);
        break;
      case 'sms':
        await this.processSmsNotification(job);
        break;
      case 'push':
        await this.processPushNotification(job);
        break;
      case 'whatsapp':
        await this.processWhatsAppNotification(job);
        break;
      default:
        throw new Error(`Unsupported channel: ${job.channel}`);
    }
  }

  private async processInAppNotification(job: NotificationJob): Promise<void> {
    // Simulate in-app notification processing
    console.log(`Processing in-app notification for user ${job.userId}:`, job.payload.title);
    await this.sleep(100);
    
    // In real implementation, this would:
    // 1. Store notification in database
    // 2. Send via WebSocket to connected clients
    // 3. Update user's notification count
  }

  private async processEmailNotification(job: NotificationJob): Promise<void> {
    // Simulate email notification processing
    console.log(`Processing email notification for user ${job.userId}:`, job.payload.title);
    await this.sleep(500);
    
    // In real implementation, this would:
    // 1. Generate email template
    // 2. Send via email service (SendGrid, AWS SES, etc.)
    // 3. Track delivery status
  }

  private async processSmsNotification(job: NotificationJob): Promise<void> {
    // Simulate SMS notification processing
    console.log(`Processing SMS notification for user ${job.userId}:`, job.payload.title);
    await this.sleep(1000);
    
    // In real implementation, this would:
    // 1. Format message for SMS
    // 2. Send via SMS service (Twilio, AWS SNS, etc.)
    // 3. Handle delivery receipts
  }

  private async processPushNotification(job: NotificationJob): Promise<void> {
    // Simulate push notification processing
    console.log(`Processing push notification for user ${job.userId}:`, job.payload.title);
    await this.sleep(200);
    
    // In real implementation, this would:
    // 1. Get user's device tokens
    // 2. Send via push service (FCM, APNs)
    // 3. Handle invalid tokens
  }

  private async processWhatsAppNotification(job: NotificationJob): Promise<void> {
    // Simulate WhatsApp notification processing
    console.log(`Processing WhatsApp notification for user ${job.userId}:`, job.payload.title);
    await this.sleep(800);
    
    // In real implementation, this would:
    // 1. Use WhatsApp Business API
    // 2. Send message with proper formatting
    // 3. Handle webhook responses
  }

  private async handleJobFailure(job: NotificationJob, error: any): Promise<void> {
    if (job.retryCount < job.maxRetries) {
      // Calculate retry delay
      const delay = this.config.retryDelays[job.retryCount] || 900000; // Default 15 minutes
      
      console.log(`Scheduling retry for job ${job.id} in ${delay}ms`);
      
      // In real implementation, reschedule the job
      setTimeout(() => {
        console.log(`Retrying job ${job.id} (attempt ${job.retryCount + 1})`);
      }, delay);
    } else {
      console.log(`Job ${job.id} exhausted retries, moving to dead letter queue`);
      // Move to dead letter queue
    }
  }

  private performHealthCheck(): void {
    this.lastHealthCheck = new Date();
    
    const healthData = {
      isRunning: this.isRunning,
      processedJobs: this.processedJobs,
      errors: this.errors,
      errorRate: this.processedJobs > 0 ? (this.errors / this.processedJobs) * 100 : 0,
      lastHealthCheck: this.lastHealthCheck,
      channels: this.config.channels
    };
    
    console.log('Worker health check:', healthData);
    
    // In real implementation, send health data to monitoring system
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStats() {
    return {
      isRunning: this.isRunning,
      processedJobs: this.processedJobs,
      errors: this.errors,
      errorRate: this.processedJobs > 0 ? (this.errors / this.processedJobs) * 100 : 0,
      lastHealthCheck: this.lastHealthCheck
    };
  }
}

// Worker instances for different priorities
export const workers = {
  critical: new NotificationWorker({
    concurrency: 5,
    channels: ['in_app', 'email', 'sms', 'push', 'whatsapp'],
    retryDelays: [60000, 300000, 900000], // 1m, 5m, 15m
    processingTimeout: 30000, // 30 seconds
    healthCheckInterval: 60000 // 1 minute
  }),
  
  high: new NotificationWorker({
    concurrency: 3,
    channels: ['in_app', 'email', 'push'],
    retryDelays: [120000, 600000, 1800000], // 2m, 10m, 30m
    processingTimeout: 45000, // 45 seconds
    healthCheckInterval: 120000 // 2 minutes
  }),
  
  normal: new NotificationWorker({
    concurrency: 2,
    channels: ['in_app', 'email'],
    retryDelays: [300000, 900000, 2700000], // 5m, 15m, 45m
    processingTimeout: 60000, // 1 minute
    healthCheckInterval: 300000 // 5 minutes
  }),
  
  low: new NotificationWorker({
    concurrency: 1,
    channels: ['in_app'],
    retryDelays: [600000, 1800000, 3600000], // 10m, 30m, 1h
    processingTimeout: 120000, // 2 minutes
    healthCheckInterval: 600000 // 10 minutes
  })
};

// Auto-start workers
Object.values(workers).forEach(worker => worker.start());
