import '../App.css'
import './Ver4EventBox.css'
import Ver4CanvasBox from './Ver4CanvasBox'
import Ver4NavBar from './Ver4NavBar'
import Ver4HelpButton from './Ver4HelpButton'
import { useState } from 'react'

function Ver4Page() {
  const [hoveredData, setHoveredData] = useState({ hovered: false, x: 0, y: 0, id: "" })
  const [clickedModel, setClickedModel] = useState({ visible: false, id: "" })
  const [selectedButtons, setSelectedButtons] = useState([])
  const eventBoxButtons = ['충치', '발치', '임플란트', '레진']

  const hoverHandler = (hovered, x, y, id = "") => {
    setHoveredData({ hovered, x, y, id })
  }

  const clickHandler = (id) => {
    setClickedModel({ visible: true, id })
  }

  const toggleButton = (button) => {
    setSelectedButtons((prevSelected) =>
      prevSelected.includes(button) ? prevSelected.filter((btn) => btn !== button) : [...prevSelected, button]
    )
  }

  const closeButton = () => {
    setClickedModel({ visible: false, id: "" })
  }

  const saveButton = () => {
    setClickedModel({ visible: false, id: "" })
  }

  return (
    <>
    <Ver4NavBar/>
      <div className="model-box">
        <Ver4CanvasBox
          yModelCount={3}
          xModelCount={4}
          spacing={1.5}
          setHoveredData={hoverHandler}
          setClickedModel={clickHandler}
        />
        {hoveredData.hovered && (
          <div className='ver4-hovered-box'
            style={{
              left: hoveredData.x + 30,
              top: hoveredData.y - 130,
            }}>
            {hoveredData.id}
          </div>
        )}
        {clickedModel.visible && (
          <div className='ver4-clicked-box'>
            <p>{clickedModel.id}</p>
            {eventBoxButtons.map((button) => (
              <button
                key={button}
                className={`toggle-button ${selectedButtons.includes(button) ? 'selected' : ''}`}
                onClick={() => toggleButton(button)}
              >
                {button}
              </button>
            ))}
            <p />
            <div>치아 상태 : {selectedButtons.join(', ')}</div>
            <p />
            <p>메모</p>
            <textarea className='eventBox-textarea' rows='10' cols='50'></textarea>
            <div className='close-save-box'>
              <button className='close-button' onClick={closeButton}>닫기</button>
              <button className='save-button' onClick={closeButton}>저장</button>
            </div>
          </div>
        )}
      </div>
      <Ver4HelpButton/>
      <div className='ver1-hovered-box' style={{ 
                position: 'absolute',   // absolute로 지정하여 캔버스 위에 띄움
                left: 30,               // 원하는 x 위치
                top: 90,                // 원하는 y 위치
                zIndex: 10             // 다른 요소들보다 위에 위치하도록 설정
            }}>
                [Ver4] - 25.02.19<br />
                1. 상단바 추가(기능 x)<br />
                2. 도움말 추가(기능 x)<br />
            </div>
    </>
  )
}

export default Ver4Page