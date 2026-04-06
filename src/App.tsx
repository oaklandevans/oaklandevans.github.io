import { ReactElement } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import KeyType from './pages/KeyType'
import MarioOnline from './pages/MarioOnline'
import About from './pages/About'

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/keytype" element={<KeyType />} />
      <Route path="/mario-online" element={<MarioOnline />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default App
