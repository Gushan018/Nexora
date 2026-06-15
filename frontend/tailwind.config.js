/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D4AF37", 
        primaryHover: "#C5A059",
        secondary: "#F1F5F9", 
        accent: "#E5C158",
        background: "#F8FAFC", 
        surface: "#FFFFFF",
        card: "#FFFFFF", 
        textPrimary: "#0F172A",
        muted: "#64748B",
        border: "#E2E8F0",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444"
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
