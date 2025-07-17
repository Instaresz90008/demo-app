
type EventListener = (data: any) => void;

class EventBus {
  private listeners: Map<string, EventListener[]> = new Map();

  subscribe(event: string, listener: EventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  unsubscribe(event: string, listener: EventListener) {
    if (this.listeners.has(event)) {
      const eventListeners = this.listeners.get(event)!;
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  emit(event: string, data: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(listener => listener(data));
    }
  }
}

const eventBus = new EventBus();

export const broadcastEvent = (event: string, data: any) => {
  eventBus.emit(event, data);
};

export const subscribeToEvent = (event: string, listener: EventListener) => {
  eventBus.subscribe(event, listener);
};

export const unsubscribeFromEvent = (event: string, listener: EventListener) => {
  eventBus.unsubscribe(event, listener);
};
