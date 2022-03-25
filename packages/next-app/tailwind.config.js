module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      height: {
        full: "100vh",
        "1/2": "50vh",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "3/4": "75vh",
        "1/10": "10vh",
        "9/10": "90vh",
      },
    },
  },
  plugins: [],
};
