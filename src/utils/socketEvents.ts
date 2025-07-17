
/**
 * Socket event types for consistent naming across the application
 */
export const SocketEvents = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
  RECONNECT: 'reconnect',
  RECONNECT_ERROR: 'reconnect_error',
  
  // User activity events
  USER_ACTIVE: 'user-active',
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  
  // Notification events
  NOTIFICATION: 'notification',
  
  // Booking events
  BOOKING_CREATED: 'booking-created',
  BOOKING_UPDATED: 'booking-updated',
  BOOKING_CANCELLED: 'booking-cancelled',
  
  // Service events
  SERVICE_UPDATED: 'service-updated',
  SERVICE_DELETED: 'service-deleted',
  
  // Slot events
  SLOT_UPDATED: 'slot-updated',
  SLOT_BATCH_UPDATED: 'slot-batch-updated',
  
  // Catalogue events
  CATALOGUE_UPDATED: 'catalogue-updated'
};

/**
 * Notification types for consistent handling
 */
export const NotificationType = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

/**
 * Room namespaces for consistent room naming
 */
export const RoomNamespace = {
  USER: (userId: string) => `user-${userId}`,
  SERVICE: (serviceId: string) => `service-${serviceId}`,
  CATALOGUE: (catalogueId: string) => `catalogue-${catalogueId}`,
  BOOKING: (bookingId: string) => `booking-${bookingId}`
};
