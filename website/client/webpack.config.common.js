const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './app.js',
  },
plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, '../dist')], { allowExternal :true }),
    new HtmlWebpackPlugin({
      title: 'Minimum-Viable',
      filename: 'index.html',
      template: './index.html',
    }),
    new CopyWebpackPlugin([
	    { from: 'assets', to: 'assets' },
	    { from: 'resume', to: 'resume' }
    ])
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
	use:['style-loader','css-loader']
      }
    ],
  },
output: {
    filename: 'min-viable.bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
};

