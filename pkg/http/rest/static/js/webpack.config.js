const path = require("path");

const mode = "development";

module.exports = {
  entry: "./index.tsx",
  mode,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "../fonts/",
              publicPath: "../static/fonts",
            },
          },
        ],
      },
    ],
  },
  watchOptions: {
    poll: 1000,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: __dirname,
    filename: "dist.js",
  },
  devtool: "source-map",
};
