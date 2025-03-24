import NavBar from './components/NavBar'
import BoardDetailPage from './pages/board/BoardDetailPage'
import BoardPage from './pages/board/BoardPage'
import BoardWritePage from './pages/board/BoardWritePage'
import Fonts from './styles/fonts'
import { Route, Routes, useLocation } from 'react-router-dom'

function App() {
  const location = useLocation() // 현재 경로 가져오기

  return (
    <>
      <Fonts />
      <Routes>
        {/* 스플래시 화면 구성할 예정 */}
        {/* <Route path="/" element={SplashScreen} /> */}
        <Route path="/board" element={<BoardPage />} />
        <Route path="/board/:postId" element={<BoardDetailPage />} />
        <Route path="/board/write" element={<BoardWritePage />} />
      </Routes>

      {/* 현재 경로가 "/"일 때만 NavBar 표시 */}
      {location.pathname === '/' && <NavBar />}
    </>
  )
}

export default App
