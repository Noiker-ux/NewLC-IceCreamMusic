// @ts-check
const TsconfigPathsPlugin =
  require("tsconfig-paths-webpack-plugin").TsconfigPathsPlugin;
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: "./server.ts",
  target: "node",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.server.json",
      }),
    ],
  },
  plugins: [new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })],
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "app.js",
  },
};
