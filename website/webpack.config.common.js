const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    app: './client/app.js',
  },
plugins: [
    new CleanWebpackPlugin(['app']),
    new HtmlWebpackPlugin({
      title: 'Minimum-Viable',
      filename: 'index.html',
      template: './client/index.html',
    }),
    new MiniCssExtractPlugin()
  ],
module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'es2015',
              'react',
            ],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
	  {
		loader: "css-loader",
		options: {
			modules: true,
			importLoader: 1,
			localIdentName: "[name]__[local]___[hash:base64:5]" 
		}
	  }
        ]
      }
    ],
  },
output: {
    filename: 'min-viable.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

