import '../App.css'
import './Ver3HoveredBox.css'
import Ver3CanvasBox from './Ver3CanvasBox';
import { useState } from 'react';

function Ver3Page() {
  const [hoveredData, setHoveredData] = useState({ hovered: false, x: 0, y: 0, id: ""})

  const hoverHandler = (hovered, x, y, id = "") => {
    setHoveredData({hovered, x, y, id})
  }

  return (
    <>
      <div className="model-box">
        <Ver3CanvasBox yModelCount={3} xModelCount={4} spacing={1.5} setHoveredData={hoverHandler} />
        {hoveredData.hovered && (
          <div className='ver3-hovered-box'
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

export default Ver3Page