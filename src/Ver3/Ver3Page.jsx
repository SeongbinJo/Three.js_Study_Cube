import '../App.css'
import './Ver3EventBox.css'
import Ver3CanvasBox from './Ver3CanvasBox';
import { useState } from 'react';

function Ver3Page() {
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
        <div className='ver1-hovered-box' style={{ 
                position: 'absolute',   // absolute로 지정하여 캔버스 위에 띄움
                left: 30,               // 원하는 x 위치
                top: 30,                // 원하는 y 위치
                zIndex: 10             // 다른 요소들보다 위에 위치하도록 설정
            }}>
                [Ver3] - 25.02.19<br />
                1. 마우스로 box 모델 클릭시 해당 모델의 정보창 팝업<br />
                2. 팝업창 - 치아 상태 버튼, 메모(기능 비활성화)
            </div>
      </div>
    </>
  )
}

export default Ver3Page