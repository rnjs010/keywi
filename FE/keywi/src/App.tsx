import NavBar from './components/NavBar'
import BoardDetailPage from './pages/board/BoardDetailPage'
import BoardPage from './pages/board/BoardPage'
import BoardWritePage from './pages/board/BoardWritePage'
import { LoginProvider } from './features/login/services/LoginContext'
import CompletePage from './pages/login/CompletePage'
import LoginPage from './pages/login/LoginPage'
import Fonts from './styles/fonts'
import MainPage from './pages/login/MainPage'
import { Route, Routes, useLocation } from 'react-router-dom'

function App() {
  const location = useLocation() // 현재 경로 가져오기

  return (
    <>
      <Fonts />
      <LoginProvider>
        <Routes>
          {/* 처음 입장시 스플래시 화면 구성할 예정 */}
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/complete" element={<CompletePage />} />
        </Routes>
      </LoginProvider>
      <Routes>
        <Route path="/board" element={<BoardPage />} />
        <Route path="/board/:postId" element={<BoardDetailPage />} />
        <Route path="/board/write" element={<BoardWritePage />} />
      </Routes>

      {/* 현재 경로가 "/"일 때만 NavBar 표시 */}
      {location.pathname === '/home' && <NavBar />}
    </>
  )
}

export default App
