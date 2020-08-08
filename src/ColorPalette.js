import React, { useState } from "react";

const ColorPicker = ({ color, setColor }) => {
  return (
    <div>
      <input onChange={(e) => setColor(e.target.value)} value={color} />
      <div style={{ width: 100, height: 100, backgroundColor: color }} />
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
5=${color5}`.trimStart();

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
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <ColorPicker color={color0} setColor={setColor0} />
        <ColorPicker color={color1} setColor={setColor1} />
        <ColorPicker color={color2} setColor={setColor2} />
        <ColorPicker color={color3} setColor={setColor3} />
        <ColorPicker color={color4} setColor={setColor4} />
        <ColorPicker color={color5} setColor={setColor5} />
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
