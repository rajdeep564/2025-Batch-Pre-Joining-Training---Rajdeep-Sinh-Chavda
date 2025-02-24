import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  console.log(count);
  return (
    <>
        <h1>count is {count}</h1>
        <button onClick={() => {
          setCount((prev) => prev + 1);
          setCount((prev) => prev + 1);
          setCount((prev) => prev + 1);
        }}>
          increase
        </button>
        <button onClick={() => {
          setCount((prev) => prev - 1);
        }}>
          decrease
        </button>
    </>
  )
}

export default App
