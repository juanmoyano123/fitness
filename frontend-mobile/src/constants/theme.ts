/**
 * Design System Tokens - FitCompass Mobile
 * Based on fitness-style-guide design system
 */

export const Colors = {
  // Primary Palette
  primary: '#37322f',
  primaryDark: '#322d2b',
  primaryDarker: '#292523',
  secondary: '#49423d',
  tertiary: '#605a57',

  // Backgrounds
  bgPrimary: '#ffffff',
  bgSecondary: '#f7f5f3',
  bgTertiary: '#fbfaf9',
  bgLight: '#f0efee',
  bgDark: '#37322f',

  // Accent Colors
  amber: '#f59e0b',      // Energy, calories, achievements
  sky: '#0ea5e9',        // Hydration, recovery
  green: '#10b981',      // Success, goals achieved
  purple: '#8b5cf6',     // Premium features
  rose: '#f43f5e',       // High intensity

  // Status Colors
  pending: '#9CA3AF',
  inProgress: '#FBBF24',
  completed: '#10B981',
  error: '#EF4444',

  // Text Colors
  textPrimary: '#37322f',
  textSecondary: '#49423d',
  textTertiary: '#605a57',
  textLight: '#9CA3AF',
  textWhite: '#ffffff',
};

export const Typography = {
  // Font Sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,

  // Font Weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,

  // Line Heights
  lineHeight: {
    tight: 1.2,
    base: 1.5,
    relaxed: 1.6,
  },
};

export const Spacing = {
  // Based on 4px grid
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 10,
  xl: 16,
  full: 999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const Layout = {
  // Container widths
  containerPadding: 16,
  cardPadding: 16,

  // Touch targets
  minTouchTarget: 44,

  // Header/Footer heights
  headerHeight: 56,
  tabBarHeight: 60,
};

export const Animation = {
  fast: 150,
  base: 200,
  slow: 300,
};
