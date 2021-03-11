const xhr = (config) => {
  
  return new Promise((resolve, reject) => {
     // 解构config, data, 如果不传默认为null, method不传默认为get方法， url是必传参数
    const { data = null, url, method = 'get', responseType } = config;

    // 实例化XMLHttpRequest
    const request = new XMLHttpRequest();

    if (responseType) {
      request.responseType = responseType
    }

    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 0) {
        return;
      }

      // 返回的header是字符串类型，通过parseHeaders解析成对象类型
      const responseHeaders = parseHeaders(request.getAllResponseHeaders());
      const responseData = responseType && responseType !== 'text' ? request.response : request.responseText;

      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      resolve(response)
    }

    // 初始化一个请求
    request.open(method.toUpperCase(), url, true);

    // 发送请求
    request.send(data);
  })

}

const buildURL = (url, params) => {};

const transformURL = (config) => {
  const { url, params } = config;
  return buildURL(url, params)
}

const processConfig = (config) => {
  config.url = transformURL(config)
}

function isDate(val) {
  return toString.call(val) === '[object Date]'
}

function isPlainObject(val) {
  return toString.call(val) 
}

function isURLSearchParams(val) {
  return typeof val !== 'undefined' && val instanceof URLSearchParams;
}

const buildURL = (url, params) => {
  if (!params) return url;

  let serializedParams
  if (isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    const parts = [];
    Object.keys(params).forEach((key) => {
      const val = params[key]

      if (val === null || typeof val === 'undefined') {
        return
      }

      // 定义一个数组
      let values = [];
      if (Array.isArray(val)) {
        values = val;
        key += '[]'
      } else {
        values = [val]
      }

      values.forEach(val => {
        if (isDate((val))) {
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }

        // 处理结果推入数组
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })

    // 最后拼接数组
    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    const markIndex = url.indexOf('#');
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    return url
  }
}

const normalizeHeaderName = (headers, normalizedName) => {
  if (!headers) {
    return;
  }

  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

const processHeaders = (headers, data) => {
  normalizeHeaderName(headers, 'Content-type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-type']) {
      headers['Content-type'] = 'application/json;charset=utf-8'
    }
  }
  return headers;
}

const transformHeaders = (config) => {
  const { headers = {}, data } = config;
  return processHeaders(headers, data);
}

const transformRequest = (data) => {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data;
}

const transformRequestData = (config) => {
  return transformRequest(config.data)
}

const processConfig = (config) => {
  config.url = transformURL(config);
  config.headers = transformHeaders(config);
  config.data = transformRequestData(config)
}
class Axios {
  // 用来存储配置信息。
  config = {};
  constructor(initConfig) {
  // 实例化时接收一个配置信息，并保存到config属性中。
    this.config = initConfig;
  }
  // 该类有一个 request 方法，它可以用来发送请求
  request(config){
    processConfig(config);

    xhr(config)
  }
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