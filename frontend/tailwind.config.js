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
