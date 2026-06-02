/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B7CFA",
        secondary: "#00D4FF",
        accent: "#7C3AED",
        background: "#0A0E1A",
        surface: "#111827",
        card: "#161F2F",
        textPrimary: "#FFFFFF",
        muted: "#94A3B8"
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #5B7CFA, #00D4FF, #7C3AED)',
      }
    },
  },
  plugins: [],
}
