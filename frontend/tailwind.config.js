/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#6C63FF',
          orange: '#F97316',
          teal: '#14B8A6',
          navy: '#0A1628',
        }
      }
    },
  },
  plugins: [],
}
