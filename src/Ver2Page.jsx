import './App.css'
import CanvasBox from './CanvasBox/CanvasBox'
import { useState } from 'react';

function Ver2Page() {
  const [hoveredData, setHoveredData] = useState({ hovered: false, x: 0, y: 0})

  const hoverHandler = (hovered, x, y) => {
    setHoveredData({hovered, x, y})
  }

  return (
    <>
      <div className="model-box">
        <CanvasBox yModelCount={3} xModelCount={4} spacing={1.5} setHoveredData={hoverHandler} />
        {hoveredData.hovered && (
          <div
            style={{
              position: "absolute",
              left: hoveredData.x + 20,
              top: hoveredData.y - 100,
              width: "100px",
              height: "75px",
              backgroundColor: "red",
              zIndex: 10
            }}></div>
        )}
      </div>
    </>
  )
}

export default Ver2Page