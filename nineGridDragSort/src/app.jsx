
import React, { useState } from 'react';
import ReactDom from 'react-dom';
import NineGrid from './NineGrid.jsx';
const App = () => {
  const [ data, setData ] = useState([{
    index: 1,
    bgColor: "red"
  },{
    index: 2,
    bgColor: "green"
  },{
    index: 3,
    bgColor: "blue"
  },{
    index: 4,
    bgColor: "yellow"
  },{
    index: 5,
    bgColor: "orange"
  },{
    index: 6,
    bgColor: "grey"
  },{
    index: 7,
    bgColor: "blueviolet"
  },{
    index: 8,
    bgColor: "chartreuse"
  },{
    index: 9,
    bgColor: "cyan"
  }])
  return <NineGrid data={data} />
}
ReactDom.render(<App />, document.getElementById('app'))