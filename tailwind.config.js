/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9f7', 100: '#d4f0eb', 200: '#abe1d7', 300: '#72caba',
          400: '#3fae9c', 500: '#2a9a87', 600: '#1f7b6c', 700: '#1c6358',
          800: '#194f47', 900: '#16413b',
        },
        accent: {
          50: '#fff8ed', 100: '#ffefd4', 200: '#ffdba8', 300: '#ffc070',
          400: '#ff9d37', 500: '#ff7e0f', 600: '#f0620a', 700: '#c94a0c',
          800: '#a23c12', 900: '#833313',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
