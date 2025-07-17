
export class ThemeError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'ThemeError';
  }
}

export const handleThemeError = (error: unknown, context: string): void => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`❌ Theme error in ${context}:`, message);
  
  // Could add error reporting service here in the future
  if (process.env.NODE_ENV === 'development') {
    console.trace(error);
  }
};

export const safeThemeOperation = async <T>(
  operation: () => T | Promise<T>,
  context: string,
  fallback?: T
): Promise<T | undefined> => {
  try {
    return await operation();
  } catch (error) {
    handleThemeError(error, context);
    return fallback;
  }
};
