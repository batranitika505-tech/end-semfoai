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
        mission: {
          beige: '#F7F5F0',
          light: '#FDFCF8',
          dark: '#0e0e0e',
          accent: '#3b82f6',
        }
      },
      borderRadius: {
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'heavy': '0 10px 40px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
