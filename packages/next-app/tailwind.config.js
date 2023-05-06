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
        "2/10": "20vh",
        "3/10": "30vh",
        "4/10": "40vh",
        "5/10": "50vh",
        "6/10": "60vh",
        "7/10": "70vh",
        "8/10": "80vh",
        "9/10": "90vh",
        98: "98vh",
        112: "28rem",
        128: "32rem",
        144: "36rem",
        160: "40rem",
      },
    },
  },
  plugins: [],
};
