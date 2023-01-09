var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  mode: 'development',
  externals: nodeModules,
  entry: [
    './src/index.js', './src/scss/main.scss'
  ],
  target: 'electron-renderer',
  output: {
    filename: 'bundle.js',
        path: path.resolve(__dirname, 'src/build'),
        publicPath: '/'
  },
  module: {
    rules: [
      {
          test: /\.js?$/,
          exclude: /node_modules/,
          use: {
              loader: 'babel-loader',
              options: {
                  presets: ['@babel/preset-env', '@babel/preset-react'],
                  plugins: ['@babel/plugin-transform-runtime', 'babel-plugin-module-resolver']
              }
          }
      },
      {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                  name: 'assets/graphics/[name].[ext]',
              }
            }
          ]
        },
      {
          test: /\.scss$/,
          use: [
              {
                  loader: 'file-loader',
                  options: {
                      name: '[name].min.css',
                      outputPath: 'assets/css/'
                  }
              },
              {
                  loader: 'extract-loader'
              },
              {
                  loader: 'css-loader'
              },
              {
                  loader: 'sass-loader'
              }
           ]
        }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@Client': path.resolve(__dirname, 'src/')
    }
  },
  devServer: {
    historyApiFallback: true,
    port: 4172
  },
};
