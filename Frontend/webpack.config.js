const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const env = process.env.ENVIRONMENT;
const isDev = env === "development";

module.exports = {
  entry: "./src/index.tsx",
  mode: env,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  devtool: isDev && "inline-source-map",
  devServer: {
    contentBase: "./dist",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "WebsiteChangeNotifier Dev",
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
