import '../App.css'
import './Ver7EventBox.css'
import Ver7CanvasBox from './Ver7CanvasBox'
import Ver7NavBar from './Ver7NavBar'
import Ver7HelpButton from './Ver7HelpButton'
import Ver7ModelInfo from './Ver7ModelInfo'
import { useState } from 'react'

function Ver7Page() {
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

    const updateData = new Ver7ModelInfo(clickedModel.id, selectedButtons, memoText)
    localStorage.setItem(clickedModel.id, JSON.stringify(updateData))
    setClickedModel({ visible: false, id: "" })
  }

  return (
    <>
      <Ver7NavBar searchedModel={clickHandler} />
      <div className="model-box">
        <Ver7CanvasBox
          yModelCount={3}
          xModelCount={4}
          spacing={1.5}
          setHoveredData={hoverHandler}
          setClickedModel={clickHandler}
          clickedModel={clickedModel}
        />
        {hoveredData.hovered && (
          <div className='ver7-hovered-box'
            style={{
              left: hoveredData.x + 30,
              top: hoveredData.y - 130,
            }}>
            {hoveredData.id}
          </div>
        )}
        {clickedModel.visible && (
          <div className='ver7-clicked-box'>
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
      <Ver7HelpButton />
    </>
  )
}

export default Ver7Page