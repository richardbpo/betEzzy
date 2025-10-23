/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
