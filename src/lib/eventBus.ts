
type EventCallback = (...args: any[]) => void;

class EventBus {
  private events: Map<string, Set<EventCallback>> = new Map();

  on(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
  }

  off(event: string, callback: EventCallback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.events.delete(event);
      }
    }
  }

  emit(event: string, ...args: any[]) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }
}

export const eventBus = new EventBus();

export const EVENT_NAMES = {
  USER_CHANGED: 'tempUserChanged',
  PROXY_STARTED: 'proxy:started',
  PROXY_ENDED: 'proxy:ended'
} as const;

export const broadcastEvent = (eventName: string, data?: any) => {
  eventBus.emit(eventName, data);
  // Also trigger as window event for compatibility
  window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
};
