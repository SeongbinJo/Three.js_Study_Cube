import '../App.css'
import './Ver2HoveredBox.css'
import Ver2CanvasBox from './Ver2CanvasBox';
import { useState } from 'react';

function Ver2Page() {
  const [hoveredData, setHoveredData] = useState({ hovered: false, x: 0, y: 0, id: ""})

  const hoverHandler = (hovered, x, y, id = "") => {
    setHoveredData({hovered, x, y, id})
  }

  return (
    <>
      <div className="model-box">
        <Ver2CanvasBox yModelCount={3} xModelCount={4} spacing={1.5} setHoveredData={hoverHandler} />
        {hoveredData.hovered && (
          <div className='ver2-hovered-box'
            style={{
              left: hoveredData.x + 30,
              top: hoveredData.y - 130,
            }}>
              {hoveredData.id}
            </div>
        )}
      </div>
    </>
  )
}

export default Ver2Page