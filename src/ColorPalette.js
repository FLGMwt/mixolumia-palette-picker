import React, { useState } from "react";
import { SketchPicker } from "react-color";
import numbers from "./numbers";

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

const ColorPicker = ({ color, setColor, number }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  console.log({ pickerOpen });

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

const getConfigText = ({
  name,
  color0,
  color1,
  color2,
  color3,
  color4,
  color5,
}) =>
  `
[REPLACEME]
name=${name}
0=${color0}
1=${color1}
2=${color2}
3=${color3}
4=${color4}
5=${color5}`
    .trimStart()
    .replace(/#/g, "");

const ColorPalette = () => {
  // TODO state as object? this is unwieldy 🙃
  const [name, setName] = useState("Pico Dark");
  const [color0, setColor0] = useState("#000000");
  const [color1, setColor1] = useState("#1d2b53");
  const [color2, setColor2] = useState("#fff7f2");
  const [color3, setColor3] = useState("#ffec27");
  const [color4, setColor4] = useState("#29adff");
  const [color5, setColor5] = useState("#ff004d");
  const configText = getConfigText({
    name,
    color0,
    color1,
    color2,
    color3,
    color4,
    color5,
  });
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
          <ColorPicker number={0} color={color0} setColor={setColor0} />
          <ColorPicker number={1} color={color1} setColor={setColor1} />
          <ColorPicker number={2} color={color2} setColor={setColor2} />
          <ColorPicker number={3} color={color3} setColor={setColor3} />
          <ColorPicker number={4} color={color4} setColor={setColor4} />
          <ColorPicker number={5} color={color5} setColor={setColor5} />
        </div>
      </div>
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
    </div>
  );
};

export default ColorPalette;
