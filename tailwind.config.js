/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        softMint: '#eef2ed',
        cloud: '#fcfcfc',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'], // Veya sistem serif fontu
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}