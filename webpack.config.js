var webpack = require('webpack');
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
  externals: nodeModules,
  entry: [
    './src/index.js', './src/scss/main.scss'
  ],
  target: 'node',
  output: {
    filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/'
  },
  module: {
    rules: [
      {
          test: /\.js?$/,
          loader: 'babel-loader',
          exclude: '/node_modules/',
          options: {
              presets: [
                  'react', 'stage-0', ['env', {
                      target: { browsers: ['last 2 versions']}
                  }]
              ]
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
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-1']
        }
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@Client': path.resolve(__dirname, 'src/')
    }
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    port: 4172
  }
};
