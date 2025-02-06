import { useState } from 'react'
import './App.css'
import './CanvasBox/CanvasBox'
import CanvasBox from './CanvasBox/CanvasBox'

function App() {
  return (
    <>
        <div class="model-box">
          <CanvasBox></CanvasBox>
        </div>
    </>
  )
}

export default App
