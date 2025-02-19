import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Ver1Page from './Ver1/Ver1Page'
import Ver2Page from './Ver2/Ver2Page'
import Ver3Page from './Ver3/Ver3Page'
import Ver4Page from './Ver4/Ver4Page'
import Home from './Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ver1" element={<Ver1Page />} />
        <Route path="/ver2" element={<Ver2Page />} />
        <Route path="/ver3" element={<Ver3Page />} />
        <Route path="/ver4" element={<Ver4Page />} />
      </Routes>
    </Router>
  )
}

export default App