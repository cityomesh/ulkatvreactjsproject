// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- ఈ లైన్ మీ React ఫైళ్లను గుర్తిస్తుంది
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}