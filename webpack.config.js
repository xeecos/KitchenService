var path = require("path");
var fs = require("fs");
var webpack = require("webpack");
module.exports = [
  {
    entry: {
      bundle: "./src/entry.jsx"
    },
    output: {
      path: path.resolve(__dirname, "./dist/"),
      filename: "[name].js",
      sourceMapFilename: "bundle.map"
    },
    resolve: {
      extensions: [".js", ".jsx"]
    },
    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          loader: "babel-loader",
          include: [path.resolve(__dirname, "src")],
          exclude: [/node_modules/],
          query: {
            presets: ["babel-preset-env"]
          }
        },
        {
          test: /\.node$/,
          loader: "node-loader"
        }
      ]
    },
    target: "node",
    externals: {
      serialport: "commonjs serialport",
      "@pokusew/usb": "commonjs @pokusew/usb"
    },
    plugins: [
      new webpack.DefinePlugin({
        $dirname: "__dirname"
      })
    ]
  },
  {
    entry: {
      bundle: "./src/web.jsx"
    },
    output: {
      path: path.resolve(__dirname, "./public/"),
      filename: "web.bundle.js",
      sourceMapFilename: "bundle.map"
    },
    resolve: {
      extensions: [".js", ".jsx"]
    },
    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          loader: "babel-loader",
          include: [path.resolve(__dirname, "src")],
          exclude: [/node_modules/],
          query: {
            presets: ["babel-preset-env", "react"]
          }
        },
        {
          test: /\.css$/,
          loader: "style-loader!css-loader"
        }
      ]
    },
    target: "web",
    plugins: [
      new webpack.DefinePlugin({
        $dirname: "__dirname"
      })
    ]
  }
];
