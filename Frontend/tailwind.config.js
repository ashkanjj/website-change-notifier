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
      colors: {
        "cornflower-blue": "#6195ED",
        geyser: "#dce0e6",
      },
    },
  },
  variants: {
    extend: {
      cursor: ["hover"],
      width: ["hover"],
      borderColor: ["hover"],
    },
  },
  plugins: [],
};
