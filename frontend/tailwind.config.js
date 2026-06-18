/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED", 
        primaryHover: "#8B5CF6",
        secondary: "#1B1F28", 
        accent: "#7C3AED",
        background: "#0F1115", 
        surface: "#1B1F28",
        card: "#1B1F28", 
        textPrimary: "#F8FAFC",
        muted: "#94A3B8",
        border: "#2D3748",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444"
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
      }
    },
  },
  plugins: [],
}
