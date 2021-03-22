const baseUrl = 'http://localhost:3000';
const SIZE = 0.2 * 1024 * 1024;

export function request({
  url,
  method,
  data,
  onProgress = e=> e,
  headers={},
  requestList
}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = onProgress;
    xhr.open(method, baseUrl+url);
    Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]));
    xhr.send(data);
    xhr.onreadystatechange = e => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (requestList) {
            const i = requestList.findIndex(req => req===xhr);
            requestList.splice(i, 1);
          }
          resolve({
            data: e.target.response
          })
        } else if (xhr.status === 500) {
          reject('报错了')
        }
      }
      requestList.push(xhr)
    }
  })
}

export async function post(url,data){
  let ret = await request({
      url,
      data: JSON.stringify(data),
      headers: {
        "content-type": "application/json"
      }
  })
  return JSON.parse(ret.data)
}

export function createFileChunk(file, size = SIZE) {
  const chunks = [];
  let cur = 0;
  while(cur < file.size) {
    chunks.push({
      file: file.slice(cur, cur+size)
    })
    cur += size
  }

  return chunks;
}