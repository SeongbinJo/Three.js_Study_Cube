import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Ver1Page from './Ver1/Ver1Page'
import Ver2Page from './Ver2/Ver2Page'
import Ver3Page from './Ver3/Ver3Page'
import Ver4Page from './Ver4/Ver4Page'
import Ver5Page from './Ver5/Ver5Page'
import Ver6Page from './Ver6/Ver6Page'
import Ver7Page from './Ver7/Ver7Page'
import Home from './Home'
import SidePage from './SidePage/SidePage'
import SidePage2 from './SidePage2/SidePage2'
import SidePage2_1 from './SidePage2_1/SidePage2_1'
import SidePage3 from './SidePage3/SidePage3'
import SidePage4 from './SidePage4/SidePage4'
import SidePage5 from './SidePage5/SidePage5'

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
        <Route path="/ver7" element={<Ver7Page />} />
        <Route path="/sidepage" element={<SidePage />} />
        <Route path="/sidepage2" element={<SidePage2 />} />
        <Route path="/sidepage2_1" element={<SidePage2_1 />} />
        <Route path="/sidepage3" element={<SidePage3 />} />
        <Route path="/sidepage4" element={<SidePage4 />} />
        <Route path="/sidepage5" element={<SidePage5 />} />
      </Routes>
    </Router>
  )
}

export default App