import { useState } from 'react'
import './App.css'
import HireMeForm from './component/HireMeForm'
function App() {
  const [count, setCount] = useState(0)
  return <HireMeForm />
}

export default App
