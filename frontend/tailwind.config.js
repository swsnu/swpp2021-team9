// const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    screens: {
      xs: '320px',
      ...defaultTheme.screens,
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['serif'],
      body: ['Graphik', 'sans-serif'],
    },
    extend: {
      fontSize: {},
      borderWidth: {},
      spacing: {},
      height: {},
      padding: {},
      margin: {},
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
      height: ['hover'],
    },
  },
  plugins: [],
};
