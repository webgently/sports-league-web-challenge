/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '500px',
      'md': '750px',
      'lg': '1000px',
    },
    extend: {
      colors: {
        'menu-text': '#FFFFFF',
        'heading': '#182C62',
        'text': '#4B5C68',
        'header-bg': '#025FEB',
        'table': {
          'header': '#E4EDF2',
          'border': '#E4EDF2',
          'row-even': '#F6F7F7'
        },
        'footer': {
          'text': '#4B5C68',
          'bg': '#F6F7F7'
        }
      },
      fontFamily: {
        'primary': ['Open Sans', 'sans-serif'],
      },
      fontSize: {
        'menu': ['16px', '24px'],
        'heading': ['24px', '32px'],
        'table-header': ['12px', '16px'],
        'table-cell': ['14px', '20px'],
        'table-cell-bold': ['16px', '24px'],
      },
    },
  },
  plugins: [],
  // Enable dark mode if needed
  darkMode: 'class',
}
