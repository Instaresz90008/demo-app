
export class DraftManager {
  private static getStorageKey(key: string): string {
    return `draft_${key}`;
  }

  static saveDraft(key: string, values: Record<string, any>): void {
    try {
      const storageKey = this.getStorageKey(key);
      localStorage.setItem(storageKey, JSON.stringify({
        values,
        timestamp: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }

  static loadDraft(key: string): Record<string, any> {
    try {
      const storageKey = this.getStorageKey(key);
      const draft = localStorage.getItem(storageKey);
      if (draft) {
        const parsed = JSON.parse(draft);
        
        return parsed.values || {};
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
    return {};
  }

  static clearDraft(key: string): void {
    try {
      const storageKey = this.getStorageKey(key);
      localStorage.removeItem(storageKey);
      
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }

  static hasDraft(key: string): boolean {
    try {
      const storageKey = this.getStorageKey(key);
      return localStorage.getItem(storageKey) !== null;
    } catch (error) {
      console.error('Failed to check draft:', error);
      return false;
    }
  }
}
