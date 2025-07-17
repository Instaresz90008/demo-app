
import { NotificationContentManager, NotificationTemplate } from './NotificationContentManager';

export interface NotificationChannel {
  id: 'in_app' | 'email' | 'sms' | 'push' | 'whatsapp';
  name: string;
  enabled: boolean;
  config: Record<string, any>;
}

export interface NotificationDelivery {
  id: string;
  notificationId: string;
  channel: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  errorMessage?: string;
  retryCount: number;
}

export class MultiChannelNotifier {
  private channels: Map<string, NotificationChannel> = new Map();

  constructor() {
    this.initializeChannels();
  }

  private initializeChannels() {
    const defaultChannels: NotificationChannel[] = [
      {
        id: 'in_app',
        name: 'In-App Notifications',
        enabled: true,
        config: {
          position: 'top-right',
          duration: 5000,
          stackLimit: 5
        }
      },
      {
        id: 'email',
        name: 'Email',
        enabled: true,
        config: {
          templateEngine: 'handlebars',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        id: 'push',
        name: 'Push Notifications',
        enabled: true,
        config: {
          badge: true,
          sound: 'default',
          priority: 'high'
        }
      },
      {
        id: 'sms',
        name: 'SMS',
        enabled: false,
        config: {
          provider: 'twilio',
          maxLength: 160
        }
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp Business',
        enabled: false,
        config: {
          businessApiKey: '',
          supportRichMedia: true,
          quickReplies: true
        }
      }
    ];

    defaultChannels.forEach(channel => {
      this.channels.set(channel.id, channel);
    });
  }

  async sendNotification(
    template: NotificationTemplate,
    userDetails: any,
    enabledChannels: string[]
  ): Promise<NotificationDelivery[]> {
    const deliveries: NotificationDelivery[] = [];
    const { subject, content, mobileContent } = NotificationContentManager.getPersonalizedContent(
      template,
      userDetails
    );

    for (const channelId of enabledChannels) {
      const channel = this.channels.get(channelId);
      if (!channel || !channel.enabled) continue;

      const delivery: NotificationDelivery = {
        id: `delivery_${Date.now()}_${channelId}`,
        notificationId: template.id,
        channel: channelId,
        status: 'pending',
        retryCount: 0
      };

      try {
        await this.sendToChannel(channel, {
          subject,
          content: channelId === 'sms' || channelId === 'push' ? mobileContent : content,
          userDetails,
          template
        });

        delivery.status = 'sent';
        delivery.sentAt = new Date();
        
        // Simulate delivery confirmation for some channels
        if (channelId === 'in_app' || channelId === 'push') {
          delivery.status = 'delivered';
          delivery.deliveredAt = new Date();
        }

      } catch (error) {
        delivery.status = 'failed';
        delivery.errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Failed to send to ${channelId}:`, error);
      }

      deliveries.push(delivery);
    }

    return deliveries;
  }

  private async sendToChannel(
    channel: NotificationChannel,
    payload: {
      subject: string;
      content: string;
      userDetails: any;
      template: NotificationTemplate;
    }
  ): Promise<void> {
    switch (channel.id) {
      case 'in_app':
        await this.sendInAppNotification(payload);
        break;
      case 'email':
        await this.sendEmailNotification(payload);
        break;
      case 'push':
        await this.sendPushNotification(payload);
        break;
      case 'sms':
        await this.sendSMSNotification(payload);
        break;
      case 'whatsapp':
        await this.sendWhatsAppNotification(payload);
        break;
      default:
        throw new Error(`Unsupported channel: ${channel.id}`);
    }
  }

  private async sendInAppNotification(payload: any): Promise<void> {
    // Simulate in-app notification
    console.log('In-app notification sent:', payload.subject);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private async sendEmailNotification(payload: any): Promise<void> {
    // Simulate email sending
    console.log('Email notification sent:', payload.subject);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private async sendPushNotification(payload: any): Promise<void> {
    // Simulate push notification
    console.log('Push notification sent:', payload.subject);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  private async sendSMSNotification(payload: any): Promise<void> {
    // Simulate SMS sending
    console.log('SMS notification sent:', payload.content);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async sendWhatsAppNotification(payload: any): Promise<void> {
    // Simulate WhatsApp Business API
    console.log('WhatsApp notification sent:', payload.content);
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  getChannelStatus(channelId: string): NotificationChannel | undefined {
    return this.channels.get(channelId);
  }

  updateChannelConfig(channelId: string, config: Record<string, any>): void {
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.config = { ...channel.config, ...config };
    }
  }
}

export const multiChannelNotifier = new MultiChannelNotifier();
