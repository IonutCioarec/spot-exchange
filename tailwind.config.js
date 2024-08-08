/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        plain: ['Plain', 'sans-serif'], // Custom font family
      },
      fontWeight: {
        regular: 400,
        bold: 700,
        light: 300,
      },
    },
  },
  plugins: [],
}