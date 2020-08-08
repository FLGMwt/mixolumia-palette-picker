import React, { useState } from 'react';
import './App.css';
import ColorPalette from './ColorPalette';
import { ColorContext } from './contexts';

const App = () => {
  const colorsState = useState({
    0: '#000000',
    1: '#1d2b53',
    2: '#fff7f2',
    3: '#ffec27',
    4: '#29adff',
    5: '#ff004d',
  });
  return (
    <div className="App">
      <header
        className="App-header"
        style={{ backgroundColor: colorsState[0][0] }}
      >
        <ColorContext.Provider value={colorsState}>
          <ColorPalette />
        </ColorContext.Provider>
      </header>
    </div>
  );
};

export default App;
