import { useEffect, useState } from "react";
import { Stage, Layer } from "react-konva";
import { v4 as uuidv4 } from "uuid";

import CustomRect from "./components/CustomRect";
import "./App.css";

function App() {
  const DRAW_AREA_WIDTH = 600;
  const DRAW_AREA_HEIGHT = 600;
  const [rectangles, setRectangles] = useState([]);
  const [selectedId, setSelectId] = useState(null);
  const [selectedRectangleColor, setSelectedRectangleColor] = useState("");
  const [savedLayouts, setSavedLayouts] = useState([]);

  useEffect(() => {
    const layouts = JSON.parse(localStorage.getItem("layouts")); //get them back
    if (layouts) {
      setSavedLayouts(layouts);
    }
  }, []);

  const onAddRectangle = () => {
    let rectangleProperty = {
      id: uuidv4(),
      x: Math.floor(Math.random() * 580),
      y: Math.floor(Math.random() * 580),
      width: 50,
      height: 50,
      fill: "green",
    };

    setRectangles([...rectangles, rectangleProperty]);
  };

  const onDeleteRecetangle = () => {
    setRectangles(rectangles.filter((x) => x.id !== selectedId));
  };

  const onClearArea = () => {
    setRectangles([]);
  };

  const onChangeColorInput = (e) => {
    setSelectedRectangleColor(e.target.value);
  };

  const onChangeColor = () => {
    const indexOfRectToChangeColor = rectangles.findIndex(
      (x) => x.id === selectedId
    );
    let arr = [...rectangles];
    arr[indexOfRectToChangeColor].fill = selectedRectangleColor;
    setRectangles(arr);
  };

  const onSaveArea = () => {
    setSavedLayouts([
      ...savedLayouts,
      {
        id: uuidv4(),
        data: rectangles,
      },
    ]);
    setRectangles([]);
  };

  const onSelectSavedLayout = (layout) => {
    setRectangles(layout.data);
  };

  const onDeletedSavedLayout = (layout) => {
    setSavedLayouts(savedLayouts.filter((x) => x.id !== layout.id));
  };

  useEffect(() => {
    localStorage.setItem("layouts", JSON.stringify(savedLayouts)); //store layouts
  }, [savedLayouts]);

  return (
    <div className="App">
      <Stage
        width={DRAW_AREA_WIDTH}
        height={DRAW_AREA_HEIGHT}
        className="draw-area"
      >
        <Layer>
          {rectangles.length > 0 &&
            rectangles.map((rectangle, i) => (
              <CustomRect
                key={i}
                property={rectangle}
                isSelected={rectangle.id === selectedId}
                onSelect={() => {
                  setSelectId(rectangle.id);
                  setSelectedRectangleColor(rectangle.fill);
                }}
                onChange={(newAttrs) => {
                  console.log(newAttrs);
                  const rects = rectangles.slice();
                  rects[i] = newAttrs;
                  setRectangles(rects);
                }}
              />
            ))}
        </Layer>
      </Stage>
      <div className="actions">
        <div className="action-section">
          <button onClick={onAddRectangle}>Add Rectangle</button>
          <button onClick={onDeleteRecetangle} disabled={selectedId === null}>
            Delete Rectangle
          </button>
          <button onClick={onClearArea}>Clear Area</button>
          <button onClick={onSaveArea} disabled={rectangles.length === 0}>
            Save Area
          </button>
        </div>

        <div className="action-section">
          <input
            type="text"
            value={selectedRectangleColor}
            onChange={onChangeColorInput}
          />
          <button onClick={onChangeColor} disabled={selectedId === null}>
            Change Color
          </button>
        </div>

        <div className="action-section">
          <p>Saved Layouts</p>
          <ul className="saved-layouts">
            {savedLayouts.length > 0 &&
              savedLayouts.map((layout) => (
                <li key={layout.id}>
                  <span onClick={() => onSelectSavedLayout(layout)}>
                    {layout.id}
                  </span>
                  <button onClick={() => onDeletedSavedLayout(layout)}>
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
