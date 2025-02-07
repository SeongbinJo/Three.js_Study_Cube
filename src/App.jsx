import { useState, useEffect } from 'react'
import './App.css'
import CanvasBox from './CanvasBox/CanvasBox'

function App() {
  return (
    <>
      <div className="model-box">
        <CanvasBox yModelCount={3} xModelCount={4} spacing={1.5}></CanvasBox>
      </div>
    </>
  )
}

export default App