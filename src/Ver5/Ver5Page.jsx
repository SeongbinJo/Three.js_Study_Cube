import '../App.css'
import './Ver5EventBox.css'
import Ver5CanvasBox from './Ver5CanvasBox'
import Ver5NavBar from './Ver5NavBar'
import Ver5HelpButton from './Ver5HelpButton'
import Ver5ModelInfo from './Ver5ModelInfo'
import { useState } from 'react'

function Ver5Page() {
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
      setClickedModel({ visible: true, id: parsedData.id})
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
    setClickedModel({ visible: false, id: "" })
  }

  return (
    <>
    <Ver5NavBar searchedModel={clickHandler}/>
      <div className="model-box">
        <Ver5CanvasBox
          yModelCount={3}
          xModelCount={4}
          spacing={1.5}
          setHoveredData={hoverHandler}
          setClickedModel={clickHandler}
          clickedModel={clickedModel}
        />
        {hoveredData.hovered && (
          <div className='ver5-hovered-box'
            style={{
              left: hoveredData.x + 30,
              top: hoveredData.y - 130,
            }}>
            {hoveredData.id}
          </div>
        )}
        {clickedModel.visible && (
          <div className='ver5-clicked-box'>
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
            <textarea className='eventBox-textarea' rows='10' cols='50' value={memoText}></textarea>
            <div className='close-save-box'>
              <button className='close-button' onClick={closeButton}>닫기</button>
              <button className='save-button' onClick={closeButton}>저장</button>
            </div>
          </div>
        )}
      </div>
      <Ver5HelpButton/>
    </>
  )
}

export default Ver5Page