
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BaseNotification, NotificationGroup, NotificationCounts, NotificationAction, NotificationType } from '@/types/notifications';
import { notificationsApiV2 } from '@/services/api/notificationsApiV2';

// Mock data for development
const mockNotifications: BaseNotification[] = [
  {
    id: '1',
    type: 'booking_confirmation',
    title: 'New booking request',
    message: 'John Doe wants to book a 30-minute consultation for tomorrow at 2:00 PM',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    userId: 'user1',
    actions: [
      { id: 'approve', label: 'Approve', variant: 'default' },
      { id: 'decline', label: 'Decline', variant: 'destructive' },
      { id: 'view', label: 'View Details', variant: 'outline' }
    ],
    metadata: { bookingId: 'booking123', clientName: 'John Doe' }
  },
  {
    id: '2',
    type: 'booking_confirmation',
    title: 'Booking approved',
    message: 'Your booking with Sarah Smith has been confirmed for today at 10:00 AM',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45),
    userId: 'user1',
    actions: [
      { id: 'view', label: 'View Details', variant: 'outline' },
      { id: 'reschedule', label: 'Reschedule', variant: 'outline' }
    ]
  },
  {
    id: '3',
    type: 'payment_received',
    title: 'Payment received',
    message: 'You received $150.00 for consultation with Mike Johnson',
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    userId: 'user1',
    actions: [
      { id: 'view', label: 'View Receipt', variant: 'outline' }
    ]
  },
  {
    id: '4',
    type: 'booking_reminder',
    title: 'Upcoming appointment',
    message: 'You have an appointment with Lisa Wilson in 1 hour',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15),
    userId: 'user1',
    actions: [
      { id: 'view', label: 'View Details', variant: 'outline' }
    ]
  }
];

export const useNotificationSystem = () => {
  const [notifications, setNotifications] = useState<BaseNotification[]>(mockNotifications);
  const [counts, setCounts] = useState<NotificationCounts>({
    total: 0,
    unread: 0,
    read: 0,
    byType: {} as Record<NotificationType, number>
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const calculateCounts = useCallback((notifs: BaseNotification[]): NotificationCounts => {
    const total = notifs.length;
    const unread = notifs.filter(n => n.status === 'unread').length;
    const read = notifs.filter(n => n.status === 'read').length;
    
    const byType = notifs.reduce((acc, notif) => {
      acc[notif.type] = (acc[notif.type] || 0) + 1;
      return acc;
    }, {} as Record<NotificationType, number>);

    return { total, unread, read, byType };
  }, []);

  const groupNotifications = useCallback((notifs: BaseNotification[]): NotificationGroup[] => {
    const grouped = notifs.reduce((acc, notification) => {
      const key = notification.type;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(notification);
      return acc;
    }, {} as Record<NotificationType, BaseNotification[]>);

    return Object.entries(grouped).map(([type, notifications]) => ({
      type: type as NotificationType,
      count: notifications.length,
      latestNotification: notifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0],
      notifications: notifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      isExpanded: false
    }));
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, status: 'read' as const } : n)
      );
      toast({
        title: "Marked as read",
        description: "Notification has been marked as read",
      });
    } catch (error) {
      console.error('Failed to mark as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  }, [toast]);

  const markAsUnread = useCallback(async (id: string) => {
    try {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, status: 'unread' as const } : n)
      );
      toast({
        title: "Marked as unread",
        description: "Notification has been marked as unread",
      });
    } catch (error) {
      console.error('Failed to mark as unread:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as unread",
        variant: "destructive",
      });
    }
  }, [toast]);

  const markAllAsRead = useCallback(async () => {
    try {
      setIsLoading(true);
      setNotifications(prev => 
        prev.map(n => ({ ...n, status: 'read' as const }))
      );
      toast({
        title: "All notifications marked as read",
        description: "Successfully marked all notifications as read",
      });
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const performAction = useCallback(async (notificationId: string, action: NotificationAction, data?: any) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update notification status after action
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, status: 'read' as const } : n)
      );

      let actionMessage = '';
      switch (action) {
        case 'approve':
          actionMessage = 'Request approved successfully';
          break;
        case 'decline':
          actionMessage = 'Request declined';
          break;
        case 'view':
          actionMessage = 'Opening details...';
          break;
        case 'reschedule':
          actionMessage = 'Reschedule option opened';
          break;
      }

      toast({
        title: "Action completed",
        description: actionMessage,
      });

      return { success: true, message: actionMessage };
    } catch (error) {
      console.error('Failed to perform action:', error);
      toast({
        title: "Error",
        description: "Failed to perform action",
        variant: "destructive",
      });
      return { success: false, message: 'Action failed' };
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast({
        title: "Notification deleted",
        description: "Notification has been removed",
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    setCounts(calculateCounts(notifications));
  }, [notifications, calculateCounts]);

  return {
    notifications,
    counts,
    groups: groupNotifications(notifications),
    isLoading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    performAction,
    deleteNotification,
  };
};
