import React, { useState, useRef } from 'react';
import "./NineGrid.less";

//参考链接：https://codepen.io/itguliang-the-selector/pen/jgqVzr

const NineGrid = (props) => {
  const [data, setData ] = useState(props.data);
  const dragged = useRef(null);
  const target = useRef(null)

  const handleData = () => {
    dragged.current.style.opacity = "1";
    dragged.current.style.transform = "scale(1)";
    const from = dragged.current.dataset.id;
    const to = target.current.dataset.id;
    if(from !== to ) {
      var _data = JSON.parse(JSON.stringify(data));
      _data.splice(to, 0, _data.splice(from, 1)[0]);
      setData(_data)
      dragged.current=target.current;
    }
  }

  const dragStart = (e) => {
    dragged.current = e.target;
  }

  const dragEnd = (e) => {
    dragged.current.style.opacity = "1";
    dragged.current.style.transform = "scale(1)";
  }

  const dragEnter = (e) => {
    e.preventDefault();
    if (e.target.tagName !== "LI") {
       return;
    }
    target.current = e.target;
    target.current.style.opacity = "0.6";
    target.current.style.transform = "scale(1.1)";
    handleData();
  }

  const dragOver = (e) => {
    e.preventDefault();
  }

  const drop = (e) => {
    e.preventDefault();
    dragged.current.style.opacity = "1";
    dragged.current.style.transform = "scale(1)";
  }
  return (
    <ul>
      {data.map((item, index) => {
        return (
          <li
            data-id={index}
            key={index}
            style={{background:item.bgColor}}
            draggable='true'
            onDragStart={dragStart}
            onDragEnd={dragEnd}
            onDragEnter={dragEnter}
            onDragOver={dragOver}
            onDrop={drop}
            data-item={JSON.stringify(item)}>
            {item.index}
          </li>
        )
      })}
    </ul>
  )
}

export default NineGrid;