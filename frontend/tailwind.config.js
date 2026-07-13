/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        primaryHover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        textPrimary: 'rgb(var(--color-text-primary) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)'
=======
        primary: "#D4AF37", 
        primaryHover: "#C5A059",
        secondary: "#F1F5F9", 
        accent: "#E5C158",
        background: "#131A26",
        'light-background': "#FFFFFF",
        surface: "#1C2333",
        'light-surface': "#F3F4F6",
        card: "#1C2333",
        'light-card': "#FFFFFF",
        textPrimary: "#F8FAFC",
        'light-textPrimary': "#111827",
        muted: "#94A3B8",
        'light-muted': "#6B7280",
        border: "#2D3748",
        'light-border': "#E5E7EB",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        slate: {
          50: 'var(--slate-50)',
          100: 'var(--slate-100)',
          200: 'var(--slate-200)',
          300: 'var(--slate-300)',
          400: 'var(--slate-400)',
          500: 'var(--slate-500)',
          600: 'var(--slate-600)',
          700: 'var(--slate-700)',
          800: 'var(--slate-800)',
          900: 'var(--slate-900)',
          950: 'var(--slate-950)',
        }
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #D4AF37, #C5A059)',
      }
    },
  },
  plugins: [],
}
