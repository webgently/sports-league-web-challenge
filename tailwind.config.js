/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom colors here
      },
      fontFamily: {
        // Add your custom fonts here
      },
    },
  },
  plugins: [],
  // Enable dark mode if needed
  darkMode: 'class',
}
