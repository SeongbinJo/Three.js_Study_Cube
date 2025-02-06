import { useState, useEffect } from 'react'
import './App.css'
import CanvasBox from './CanvasBox/CanvasBox'

function App() {
  const [yCountInput, setYCountInput] = useState(3)
  const [xCountInput, setXCountInput] = useState(4)
  const [spacingInput, setSpacingInput] = useState(1.5)

  const [yModelCount, setYModelCount] = useState(3)
  const [xModelCount, setXModelCount] = useState(4)
  const [spacing, setSpacing] = useState(1.5)

  const updateCanvasBoxs = () => {
    setYModelCount(yCountInput)
    setXModelCount(xCountInput)
    setSpacing(spacingInput)

    console.log("업데이트된 값:", yCountInput, xCountInput, spacingInput)
  }

  useEffect(() => {
    console.log("CanvasBox 렌더링:", yModelCount, xModelCount, spacing)
  }, [yModelCount, xModelCount, spacing])

  return (
    <>
      <div>
        <label>세로 모델 개수 :
          <input type="number" value={yCountInput} onChange={(e) => setYCountInput(Number(e.target.value))}></input>
        </label>
        <label> 가로 모델 개수 :
          <input type="number" value={xCountInput} onChange={(e) => setXCountInput(Number(e.target.value))}></input>
        </label>
        <label> 모델 간격 :
          <input type="number" value={spacingInput} onChange={(e) => setSpacingInput(Number(e.target.value))}></input>
        </label>
        <button onClick={updateCanvasBoxs}>적용</button>
      </div>
      <div className="model-box">
        <CanvasBox yModelCount={yModelCount} xModelCount={xModelCount} spacing={spacing}></CanvasBox>
      </div>
    </>
  )
}

export default App