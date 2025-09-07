/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Emerald–teal dark palette
        primary: {
          100: '#D1FAE5',
          300: '#6EE7B7',
          500: '#10B981', // emerald
          700: '#059669',
          900: '#065F46',
          foreground: '#FFFFFF',
        },
        secondary: {
          100: '#CFFAFE',
          300: '#67E8F9',
          500: '#06B6D4', // cyan
          700: '#0E7490',
          900: '#164E63',
          foreground: '#FFFFFF',
        },
        info: {
          100: '#E0F7FF',
          300: '#82E9FF',
          500: '#06B6D4', // align info with cyan accent
          700: '#0E7490',
          900: '#083344',
          foreground: '#FFFFFF',
        },
        success: {
          100: '#DCFCE7',
          300: '#86EFAC',
          500: '#10B981', // align success with emerald accent
          700: '#16A34A',
          900: '#065F46',
          foreground: '#FFFFFF',
        },
        warning: {
          100: '#FEF9C3',
          300: '#FDE68A',
          500: '#FACC15', // amber highlight
          700: '#D97706',
          900: '#92400E',
          foreground: '#0F172A',
        },
        error: {
          100: '#FEE2E2',
          300: '#FCA5A5',
          500: '#EF4444',
          700: '#B91C1C',
          900: '#7F1D1D',
          foreground: '#FFFFFF',
        },
        grey: {
          50: '#F8FAFC',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8', // body text
          400: '#64748B',
          500: '#94A3B8', // keep alias for convenience
          600: '#475569',
          700: '#334155',
          800: '#1E293B', // card panel
          900: '#0F172A', // app background / sidebar
        },
      },
    },
  },
  plugins: [],
}