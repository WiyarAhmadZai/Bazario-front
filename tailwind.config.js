/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        bronze: '#CD7F32',
        silver: '#C0C0C0',
      }
    },
  },
  plugins: [],
}