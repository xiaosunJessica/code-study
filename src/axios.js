class Axios {
  // 用来存储配置信息。
  config = {};
  constructor(initConfig) {
  // 实例化时接收一个配置信息，并保存到config属性中。
    this.config = initConfig;
  }
  // 该类有一个 request 方法，它可以用来发送请求
  request(config){}
}

function createInstance(initConfig) {
  // 创建Axios实例
  const context = new Axios(initConfig);
  // 变量instance保存了Axios类上的request方法，并使用上一步实例化的对象去阶梯该方法的this.
  const instance = Axios.prototype.request.bind(context);
  // 返回的其实是request方法
  return instance;
}