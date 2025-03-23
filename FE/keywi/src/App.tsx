import NavBar from './components/NavBar'
import BoardDetailPage from './pages/board/BoardDetailPage'
import BoardPage from './pages/board/BoardPage'
import Fonts from './styles/fonts'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <>
      <Fonts />
      <Routes>
        {/* 스플래시 화면 구성할 예정 */}
        {/* <Route path="/" element={SplashScreen} /> */}
        <Route path="/board" element={<BoardPage />} />
        <Route path="/board/:postId" element={<BoardDetailPage />} />
      </Routes>
      <NavBar />
    </>
  )
}

export default App
