
export const validateThemeValue = (theme: string, supportedThemes: string[], defaultTheme: string): string => {
  return supportedThemes.includes(theme) ? theme : defaultTheme;
};

export const validateAnimationStyle = (style: string, validStyles: string[], defaultStyle: string): string => {
  return validStyles.includes(style) ? style : defaultStyle;
};

export const getSupportedThemes = (): string[] => {
  return ['light-purple', 'light-blue', 'light-blue-gradient', 'dark-purple', 'dark-charcoal'];
};

export const getValidAnimationStyles = (): string[] => {
  return ['particles', 'waves'];
};
