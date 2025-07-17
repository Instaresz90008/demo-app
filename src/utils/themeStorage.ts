
export const persistSettings = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
    sessionStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to persist ${key}:`, error);
    try {
      sessionStorage.setItem(key, value);
    } catch (sessionError) {
      console.error(`Failed to persist ${key} to sessionStorage:`, sessionError);
    }
  }
};

export const loadStoredValue = (key: string, defaultValue: string): string => {
  try {
    return localStorage.getItem(key) || 
           sessionStorage.getItem(key) || 
           defaultValue;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
    return defaultValue;
  }
};

export const loadStoredBoolean = (key: string, defaultValue: boolean): boolean => {
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? stored === 'true' : defaultValue;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
    return defaultValue;
  }
};
