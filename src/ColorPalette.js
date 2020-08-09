import React, { useContext, useState, useMemo, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import numbers from './numbers';
import squids from './squids';
import { ColorContext } from './contexts';
import queryString from 'query-string';

// todo: pixel scale somehow?
const pixelSize = 4; // pixel size in pixels ; D
const pixels = (pixelCount) => pixelCount * pixelSize;
const Pixel = React.memo(({ color }) => {
  return (
    <div
      style={{ backgroundColor: color, width: pixelSize, height: pixelSize }}
    />
  );
});

const PixelImage = React.memo(({ grid, color }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {grid.map((row, i) => (
        <div key={i} style={{ display: 'flex' }}>
          {row.map((pixel, j) => (
            <Pixel key={j} color={pixel ? color : undefined} />
          ))}
        </div>
      ))}
    </div>
  );
});

const playTrack = (id) => {
  const element = document.getElementById(id);
  if (element) {
    if (element.paused) {
      element.play();
    } else {
      element.currentTime = 0;
    }
  }
};

const playOpen = () => playTrack('audio-menu-0');
const playClose = () => playTrack('audio-menu-1');

const ColorPicker = ({ number }) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  const [colors, setColors] = useContext(ColorContext);
  const color = colors[number];
  const isBackground = number === 0;
  const setColor = (newColor) =>
    setColors((state) =>
      state[number] === newColor ? state : { ...state, [number]: newColor }
    );

  const size = pixels(isBackground ? 10 : 12);
  return (
    <div style={{ margin: pixels(1) }}>
      <div
        onClick={() => {
          setPickerOpen(true);
          playOpen();
        }}
        style={{
          width: size,
          height: size,
          marginBottom: pixels(2),
          backgroundColor: color,
          borderWidth: isBackground ? pixels(1) : 0,
          borderColor: 'white',
          borderStyle: 'solid',
        }}
      />
      {pickerOpen ? (
        <div
          style={{
            position: 'absolute',
            zIndex: '2',
          }}
        >
          <div
            style={{
              position: 'fixed',
              top: '0px',
              right: '0px',
              bottom: '0px',
              left: '0px',
            }}
            onClick={() => {
              setPickerOpen(false);
              playClose();
            }}
          />
          <SketchPicker
            color={color}
            onChange={(newColor) => setColor(newColor.hex)}
          />
        </div>
      ) : null}
      <PixelImage color="white" grid={numbers[number]} />
    </div>
  );
};

const getConfigText = ({ name, colors }) =>
  `
[REPLACEME]
name=${name}
0=${colors[0]}
1=${colors[1]}
2=${colors[2]}
3=${colors[3]}
4=${colors[4]}
5=${colors[5]}`
    .trimStart()
    .replace(/#/g, '');

const Squid = ({ number, grid }) => {
  const [colors] = useContext(ColorContext);
  return <PixelImage color={colors[number]} grid={grid} />;
};

const Bubble = () => {
  return <Squid number={2} grid={squids.bubble} />;
};

const Smashgirl = () => {
  return <Squid number={3} grid={squids.smashGirl} />;
};

const Donut = () => {
  return <Squid number={4} grid={squids.donut} />;
};

const Target = () => {
  return <Squid number={5} grid={squids.target} />;
};

const Background = () => {
  return <Squid number={1} grid={squids.smashGirl} />;
};

const Blank = () => {
  return <Squid grid={squids.smashGirl} />;
};

const Block = ({ t, l, r, b, backed }) => {
  const defaultSquid = backed ? <Background /> : <Blank />;
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div>{t || defaultSquid}</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: -pixels(2),
          marginBottom: -pixels(2),
        }}
      >
        {l || defaultSquid}
        <div style={{ width: pixels(2) }} />
        {r || defaultSquid}
      </div>
      <div>{b || defaultSquid}</div>
    </div>
  );
};

const DemoBlock = () => {
  return (
    <Block t={<Donut />} l={<Smashgirl />} r={<Bubble />} b={<Target />} />
  );
};

const BlockRow = ({ blocks, offset }) => {
  // TODO: once we have the diamond chrome, see if this early return needs to respect the `offset` prop
  if (!blocks) return <div style={{ height: pixels(16) }} />;
  const offsetStyle = offset ? { marginLeft: pixels(8) } : undefined;
  return (
    <div style={{ display: 'flex', marginBottom: -pixels(6), ...offsetStyle }}>
      {blocks.map((block, i) => (
        <div key={i} style={{ marginRight: pixels(2) }}>
          {block}
        </div>
      ))}
    </div>
  );
};

const getGrid = (width, height) => {
  const halfWidth = width / 2;
  const grid = new Array(height).fill(null).map((x, rowIndex) => {
    const rightHalf = new Array(halfWidth).fill(null).map((y, columnIndex) => {
      if (rowIndex < halfWidth) {
        if (columnIndex === rowIndex || columnIndex === rowIndex - 1) {
          return 1;
        } else {
          return 0;
        }
      }
      if (rowIndex < height - halfWidth) {
        return columnIndex === halfWidth - 1;
      }
      if (
        height - 1 - rowIndex === columnIndex ||
        height - 2 - rowIndex === columnIndex
      ) {
        return 1;
      }
      return 0;
    });
    const leftHalf = [...rightHalf].reverse();
    return [...leftHalf, ...rightHalf];
  });
  return grid;
};

const BoardFrame = React.memo(() => {
  const width = 68;
  const height = 120;

  const grid = useMemo(() => getGrid(width, height), [width, height]);
  const [colors] = useContext(ColorContext);

  return <PixelImage color={colors[1]} grid={grid} />;
});

const ConfigText = ({ configText }) => {
  const [colors] = useContext(ColorContext);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copied]);
  const [hasHover, setHasHover] = useState(false);
  const hoverProps = {
    onMouseEnter: () => setHasHover(true),
    onMouseLeave: () => setHasHover(false),
  };
  const borderColor = hasHover ? colors[1] : colors[2];
  return (
    <pre
      {...hoverProps}
      style={{
        borderWidth: pixels(1),
        borderStyle: 'solid',
        borderColor,
        padding: pixels(8),
        position: 'relative',
      }}
      onClick={() => {
        navigator.clipboard.writeText(configText);
        setCopied(true);
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          backgroundColor: borderColor,
          padding: pixels(1),
          color: colors[0],
          fontSize: 12,
        }}
      >
        {copied ? 'Copied to clipboard' : 'Click to copy'}
      </div>
      {configText}
    </pre>
  );
};

const ConfigAndInstructions = ({ name }) => {
  const [colors] = useContext(ColorContext);
  const configText = getConfigText({
    name,
    colors,
  });
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: pixels(10),
      }}
    >
      <p>
        <a href="https://davemakes.itch.io/mixolumia">Go get this game!</a>
      </p>
      <p>
        <a href="https://itch.io/t/914162/color-palettes">
          Instructions for using this palette
        </a>
      </p>
      <ConfigText configText={configText} />
      <p>
        <a
          href={`${window.location.origin}?${queryString
            .stringify({ name, ...colors })
            .replace(/%23/g, '')}`}
        >
          Share the "{name}" palette
        </a>
      </p>
    </div>
  );
};

const ColorPalette = ({ name, setName }) => {
  return (
    <div style={{ display: 'flex' }}>
      <div>
        <div>
          <label htmlFor="palette-name">Palette Name:</label>
          <input
            style={{ display: 'block' }}
            id="palette-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', marginBottom: pixels(30) }}>
          <ColorPicker number={0} />
          <ColorPicker number={1} />
          <ColorPicker number={2} />
          <ColorPicker number={3} />
          <ColorPicker number={4} />
          <ColorPicker number={5} />
        </div>
        <BlockRow />
        <BlockRow
          blocks={[
            <Block />,
            <Block />,
            <Block t={<Donut />} l={<Target />} r={<Donut />} b={<Donut />} />,
            <Block />,
            <Block />,
          ]}
        />
        <BlockRow />
        <BlockRow
          blocks={[
            <Block t={<Blank />} l={<Blank />} b={<Blank />} backed />,
            <Block t={<Blank />} backed />,
            <Block t={<Blank />} backed />,
            <Block t={<Blank />} backed />,
            <Block t={<Blank />} r={<Blank />} b={<Blank />} backed />,
          ]}
        />
        <BlockRow
          offset
          blocks={[
            <Block backed />,
            <Block backed />,
            <Block backed />,
            <Block backed />,
          ]}
        />
        <BlockRow
          blocks={[
            <Block />,
            <Block backed />,
            <Block backed />,
            <Block backed />,
            <Block />,
          ]}
        />
        <BlockRow
          offset
          blocks={[<Block />, <Block backed />, <DemoBlock />, <Block />]}
        />
        <BlockRow
          blocks={[
            <Block />,
            <Block />,
            <Block backed />,
            <Block />,
            <Block />,
          ]}
        />
        <div style={{ marginLeft: pixels(5), marginTop: -pixels(116) }}>
          <BoardFrame />
        </div>
      </div>
      <ConfigAndInstructions name={name} />
    </div>
  );
};

export default ColorPalette;
