import { useState } from 'react'

export default function Counter({ initCount = 0 }: { initCount: number }) {
  const [count, setCount] = useState(initCount)

  function incrementCount() {
    setCount((count) => count + 1)
  }

  return (
    <>
      <p>React counter: {count}</p>
      <button onClick={incrementCount}>+1</button>
    </>
  )
}
