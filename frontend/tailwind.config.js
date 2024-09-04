/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      }, 
      colors: {
        primaryColor: "#953867",
        primaryBg: "#242424",
        secondaryBg: "#2F2F2F",
        thirdBg: "#33363F",
        textGray: "#D9D9D9",
        borderGray: "#686868",

      }
    },
  },
  plugins: [
    import('tailwindcss'),
    import('autoprefixer'),
  ],
}

