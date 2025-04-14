import { useState } from 'react'

import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(1)

  return (
    <>
      <Header />
      <div className="card">
        <button onClick={() => setCount((count) => count + 2)}>
          count is {count}
        </button>       
      </div>
      <Footer />
    </>
  )
}

export default App
