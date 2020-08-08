import React, { useContext, useState } from "react";
import { SketchPicker } from "react-color";
import numbers from "./numbers";
import squids from "./squids";
import { ColorContext } from "./contexts";

// todo: pixel scale somehow?
const pixelSize = 6; // pixel size in pixels ; D
const pixels = (pixelCount) => pixelCount * pixelSize;
const Pixel = ({ color }) => {
  return (
    <div
      style={{ backgroundColor: color, width: pixelSize, height: pixelSize }}
    />
  );
};

const PixelImage = ({ grid, color }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {grid.map((row, i) => (
        <div key={i} style={{ display: "flex" }}>
          {row.map((pixel, j) => (
            <Pixel key={j} color={pixel ? color : undefined} />
          ))}
        </div>
      ))}
    </div>
  );
};

const ColorPicker = ({ number }) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  const [colors, setColors] = useContext(ColorContext);
  const color = colors[number];
  const setColor = (newColor) =>
    setColors((state) =>
      state[number] === newColor ? state : { ...state, [number]: newColor }
    );

  const size = pixels(12);
  return (
    <div style={{ margin: pixels(2) }}>
      <div
        onClick={() => setPickerOpen(true)}
        style={{
          width: size,
          height: size,
          marginBottom: pixels(2),
          backgroundColor: color,
        }}
      />
      {pickerOpen ? (
        <div
          style={{
            position: "absolute",
            zIndex: "2",
          }}
        >
          <div
            style={{
              position: "fixed",
              top: "0px",
              right: "0px",
              bottom: "0px",
              left: "0px",
            }}
            onClick={() => setPickerOpen(false)}
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
    .replace(/#/g, "");

const squidConfig = {
  2: { name: "Bubble", grid: squids.bubble },
  3: { name: "Smashgirl", grid: squids.smashGirl },
  4: { name: "Donut", grid: squids.donut },
  5: { name: "Target", grid: squids.target },
};

const Squid = ({ number }) => {
  const [colors] = useContext(ColorContext);
  const config = squidConfig[number];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginBottom: pixels(2),
      }}
    >
      <div style={{ flex: 1 }}>{config.name}</div>
      <div style={{ flex: 1 }}>
        <PixelImage color={colors[number]} grid={config.grid} />
      </div>
    </div>
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => navigator.clipboard.writeText(configText)}
    >
      <div>Click to copy to clipboard</div>
      <div>
        See instructions at{" "}
        <a href="https://itch.io/t/914162/color-palettes">
          https://itch.io/t/914162/color-palettes
        </a>
      </div>
      <textarea disabled rows={8} value={configText} />
    </div>
  );
};

const ColorPalette = () => {
  // TODO state as object? this is unwieldy 🙃
  const [name, setName] = useState("Pico Dark");
  return (
    <div style={{ display: "flex" }}>
      <div>
        <div>
          <label htmlFor="palette-name">Palette Name:</label>
          <input
            style={{ display: "block" }}
            id="palette-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={{ display: "flex" }}>
          <ColorPicker number={0} />
          <ColorPicker number={1} />
          <ColorPicker number={2} />
          <ColorPicker number={3} />
          <ColorPicker number={4} />
          <ColorPicker number={5} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Squid number={2} />
          <Squid number={3} />
          <Squid number={4} />
          <Squid number={5} />
        </div>
      </div>
      <ConfigAndInstructions />
    </div>
  );
};

export default ColorPalette;
