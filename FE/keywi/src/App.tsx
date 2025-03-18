import { useState } from 'react'
import './App.css'

import { Text } from './styles/typography'

import ExampleComponent from './components/exampleComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Text variant="title1" weight="bold" color="darkKiwi">
          키위에 어서오세요!!
        </Text>
        <Text variant="body1" color="kiwi">
          키위 색상 텍스트
        </Text>
        <ExampleComponent />
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
