// styles/theme.ts
export const colors = {
  // Auth colors
  authBackground: '#010326',    // Dark navy blue
  authText: '#ffffff',          // White text for auth screens
  accent: '#23D9A5',            // Teal accent color
  
  // General colors
  white: '#ffffff',
  black: '#000000',
  gray: '#c7c7c7',
  lightGray: '#e0e0e0',
  mediumGray: '#999999',
  darkGray: '#555555',
  transparent: 'transparent',
  
  // Functional colors
  inputBorder: 'rgba(79, 209, 197, 0.5)',    // 50% transparent teal
  buttonBorder: 'rgba(255, 255, 255, 0.25)'  // 25% transparent white
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48
};

// Define font weight as a separate property
export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const
};

export const typography = {
  logo: {
    primary: {
      fontSize: 48,
      fontWeight: fontWeights.bold
    },
    secondary: {
      fontSize: 24,
      letterSpacing: 6
    }
  },
  heading: {
    fontSize: 28,
    fontWeight: fontWeights.bold
  },
  button: {
    fontSize: 18,
    fontWeight: fontWeights.semibold
  },
  body: {
    fontSize: 16,
    fontWeight: fontWeights.regular
  }
};

export const layout = {
  inputHeight: 56,
  buttonHeight: 56,
  borderRadius: 8
};