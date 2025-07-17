export const STORAGE_KEYS = {
  LAST_TEST_USER_ID: 'last_test_user_id',
  PROXY_SESSION: 'proxy_session',
  CURRENT_USER_ID: 'temp_current_user_id',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed'
} as const;

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  }
};
