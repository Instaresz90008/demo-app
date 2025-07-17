
import { io, Socket } from 'socket.io-client';
import { API_URL } from './api/utils';

/**
 * Socket service to manage socket.io connections
 * Centralized implementation that reduces duplicate connections
 */
class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectionDelay: number = 3000;

  /**
   * Connect to the socket.io server
   * @param token Authentication token
   */
  connect(token: string | null): void {
    if (this.socket) {
      this.disconnect();
    }

    const socketUrl = API_URL.replace('/api', '');
    
    this.socket = io(socketUrl, {
      auth: {
        token
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectionDelay
    });

    this.setupDefaultListeners();
    this.reapplyStoredListeners();
  }

  /**
   * Disconnect from the socket.io server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  /**
   * Get the socket instance
   * @returns The socket instance or null if not connected
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Setup default socket listeners
   * @private
   */
  private setupDefaultListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      this.handleReconnection();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      
      if (reason === 'io server disconnect' || reason === 'transport close') {
        this.handleReconnection();
      }
    });
  }

  /**
   * Handle reconnection attempts
   * @private
   */
  private handleReconnection(): void {
    this.reconnectAttempts++;
    if (this.reconnectAttempts <= this.maxReconnectAttempts && this.socket) {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => {
        this.socket?.connect();
      }, this.reconnectionDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  /**
   * Reapply stored listeners when reconnecting
   * @private
   */
  private reapplyStoredListeners(): void {
    if (!this.socket) return;

    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.on(event, (...args) => callback(...args));
      });
    });
  }

  /**
   * Add an event listener
   * @param event Event name
   * @param callback Callback function
   */
  on(event: string, callback: Function): void {
    if (!this.socket) {
      console.warn('Socket not connected, storing listener for later');
    } else {
      this.socket.on(event, (...args) => callback(...args));
    }

    // Store listener for reconnection purposes
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  /**
   * Remove an event listener
   * @param event Event name
   * @param callback Optional callback function to remove
   */
  off(event: string, callback?: Function): void {
    if (!this.socket) return;

    if (callback) {
      this.socket.off(event, callback as any);
      // Remove specific listener from our tracking
      const listeners = this.listeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      }
    } else {
      this.socket.off(event);
      // Remove all listeners for this event
      this.listeners.delete(event);
    }
  }

  /**
   * Emit an event
   * @param event Event name
   * @param args Event arguments
   */
  emit(event: string, ...args: any[]): void {
    if (!this.socket) {
      console.warn('Socket not connected, cannot emit event:', event);
      return;
    }
    this.socket.emit(event, ...args);
  }

  /**
   * Check if the socket is connected
   * @returns True if connected, false otherwise
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Join a room
   * @param roomName Room name
   */
  joinRoom(roomName: string): void {
    if (!this.socket || !this.isConnected()) {
      console.warn('Cannot join room, socket not connected');
      return;
    }
    this.socket.emit('join-room', roomName);
  }

  /**
   * Leave a room
   * @param roomName Room name
   */
  leaveRoom(roomName: string): void {
    if (!this.socket || !this.isConnected()) {
      console.warn('Cannot leave room, socket not connected');
      return;
    }
    this.socket.emit('leave-room', roomName);
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
