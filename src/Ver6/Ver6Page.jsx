import '../App.css'
import './Ver6EventBox.css'
import Ver6CanvasBox from './Ver6CanvasBox'
import Ver6NavBar from './Ver6NavBar'
import Ver6HelpButton from './Ver6HelpButton'
import Ver6ModelInfo from './Ver6ModelInfo'
import { useState } from 'react'

function Ver6Page() {
  const [hoveredData, setHoveredData] = useState({ hovered: false, x: 0, y: 0, id: "" })
  const [clickedModel, setClickedModel] = useState({ visible: false, id: "" })
  const [selectedButtons, setSelectedButtons] = useState([])
  const [memoText, setMemoText] = useState("")
  const eventBoxButtons = ['충치', '발치', '임플란트', '레진']

  const hoverHandler = (hovered, x, y, id = "") => {
    setHoveredData({ hovered, x, y, id })
  }

  const clickHandler = (id) => {
    const getStoredData = localStorage.getItem(id)
    if (getStoredData) {
      const parsedData = JSON.parse(getStoredData)
      setClickedModel({ visible: true, id: parsedData.id })
      setSelectedButtons(parsedData.status)
      setMemoText(parsedData.memo)
    } else {
      setClickedModel({ visible: true, id: id })
      setSelectedButtons([])
      setMemoText("")
    }
  }

  // 모델 클릭시 나오는 팝업창의 치아상태 버튼
  const toggleButton = (button) => {
    setSelectedButtons((prevSelected) =>
      prevSelected.includes(button) ? prevSelected.filter((btn) => btn !== button) : [...prevSelected, button]
    )
  }

  const closeButton = () => {
    setClickedModel({ visible: false, id: "" })
  }

  const saveButton = () => {
    if (!clickedModel.id) return

    const updateData = new Ver6ModelInfo(clickedModel.id, selectedButtons, memoText)
    localStorage.setItem(clickedModel.id, JSON.stringify(updateData))
    setClickedModel({ visible: false, id: "" })
  }

  return (
    <>
      <Ver6NavBar searchedModel={clickHandler} />
      <div className="model-box">
        <Ver6CanvasBox
          yModelCount={3}
          xModelCount={4}
          spacing={1.5}
          setHoveredData={hoverHandler}
          setClickedModel={clickHandler}
          clickedModel={clickedModel}
        />
        {hoveredData.hovered && (
          <div className='ver6-hovered-box'
            style={{
              left: hoveredData.x + 30,
              top: hoveredData.y - 130,
            }}>
            {hoveredData.id}
          </div>
        )}
        {clickedModel.visible && (
          <div className='ver6-clicked-box'>
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
            <textarea
              className='eventBox-textarea'
              rows='10'
              cols='50'
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
            ></textarea>
            <div className='close-save-box'>
              <button className='close-button' onClick={closeButton}>닫기</button>
              <button className='save-button' onClick={saveButton}>저장</button>
            </div>
          </div>
        )}
      </div>
      <div className='ver1-hovered-box' style={{ 
                position: 'absolute',   // absolute로 지정하여 캔버스 위에 띄움
                left: 30,               // 원하는 x 위치
                top: 90,                // 원하는 y 위치
                zIndex: 10             // 다른 요소들보다 위에 위치하도록 설정
            }}>
                [Ver6] - 25.03.03<br />
                1. 검색창 기능 강화(id 일부분 검색, 치아 상태 입력시 리스트 팝업)<br />
                2. 카메라 에임기능 추가<br />
                3. localStorage 적용<br />
            </div>
      <Ver6HelpButton />
    </>
  )
}

export default Ver6Page