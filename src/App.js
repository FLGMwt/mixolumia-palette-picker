import React, { useState, useMemo, useLayoutEffect } from 'react';
import './App.css';
import ColorPalette from './ColorPalette';
import { ColorContext } from './contexts';
import queryString from 'query-string';

const App = () => {
  const [name, setName] = useState('Pico Dark');
  const [colors, setColors] = useState({
    0: '#000000',
    1: '#1d2b53',
    2: '#fff7f2',
    3: '#ffec27',
    4: '#29adff',
    5: '#ff004d',
  });

  useLayoutEffect(() => {
    const params = queryString.parse(window.location.search);
    const { name, ...colorParams } = params;
    if (name) {
      setName(name);
      const colorifiedColors = Object.fromEntries(
        Object.entries(colorParams).map(([key, value]) => [key, '#' + value])
      );
      setColors((state) => ({ ...state, ...colorifiedColors }));
    }
  }, [setColors]);

  const colorContextValue = useMemo(() => [colors, setColors], [
    colors,
    setColors,
  ]);

  return (
    <div className="App">
      <header
        className="App-header"
        style={{ backgroundColor: colors[0], color: colors[1] }}
      >
        <ColorContext.Provider value={colorContextValue}>
          <ColorPalette name={name} setName={setName} />
        </ColorContext.Provider>
      </header>
    </div>
  );
};

export default App;
