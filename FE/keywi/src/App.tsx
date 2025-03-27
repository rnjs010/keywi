import NavBar from './components/NavBar'
import BoardDetailPage from './pages/board/BoardDetailPage'
import BoardPage from './pages/board/BoardPage'
import BoardWritePage from './pages/board/BoardWritePage'
import { LoginProvider } from './features/login/services/LoginContext'
import LoginCompletePage from './pages/login/LoginCompletePage'
import LoginPage from './pages/login/LoginPage'
import Fonts from './styles/fonts'
import MainPage from './pages/login/MainPage'
import HomePage from './pages/home/HomePage'
import HomeCommentPage from './pages/home/HomeCommentPage'
import { Route, Routes, useLocation } from 'react-router-dom'
import PayPage from './pages/pay/PayPage'

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
          <Route path="/login/complete" element={<LoginCompletePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/home/comment/:feedId" element={<HomeCommentPage />} />
        </Routes>
      </LoginProvider>
      <Routes>
        <Route path="/board" element={<BoardPage />} />
        <Route path="/board/:postId" element={<BoardDetailPage />} />
        <Route path="/board/write" element={<BoardWritePage />} />
        <Route path="/pay" element={<PayPage />} />
      </Routes>

      {/* 현재 경로가 "/"일 때만 NavBar 표시 */}
      {location.pathname === '/home' && <NavBar />}
    </>
  )
}

export default App
