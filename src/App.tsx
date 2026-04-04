import { Routes, Route, ReactElement } from 'react-router-dom'
import Home from './pages/Home'
import KeyType from './pages/KeyType'

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/keytype" element={<KeyType />} />
    </Routes>
  )
}

export default App

