import React, { useRef, useState } from 'react';
import cn from 'classnames';
import './upload.less';
import { createFileChunk, calculateHashSample, post, request, SIZE } from './util'
const Status = {
  wait: "wait",
  pause: "pause",
  uploading: "uploading",
  error: "error",
  done: "done",
};
const Upload = () => {

  const [ chunks, setChunks ] = useState([]);
  const [ requestList, setRequestList ] = useState([]);

  const fileContainer = useRef({});
  const status = useRef(null);

  const verify = async (filename, hash) => {
    const data = await post('/verify', {filename, hash});
    return data
  }

  const createProgressHandler = (item) => {
    return e => {
      item.progress = parseInt(String((e.loaded / e.total) * 100));
    };
  }

  const sendRequest = async (urls, max=4, _chunks) => {
    return new Promise((resolve, reject) => {
      let len = urls.length;
      let idx = 0;
      let counter = 0;
      let retryArr = [];
      const start = async () => {
        while(counter < len && max > 0) {
          max--; //占用通道
          const i = urls.findIndex(v => v.status == Status.wait || v.status === Status.error);
          if (i === -1) break; // 没有等待和错误的结束
          urls[i].status = Status.uploading;
          const form = urls[i].form;
          const index = urls[i].index;
          if (typeof retryArr[index] == 'number' ){
            console.log('开始重试')
          }
          request({
            url: '/upload',
            data: form,
            onProgress: createProgressHandler(_chunks[index]),
            requestList: requestList,
          }).then(() => {
            urls[i].status = Status.done;
            max++; // 释放通道
            counter++;
            urls[counter].done = true;
            if (counter ===len) {
              resolve()
            } else {
              start()
            }
          }).catch(() => {
            urls[i].status = Status.error;
            if (typeof retryArr[index] !== 'number') {
              retryArr[index] = 0;
            }

            // 次数累加
            retryArr[index]++;
            // 重试3次后，结束
            if (retryArr[index] >=2) {
              return reject() 
            }
            chunks[index].progress = 0;
            max++;
            start();
          })
        }
      }

      start();
    })
  }

  const uploadChunks = async (uploadedList = [], _chunks) => {
    const list = _chunks.filter(chunk => uploadedList.indexOf(chunk.hash) === -1)
                      .map(({chunk, hash, index }, i) => {
                        const form = new FormData();
                        form.append("chunk", chunk);
                        form.append("hash", hash);
                        form.append("filename", fileContainer.current.file.name);
                        form.append("fileHash", fileContainer.current.hash);
                        return {
                          form, index, status: Status.wait
                        }
                      })
    try {
      await sendRequest(list, 4, _chunks);
      if (uploadedList.length + list.length === _chunks.length) {
        await mergeRequest();
      }
    } catch (error) {
      console.log('上传失败了，是否需要重试')
    }
  }

  const mergeRequest = async () =>{
    await post("/merge", {
      filename: fileContainer.current.file.name,
      size: SIZE,
      fileHash: fileContainer.current.hash
    });
  }

  const handleInputChange = (e) => {
    const [ file ] = e.target.files;
    if (!file) return;
    fileContainer.current.file = file;
  }

  const handleUpload = async (e) => {
    const { file } = fileContainer.current;
    if (!file) return;
    status.current = Status.uploading;
    const chunks = createFileChunk(file)

    // 计算hash,
    fileContainer.current.hash = await calculateHashSample(file)

    const { uploaded, uploadedList } = await verify(fileContainer.current.file.name, fileContainer.current.hash)
    
    if (uploaded) {
      console.log('秒传：上传成功')
      return
    }

    const _chunks = chunks.map((chunk, index) => {
      const chunkName = fileContainer.current.hash + '-'+index;
      return {
        fileHash: fileContainer.current.hash,
        chunk: chunk.file,
        index,
        hash: chunkName,
        progress: uploadedList.indexOf(chunkName) > -1 ? 100 : 0,
        size: chunk.file.size
      }
    })

    setChunks(_chunks);

    // 传入已存在的切片清单
    await uploadChunks(uploadedList, _chunks)
  }

  const handleSlowStartUpload = async () => {
    const {file} = fileContainer.current;
   
    if (!file) return;
    status.current = Status.uploading;
    
    const fileSize = file.size;
    let offset = 1024 * 1024;
    let cur = 0;
    let count = 0;
    fileContainer.current.hash = await calculateHashSample(file);
    while (cur < fileSize) {
      console.log(cur, fileSize, '-----size---------')
      const chunk = file.slice(cur, cur + offset);
      cur+= offset;
      const chunkName = fileContainer.current.hash + '-' + count;
      const form = new FormData();
      form.append('chunk', chunk);
      form.append('hash', chunkName);
      form.append('filename', file.name);
      form.append('fileHash', fileContainer.current.hash);
      form.append('size', chunk.size);

      let start = new Date().getTime();
      await request({
        url: '/upload',
        data: form
      })

      const now = new Date().getTime();
      const time = ((now - start)/1000).toFixed(4);
      let rate = time/30;
      if (rate < 0.5) rate = 0.5;
      if (rate < 2) rate = 2;
      offset = parseInt(offset/rate)
      count++
    }




  }
  return (
    <div>
      <input type="file" onChange={handleInputChange}  />
      <button onClick={handleUpload}>上传</button>
      <button onClick={handleSlowStartUpload}>慢启动上传</button>
      <div>计算文件 hash</div>
      <progress max="100" value="70"></progress>
      <div>总进度</div>
      <progress max="100" value="70"></progress>
      <div style={{width: '200px'}}>
        {
          chunks.map((chunk) => {
            const cls = cn({
              'cube': true,
              'uploading': chunk.progress>0&&chunk.progress<100, 
              'success':chunk.progress==100,
              'error':chunk.progress<0,
            })
            return (
              <div className={cls}>
                {chunk.index}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Upload;