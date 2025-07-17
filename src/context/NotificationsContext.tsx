import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import socketService from '@/services/socketService';
import { notificationsApi } from '@/services/api';
import { SocketEvents, RoomNamespace } from '@/utils/socketEvents';

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  date: Date;
  context?: string; // Optional context/category for the notification
  actionUrl?: string; // Optional URL to navigate to when notification is clicked
}

// Entity update handlers type
type EntityUpdateHandler = (data: any) => void;

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  isRealTimeConnected: boolean;
  // Entity room management methods
  subscribeToEntity: (entityType: 'service' | 'catalogue' | 'booking', entityId: string, handler: EntityUpdateHandler) => void;
  unsubscribeFromEntity: (entityType: 'service' | 'catalogue' | 'booking', entityId: string, handler: EntityUpdateHandler) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Sample notifications for demo purposes
const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'New booking request',
    message: 'You have received a new booking request from John Doe for tomorrow at 10:00 AM',
    type: 'info',
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: '2',
    title: 'Booking canceled',
    message: 'Sarah Smith has canceled their appointment scheduled for today at 2:00 PM',
    type: 'warning',
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
  },
  {
    id: '3',
    title: 'Payment received',
    message: 'You have received a payment of $50.00 for your consultation service',
    type: 'success',
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  }
];

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isRealTimeConnected, setIsRealTimeConnected] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Map to store entity subscribers
  const [entitySubscribers] = useState<Map<string, Set<EntityUpdateHandler>>>(new Map());
  
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Connect to socket.io when user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (user && token) {
      socketService.connect(token);
      setIsRealTimeConnected(true);
      
      // Ping server every 30 seconds to keep connection alive
      const pingInterval = setInterval(() => {
        if (socketService.isConnected()) {
          socketService.emit('user-active');
        } else {
          setIsRealTimeConnected(false);
          // Try to reconnect if disconnected
          socketService.connect(token);
        }
      }, 30000);
      
      // Listen for connection status changes
      socketService.on('connect', () => setIsRealTimeConnected(true));
      socketService.on('disconnect', () => setIsRealTimeConnected(false));
      
      // Listen for new notifications
      socketService.on('notification', handleSocketNotification);
      
      // Listen for entity updates
      setupEntityListeners();
      
      return () => {
        clearInterval(pingInterval);
        socketService.off('notification');
        teardownEntityListeners();
        socketService.off('connect');
        socketService.off('disconnect');
        socketService.disconnect();
        setIsRealTimeConnected(false);
      };
    } else {
      socketService.disconnect();
      setIsRealTimeConnected(false);
    }
  }, [user]);
  
  // Setup listeners for entity updates
  const setupEntityListeners = () => {
    socketService.on(SocketEvents.BOOKING_UPDATED, handleBookingUpdate);
    socketService.on(SocketEvents.SERVICE_UPDATED, handleServiceUpdate);
    socketService.on(SocketEvents.SLOT_UPDATED, handleSlotUpdate);
    socketService.on(SocketEvents.CATALOGUE_UPDATED, handleCatalogueUpdate);
  };
  
  // Remove entity listeners
  const teardownEntityListeners = () => {
    socketService.off(SocketEvents.BOOKING_UPDATED);
    socketService.off(SocketEvents.SERVICE_UPDATED);
    socketService.off(SocketEvents.SLOT_UPDATED);
    socketService.off(SocketEvents.CATALOGUE_UPDATED);
  };

  const handleSocketNotification = (data: Omit<Notification, 'date' | 'read'>) => {
    const newNotification: Notification = {
      ...data,
      date: new Date(),
      read: false
    };
    
    addNotification(newNotification);
  };
  
  const handleBookingUpdate = (bookingData: any) => {
    // Create a notification based on booking update
    let title = 'Booking Updated';
    let message = `A booking has been updated`;
    let type: NotificationType = 'info';
    
    if (bookingData.status === 'confirmed') {
      title = 'Booking Confirmed';
      message = `Your booking for ${bookingData.service_name || 'a service'} has been confirmed`;
      type = 'success';
    } else if (bookingData.status === 'cancelled') {
      title = 'Booking Cancelled';
      message = `A booking for ${bookingData.service_name || 'a service'} has been cancelled`;
      type = 'warning';
    }
    
    addNotification({
      id: `booking-${bookingData.id}-${Date.now()}`,
      title,
      message,
      type,
      context: 'booking',
      actionUrl: `/bookings/${bookingData.id}`
    });
    
    // Notify subscribers
    notifyEntitySubscribers('booking', bookingData.id, bookingData);
  };
  
  const handleServiceUpdate = (serviceData: any) => {
    addNotification({
      id: `service-${serviceData.id}-${Date.now()}`,
      title: 'Service Updated',
      message: `The service "${serviceData.name}" has been updated`,
      type: 'info',
      context: 'service',
      actionUrl: `/services/${serviceData.id}`
    });
    
    // Notify subscribers
    notifyEntitySubscribers('service', serviceData.id, serviceData);
  };
  
  const handleSlotUpdate = (slotData: any) => {
    addNotification({
      id: `slot-${slotData.id}-${Date.now()}`,
      title: 'Availability Updated',
      message: `Your availability for ${new Date(slotData.slot_date).toLocaleDateString()} has been updated`,
      type: 'info',
      context: 'slot'
    });
  };
  
  const handleCatalogueUpdate = (catalogueData: any) => {
    // Don't create a notification for catalogue updates as they're often frequent
    // but do notify subscribers
    if (catalogueData && catalogueData.id) {
      notifyEntitySubscribers('catalogue', catalogueData.id, catalogueData);
    }
  };
  
  // Helper to notify subscribers of entity updates
  const notifyEntitySubscribers = (entityType: 'service' | 'catalogue' | 'booking', entityId: string, data: any) => {
    const key = `${entityType}-${entityId}`;
    const subscribers = entitySubscribers.get(key);
    
    if (subscribers) {
      subscribers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${entityType} update handler:`, error);
        }
      });
    }
  };

  // Subscribe to entity updates
  const subscribeToEntity = (entityType: 'service' | 'catalogue' | 'booking', entityId: string, handler: EntityUpdateHandler) => {
    if (!entityId || !handler) return;
    
    const key = `${entityType}-${entityId}`;
    
    // Add to subscribers
    if (!entitySubscribers.has(key)) {
      entitySubscribers.set(key, new Set());
    }
    entitySubscribers.get(key)?.add(handler);
    
    // Join the room if connected
    if (isRealTimeConnected && socketService.getSocket()) {
      const roomName = `${entityType}-${entityId}`;
      socketService.emit(SocketEvents.JOIN_ROOM, roomName);
    }
  };
  
  // Unsubscribe from entity updates
  const unsubscribeFromEntity = (entityType: 'service' | 'catalogue' | 'booking', entityId: string, handler: EntityUpdateHandler) => {
    if (!entityId || !handler) return;
    
    const key = `${entityType}-${entityId}`;
    const subscribers = entitySubscribers.get(key);
    
    if (subscribers) {
      subscribers.delete(handler);
      
      // Clean up if no more subscribers
      if (subscribers.size === 0) {
        entitySubscribers.delete(key);
        
        // Leave the room if connected
        if (isRealTimeConnected && socketService.getSocket()) {
          const roomName = `${entityType}-${entityId}`;
          socketService.emit(SocketEvents.LEAVE_ROOM, roomName);
        }
      }
    }
  };

  const markAsRead = async (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = async () => {
    if (unreadCount > 0) {
      try {
        const response = await notificationsApi.markAllAsRead();
        if (response.success) {
          setNotifications(notifications.map(notification => ({ ...notification, read: true })));
        }
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
        // Still update UI optimistically
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      }
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'read'> | Notification) => {
    const newNotification: Notification = 'id' in notification 
      ? { ...notification as Notification }
      : {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          date: new Date(),
          read: false
        };
    
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    
    // Show toast for new notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'error' ? 'destructive' : 'default'
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  const clearAllNotifications = async () => {
    try {
      const response = await notificationsApi.clearAllNotifications();
      if (response.success) {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
      // Still update UI optimistically
      setNotifications([]);
    }
  };

  return (
    <NotificationsContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead,
        addNotification,
        removeNotification,
        clearAllNotifications,
        isRealTimeConnected,
        subscribeToEntity,
        unsubscribeFromEntity
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
