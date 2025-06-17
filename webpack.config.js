const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry:  "./visualize_mesh.ts", //"./main.ts",//"./visualize_mesh.ts", // ponto de entrada './test_intersection.ts',
  target: "web",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: [/node_modules/]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"] // para importar sem extensão
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  mode: "development", // ou "production",
  devtool: "source-map", // para debugar o código
  // plugins: [
  //     new webpack.DefinePlugin({
  //     "__DEBUG__": JSON.stringify(true) // para usar o process.env.NODE_ENV
  //     })
  // ]
};