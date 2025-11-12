import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Brand Colors - Inspirado en Buckler pero más vibrante para fitness
        brand: {
          50: '#F7F5F3',   // Lightest beige
          100: '#EFEAE4',  // Light beige
          200: '#E0D5C8',  // Soft beige
          300: '#CDC2B1',  // Buckler accent (mantenido)
          400: '#B8A793',  // Medium beige
          500: '#9D8A74',  // Deep beige
          600: '#7D6D5C',  // Dark beige
          700: '#5F5346',  // Darker
          800: '#433A31',  // Very dark
          900: '#2C2B2A',  // Buckler dark charcoal
        },

        // Primary Action Colors - Verde fitness energético
        primary: {
          50: '#ECFDF5',   // Very light green
          100: '#D1FAE5',  // Light green
          200: '#A7F3D0',  // Soft green
          300: '#6EE7B7',  // Medium green
          400: '#34D399',  // Fresh green
          500: '#10B981',  // Primary green (base)
          600: '#059669',  // Deep green
          700: '#047857',  // Darker green
          800: '#065F46',  // Very dark green
          900: '#064E3B',  // Deepest green
        },

        // Secondary Action Colors - Naranja motivacional
        secondary: {
          50: '#FFF7ED',   // Very light orange
          100: '#FFEDD5',  // Light orange
          200: '#FED7AA',  // Soft orange
          300: '#FDBA74',  // Medium orange
          400: '#FB923C',  // Fresh orange
          500: '#F97316',  // Primary orange (base)
          600: '#EA580C',  // Deep orange
          700: '#C2410C',  // Darker orange
          800: '#9A3412',  // Very dark orange
          900: '#7C2D12',  // Deepest orange
        },

        // Neutral Colors - Grises basados en Buckler
        neutral: {
          50: '#F9FAFB',   // Almost white
          100: '#F2F4F7',  // Buckler light gray
          200: '#E5E7EB',  // Light gray
          300: '#D1D5DB',  // Medium light gray
          400: '#9CA3AF',  // Medium gray
          500: '#6B7280',  // Gray
          600: '#4B5563',  // Dark gray
          700: '#383735',  // Buckler medium gray
          800: '#2C2B2A',  // Buckler dark charcoal
          900: '#1F1F1E',  // Almost black
        },

        // Semantic Colors
        success: {
          light: '#D1FAE5',
          DEFAULT: '#10B981',
          dark: '#065F46',
        },
        warning: {
          light: '#FEF3C7',
          DEFAULT: '#F59E0B',
          dark: '#92400E',
        },
        error: {
          light: '#FEE2E2',
          DEFAULT: '#EF4444',
          dark: '#991B1B',
        },
        info: {
          light: '#DBEAFE',
          DEFAULT: '#3B82F6',
          dark: '#1E40AF',
        },

        // Focus state - Buckler blue
        focus: '#4D65FF',

        // shadcn/ui compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['var(--font-inter)', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      fontSize: {
        // Display (Hero headlines)
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }], // 72px
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }], // 60px
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],     // 48px

        // Headings
        'h1': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],  // 36px
        'h2': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.005em', fontWeight: '600' }], // 30px
        'h3': ['1.5rem', { lineHeight: '1.35', fontWeight: '600' }],                             // 24px
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],                             // 20px
        'h5': ['1.125rem', { lineHeight: '1.45', fontWeight: '600' }],                           // 18px
        'h6': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],                                // 16px

        // Body
        'body-lg': ['1.125rem', { lineHeight: '1.75', fontWeight: '400' }],  // 18px
        'body': ['1rem', { lineHeight: '1.75', fontWeight: '400' }],         // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.7', fontWeight: '400' }],   // 14px
        'body-xs': ['0.75rem', { lineHeight: '1.65', fontWeight: '400' }],   // 12px

        // Special
        'button-lg': ['1.125rem', { lineHeight: '1.5', fontWeight: '600', letterSpacing: '0.01em' }],
        'button': ['1rem', { lineHeight: '1.5', fontWeight: '600', letterSpacing: '0.01em' }],
        'button-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '600', letterSpacing: '0.01em' }],
        'caption': ['0.75rem', { lineHeight: '1.6', fontWeight: '500', letterSpacing: '0.02em' }],
        'overline': ['0.75rem', { lineHeight: '1.6', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' }],
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',      // 4px - inputs, small cards
        'DEFAULT': '0.5rem',  // 8px - buttons, cards
        'md': '0.625rem',     // 10px - medium cards
        'lg': '0.75rem',      // 12px - large cards
        'xl': '1rem',         // 16px - modals, panels
        '2xl': '1.5rem',      // 24px - hero cards
        '3xl': '1.875rem',    // 30px - Buckler scrollbar style
        'full': '9999px',     // Pills, circular elements
      },
      boxShadow: {
        // Subtle shadows
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'md': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '2xl': '0 50px 100px -20px rgba(0, 0, 0, 0.25)',

        // Colored shadows for brand elements
        'brand': '0 10px 25px -5px rgba(205, 194, 177, 0.3)',
        'primary': '0 10px 25px -5px rgba(16, 185, 129, 0.3)',
        'secondary': '0 10px 25px -5px rgba(249, 115, 22, 0.3)',

        // Focus shadow (Buckler blue)
        'focus': '0 0 0 3px rgba(77, 101, 255, 0.3)',

        // Inner shadows
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'inner-lg': 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.1)',

        // No shadow
        'none': 'none',
      },
      keyframes: {
        // Fade animations
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        // Slide animations
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        // Scale animations
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // Pulse (for notifications)
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      maxWidth: {
        'container-sm': '640px',    // Mobile-first container
        'container-md': '768px',    // Tablet container
        'container-lg': '1024px',   // Desktop container
        'container-xl': '1280px',   // Wide desktop container
        'container-2xl': '1536px',  // Ultra-wide container
        'prose': '65ch',            // Optimal reading width
      }
    },
  },
  plugins: [],
};

export default config;
