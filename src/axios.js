const xhr = (config) => {
  // 解构config, data, 如果不传默认为null, method不传默认为get方法， url是必传参数
  const { data = null, url, method = 'get' } = config;

  // 实例化XMLHttpRequest
  const request = new XMLHttpRequest();

  // 初始化一个请求
  request.open(method.toUpperCase(), url, true);

  // 发送请求
  request.send(data);

}
class Axios {
  // 用来存储配置信息。
  config = {};
  constructor(initConfig) {
  // 实例化时接收一个配置信息，并保存到config属性中。
    this.config = initConfig;
  }
  // 该类有一个 request 方法，它可以用来发送请求
  request(config){}
  get(){}
  delete(){}
  head(){}
  options(){}
  post(){}
  put(){}
  patch(){}
}

function extend(to, from, ctx) {
  // 继承方法
  Object.getOwnPropertyNames(from).forEach((key) => {
    to[key] = from[key].bind(ctx)
  })

   // 继承 ctx 自身属性（不继承原型链上属性，因此需要 hasOwnProperty 进行判断）
  for (let val in ctx) {
    if (ctx.hasOwnProperty(val)) {
      to[val] = ctx[val]
    }
  }

  return to;
}

function createInstance(initConfig) {
  // 创建Axios实例
  const context = new Axios(initConfig);
  // 变量instance保存了Axios类上的request方法，并使用上一步实例化的对象去阶梯该方法的this.
  const instance = Axios.prototype.request.bind(context);
  console.log(instance, context, 'createInstance')
  extend(instance, Axios.prototype, context)
  // 返回的其实是request方法
  return instance;
}

const defaults = {
  method: 'get',
}

const axios = createInstance(defaults);

axios.create = function(config) {
  return createInstance(defaults);
}

export default axios;