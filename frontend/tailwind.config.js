module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ['Spoqa Han Sans Neo'],
      body: ['Spoqa Han Sans Neo'],
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
    extend: {},
  },
  plugins: [],
};
