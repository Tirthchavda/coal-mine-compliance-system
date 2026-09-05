/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          primary: '#13395e',   // National Navy
          secondary: '#1b4d7e', // Slate Blue
          dark: '#0a2139',      // Deep Authority Blue
          gold: '#c28e19',      // Ashoka Emblem Gold
          saffron: '#e87722',   // Indian Saffron
          green: '#138808',     // Indian Flag Green
          light: '#f4f7fa',     // Official Gov light gray
          border: '#d2dce6',    // Gov border line
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

