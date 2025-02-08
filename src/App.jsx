import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Ver1Page from './Ver1Page'
import Ver2Page from './Ver2Page'

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <div>
          <Link to="/ver1">
            <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>Go to Ver1</button>
          </Link>
          <Link to="/ver2">
            <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>Go to Ver2</button>
          </Link>
        </div>
        <Routes>
          <Route path="/ver1" element={<Ver1Page />} />
          <Route path="/ver2" element={<Ver2Page />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;