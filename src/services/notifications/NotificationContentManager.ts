
import { BaseNotification } from '@/types/notifications';

export interface NotificationContentGuidelines {
  maxSubjectLength: number;
  mobileTextLimit: number;
  urgencyIndicators: Record<string, string>;
  actionVerbs: string[];
}

export interface NotificationTemplate {
  id: string;
  type: string;
  channel: 'in_app' | 'email' | 'sms' | 'push' | 'whatsapp';
  subject: string;
  content: string;
  variables: string[];
  urgencyLevel: 'critical' | 'high' | 'normal' | 'low';
}

export class NotificationContentManager {
  private static guidelines: NotificationContentGuidelines = {
    maxSubjectLength: 50,
    mobileTextLimit: 120,
    urgencyIndicators: {
      critical: '🔴 URGENT:',
      high: '⚠️ Reminder:',
      normal: 'ℹ️',
      low: '✅'
    },
    actionVerbs: ['Confirm', 'View', 'Reschedule', 'Approve', 'Decline', 'Update']
  };

  static generateSubject(
    template: string, 
    variables: Record<string, string>,
    urgency: 'critical' | 'high' | 'normal' | 'low' = 'normal'
  ): string {
    let subject = this.replaceVariables(template, variables);
    
    // Add urgency indicator
    const indicator = this.guidelines.urgencyIndicators[urgency];
    if (indicator && urgency !== 'normal') {
      subject = `${indicator} ${subject}`;
    }
    
    // Truncate if too long
    if (subject.length > this.guidelines.maxSubjectLength) {
      subject = subject.substring(0, this.guidelines.maxSubjectLength - 3) + '...';
    }
    
    return subject;
  }

  static generateMobileContent(content: string): string {
    if (content.length <= this.guidelines.mobileTextLimit) {
      return content;
    }
    
    return content.substring(0, this.guidelines.mobileTextLimit - 3) + '...';
  }

  static generateCallToAction(
    action: string,
    context: string = ''
  ): { text: string; variant: 'default' | 'destructive' | 'outline' } {
    const actionMap: Record<string, { text: string; variant: 'default' | 'destructive' | 'outline' }> = {
      confirm: { text: 'Confirm Now', variant: 'default' },
      view: { text: 'View Details', variant: 'outline' },
      reschedule: { text: 'Reschedule', variant: 'outline' },
      approve: { text: 'Approve', variant: 'default' },
      decline: { text: 'Decline', variant: 'destructive' },
      cancel: { text: 'Cancel Booking', variant: 'destructive' }
    };

    return actionMap[action.toLowerCase()] || { text: action, variant: 'outline' };
  }

  private static replaceVariables(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  }

  static getPersonalizedContent(
    template: NotificationTemplate,
    userDetails: {
      firstName: string;
      bookingDetails?: any;
      providerName?: string;
      location?: string;
    }
  ): { subject: string; content: string; mobileContent: string } {
    const variables = {
      firstName: userDetails.firstName,
      providerName: userDetails.providerName || '',
      location: userDetails.location || '',
      date: userDetails.bookingDetails?.date || '',
      time: userDetails.bookingDetails?.time || '',
      service: userDetails.bookingDetails?.service || ''
    };

    const subject = this.generateSubject(template.subject, variables, template.urgencyLevel);
    const content = this.replaceVariables(template.content, variables);
    const mobileContent = this.generateMobileContent(content);

    return { subject, content, mobileContent };
  }
}
