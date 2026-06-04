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
        secondary: "#1C2333", 
        accent: "#E5C158",
        background: "#131A26", 
        surface: "#1C2333",
        card: "#1C2333", 
        textPrimary: "#F8FAFC",
        muted: "#94A3B8",
        border: "#2D3748",
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
