import ExampleComponent from './components/exampleComponent'
import BoardPage from './pages/board/BoardPage'
import Fonts from './styles/fonts'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <>
      <Fonts />
      {/* <ExampleComponent /> */}
      <BoardPage />
      <Routes>
        {/* 스플래시 화면 구성할 예정 */}
        {/* <Route path="/" element={SplashScreen} /> */}
      </Routes>
    </>
  )
}

export default App
