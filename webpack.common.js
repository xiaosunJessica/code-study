const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');

const devConfig = require('./webpack.dev'); // 引入开发环境配置

// 公共配置
const commonConfig = {
  entry: './src/axios.js', // 打包入口
  output: {
    filename: 'axios.js', // 输出文件名
    path: path.resolve(__dirname, 'dist'), // 输出的绝对路径
    library: 'axios', // 类库的命名空间，如果通过网页的方式引入，则可以通过window.axios访问
    globalObject: 'this', // 定义全局变量，兼容node和浏览器运行，避免出现“window is not defined”的情况
    libraryTarget: "umd", // 定义打包方式Universal Module Definition, 同时支持CommonJS, AMD和全局变量使用
    libraryExport: 'default', // 对外暴露default属性，就可以直接调用default里的属性
  },
  module: {
    rules: [ // 配置babel的解析，同时在项目的跟目录下有.babelrc的babel配置文件
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // 每次打包都要先清理dist文件
  ]
}

module.exports = (env) => {
  if (env.production) {

  } else {
    return merge(commonConfig, devConfig)
  }
}