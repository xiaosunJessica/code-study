// const HtmlWebpackPlugin = require('html-webpack-plugin');

// const path = require('path');
// module.exports = {
//   entry: './src/index.js', // 打包入口
//   output: {
//     path: path.resolve(__dirname, 'dist'), // 输出的绝对路径
//   },
//   devServer: {
//     contentBase: path.join(__dirname, 'dist'),
//     open: 'true', // 自动打开浏览器
//     port: 8888, // 端口号
//     hot: true, // 开启热更新，同时要配置相应的插件HotModuleReplacementPlugin
//   },
//   plugins: [
//     new HtmlWebpackPlugin(),
//     // new webpack.HotModuleReplacementPlugin() // 热更新插件
//   ]
// }

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    main: './src/app.jsx'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  devServer: {
    contentBase:  path.join(__dirname, './index.html'), // 服务器启动跟目录设置example
    open: 'true', // 自动打开浏览器
    port: 8888, // 端口号
    hot: true, // 开启热更新，同时要配置相应的插件HotModuleReplacementPlugin
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ["babel-loader"]
    }, {
      test: /\.less$/,
      exclude: /node_modules/,
      use: ["style-loader", "css-loader", 'less-loader']
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack Boilerplate',
      template: path.resolve(__dirname, './index.html'), // template file
      filename: 'index.html', // output file
    }),
    new webpack.HotModuleReplacementPlugin() // 热更新插件
  ],
};