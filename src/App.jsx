import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Ver1Page from './Ver1/Ver1Page'
import Ver2Page from './Ver2/Ver2Page'
import Ver3Page from './Ver3/Ver3Page'
import Ver4Page from './Ver4/Ver4Page'
import Ver5Page from './Ver5/Ver5Page'
import Ver6Page from './Ver6/Ver6Page'
import Home from './Home'
import { useEffect } from 'react'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ver1" element={<Ver1Page />} />
        <Route path="/ver2" element={<Ver2Page />} />
        <Route path="/ver3" element={<Ver3Page />} />
        <Route path="/ver4" element={<Ver4Page />} />
        <Route path="/ver5" element={<Ver5Page />} />
        <Route path="/ver6" element={<Ver6Page />} />
      </Routes>
    </Router>
  )
}

export default App