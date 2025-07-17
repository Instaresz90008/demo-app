
interface LogEvent {
  [key: string]: any;
}

export const logger = {
  info: (message: string, data?: LogEvent) => {
    console.log(`ℹ️ ${message}`, data || '');
  },
  
  error: (message: string, error?: any) => {
    console.error(`❌ ${message}`, error || '');
  },
  
  warn: (message: string, data?: LogEvent) => {
    console.warn(`⚠️ ${message}`, data || '');
  },
  
  trackEvent: (eventName: string, data?: LogEvent) => {
    console.log(`📊 Event: ${eventName}`, data || '');
  }
};
