/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'beteasy-lime': 'rgb(157, 230, 72)',
        'beteasy-lime-dark': 'rgb(137, 200, 62)',
        'beteasy-lime-light': 'rgb(177, 240, 102)',
      },
    },
  },
  plugins: [],
};
