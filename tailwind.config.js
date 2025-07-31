export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#9ECAD6',
          DEFAULT: '#748DAE',
          dark: '#5A6F8C',
        },
        secondary: {
          light: '#FFEAEA',
          DEFAULT: '#F5CBCB',
          dark: '#E8B6B6',
        },
      },
    },
  },
  plugins: [],
}