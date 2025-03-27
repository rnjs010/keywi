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
import { Route, Routes } from 'react-router-dom'
import HomeImgSelectPage from './pages/home/HomeImgSelectPage'
import HomeTagPage from './pages/home/HomeTagPage'
import HomeWritePage from './pages/home/HomeWritePage'

function App() {
  return (
    <>
      <Fonts />
      {/* 로그인 저장용 provider - 백이랑 연동 후 삭제 예정 */}
      <LoginProvider>
        <Routes>
          {/* 처음 입장시 스플래시 화면 구성할 예정 */}
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/complete" element={<LoginCompletePage />} />
        </Routes>
      </LoginProvider>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/home/comment/:feedId" element={<HomeCommentPage />} />
        <Route path="/home/imgselect" element={<HomeImgSelectPage />} />
        <Route path="/home/tag" element={<HomeTagPage />} />
        <Route path="/home/write" element={<HomeWritePage />} />
      </Routes>
      <Routes>
        <Route path="/board" element={<BoardPage />} />
        <Route path="/board/:postId" element={<BoardDetailPage />} />
        <Route path="/board/write" element={<BoardWritePage />} />
      </Routes>
    </>
  )
}

export default App
