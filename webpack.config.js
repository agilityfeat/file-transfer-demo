var webpack = require('webpack');
var path    = require('path');

var BUILD_DIR = path.resolve(__dirname, 'client');
var APP_DIR = path.resolve(__dirname, 'public');

module.exports = {
  entry: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      path.join(BUILD_DIR, 'index.jsx')
    ],
    output: {
      path: path.join(APP_DIR, 'js'),
      filename: 'bundle.js',
      publicPath: '/js/'
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/, 
          loaders: ['react-hot-loader/webpack', 'babel-loader'], 
          exclude: /node_modules/
        }, {
          test: /\.js$/, 
          exclude: /node_modules/, 
          loader: 'babel-loader'
        }, {
          test: /\.css$/, 
          loader: "style-loader!css-loader"
        }, {
          test: /\.png%/,
          loader: "url-loader?limit=100000"
        },{
          test: /\.jpg$/,
          loader: "file-loader"
        },{
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
          loader: 'url?limit=10000&mimetype=application/font-woff'
        },{
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
          loader: 'url?limit=10000&mimetype=application/octet-stream'
        }, {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
          loader: 'file'
        }, {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
          loader: 'url?limit=10000&mimetype=image/svg+xml'
        }
      ]
    },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};

