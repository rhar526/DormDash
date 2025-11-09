/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dormdash-red': '#8B1538',
        'dormdash-pink': '#F5E6E8',
      }
    },
  },
  plugins: [],
}
