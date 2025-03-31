import BoardDetailPage from './pages/board/BoardDetailPage'
import BoardPage from './pages/board/BoardPage'
import BoardWritePage from './pages/board/BoardWritePage'
import LoginCompletePage from './pages/login/LoginCompletePage'
import LoginPage from './pages/login/LoginPage'
import Fonts from './styles/fonts'
import MainPage from './pages/login/MainPage'
import HomePage from './pages/home/HomePage'
import HomeCommentPage from './pages/home/HomeCommentPage'
import { Route, Routes } from 'react-router-dom'
import PayPage from './pages/pay/PayPage'
import HomeImgSelectPage from './pages/home/HomeImgSelectPage'
import HomeTagPage from './pages/home/HomeTagPage'
import HomeWritePage from './pages/home/HomeWritePage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <>
      <Fonts />
      <Routes>
        {/* 처음 입장시 스플래시 화면 구성할 예정 */}
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/complete" element={<LoginCompletePage />} />
      </Routes>
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
        <Route path="/pay" element={<PayPage />} />
      </Routes>
    </>
  )
}

export default App
