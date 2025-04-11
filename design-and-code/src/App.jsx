import { useState } from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header />    
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
     <Footer />
    </>
  )
}

export default App
