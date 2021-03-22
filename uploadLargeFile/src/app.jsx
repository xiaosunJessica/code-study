
import React, { useState } from 'react';
import ReactDom from 'react-dom';
import Upload from './upload';
const App = () => {
  return <Upload />
}
ReactDom.render(<App />, document.getElementById('app'))