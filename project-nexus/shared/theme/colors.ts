// Indigo Theme Color Palette
export const colors = {
  // Primary indigo shades
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  
  // Background colors
  background: {
    primary: '#fafbff',     // Very light indigo tint
    secondary: '#f1f5f9',   // Light gray with indigo hint
    card: '#ffffff',        // Pure white for cards
    dark: '#0f0f23',        // Dark indigo for dark mode
  },
  
  // Text colors
  text: {
    primary: '#1e1b4b',     // Dark indigo
    secondary: '#64748b',   // Slate gray
    tertiary: '#94a3b8',    // Light slate
    inverse: '#ffffff',     // White text
    accent: '#4f46e5',      // Indigo accent
  },
  
  // Status colors
  status: {
    success: '#10b981',     // Green
    error: '#ef4444',       // Red
    warning: '#f59e0b',     // Amber
    info: '#3b82f6',        // Blue
  },
  
  // Border colors
  border: {
    light: '#e2e8f0',       // Light gray
    medium: '#cbd5e1',      // Medium gray
    dark: '#475569',        // Dark gray
    accent: '#6366f1',      // Indigo accent
  }
};

// CSS Custom Properties for web
export const cssVariables = `
  :root {
    --color-primary: ${colors.indigo[600]};
    --color-primary-light: ${colors.indigo[500]};
    --color-primary-dark: ${colors.indigo[700]};
    --color-background: ${colors.background.primary};
    --color-background-secondary: ${colors.background.secondary};
    --color-text-primary: ${colors.text.primary};
    --color-text-secondary: ${colors.text.secondary};
    --color-border: ${colors.border.light};
  }
`;