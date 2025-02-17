import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Ver1Page from './Ver1/Ver1Page'
import Ver2Page from './Ver2/Ver2Page'
import Ver3Page from './Ver3/Ver3Page'

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <div>
          <Link to="/ver1">
            <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>Ver1_25.02.06</button>
          </Link>
          <Link to="/ver2">
            <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>Ver2_25.02.12</button>
          </Link>
          <Link to="/ver3">
            <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>Ver3_25.02.17</button>
          </Link>
        </div>
        <Routes>
          <Route path="/ver1" element={<Ver1Page />} />
          <Route path="/ver2" element={<Ver2Page />} />
          <Route path="/ver3" element={<Ver3Page />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App