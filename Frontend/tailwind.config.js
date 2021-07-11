module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateRows: {
        layout: "3rem auto",
      },
      transformOrigin: {
        1: "1px",
      },
    },
  },
  variants: {
    extend: {
      width: ["hover"],
    },
  },
  plugins: [],
};
