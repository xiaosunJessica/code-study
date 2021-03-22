import React, { useRef, useState } from 'react';
import cn from 'classnames';
import './upload.less';
const Upload = () => {

  const [ chunks, setChunks ] = useState([]);
  const fileContainer = useRef(null);
  const handleInputChange = (e) => {
    const [ file ] = e.target.files;
    if (!file) return;
    fileContainer.current = file;
  }

  const handleUpload = (e) => {
    const file = fileContainer.current;
    if (!file) return;
    
  }

  const handleSlowStartUpload = () => {

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
      <div>
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