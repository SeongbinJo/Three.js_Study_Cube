import '../App.css'
import './Ver3EventBox.css'
import Ver3CanvasBox from './Ver3CanvasBox';
import { useState } from 'react';

function Ver3Page() {
  const [hoveredData, setHoveredData] = useState({ hovered: false, x: 0, y: 0, id: "" })
  const [clickedModel, setClickedModel] = useState({ visible: false, id: "" })

  const hoverHandler = (hovered, x, y, id = "") => {
    setHoveredData({ hovered, x, y, id })
  }

  const clickHandler = (id) => {
    setClickedModel({ visible: true, id })
  }

  const closeBox = () => {
    setClickedModel({ visible: false, id: "" })
  }

  return (
    <>
      <div className="model-box">
        <Ver3CanvasBox
          yModelCount={3}
          xModelCount={4}
          spacing={1.5}
          setHoveredData={hoverHandler}
          setClickedModel={clickHandler}
        />
        {hoveredData.hovered && (
          <div className='ver3-hovered-box'
            style={{
              left: hoveredData.x + 30,
              top: hoveredData.y - 130,
            }}>
            {hoveredData.id}
          </div>
        )}
        {clickedModel.visible && (
          <div className='ver3-clicked-box'>
            <button className='close-button' onClick={closeBox}>X</button>
            <p>{clickedModel.id}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default Ver3Page