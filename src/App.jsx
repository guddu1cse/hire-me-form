import { useEffect } from 'react'
import './App.css'
import HireMeForm from './component/HireMeForm'
function App() {

  useEffect(()=>{
    fetch(`${import.meta.env.VITE_BASE_URL}/api/track-visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // empty object as body
    })
  } , []);
  
  return <HireMeForm />
}

export default App
