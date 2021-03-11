const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development', // 开发环境，
  devtool: 'cheap-module-eval-source-map', // sourceMap用于错误调试
  devServer: {
    contentBase: './example', // 服务器启动跟目录设置example
    open: 'true', // 自动打开浏览器
    port: 8888, // 端口号
    hot: true, // 开启热更新，同时要配置相应的插件HotModuleReplacementPlugin
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // 使用模板文件，主要用于查看效果
      inject: 'head', // 插入到head标签中
    }),
    new webpack.HotModuleReplacementPlugin() // 热更新插件
  ]
}