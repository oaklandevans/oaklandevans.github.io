import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import KeyType from './pages/KeyType'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/keytype" element={<KeyType />} />
    </Routes>
  )
}

export default App
