import { LoginProvider } from './features/login/services/LoginContext'
import LoginCompletePage from './pages/login/LoginCompletePage'
import LoginPage from './pages/login/LoginPage'
import Fonts from './styles/fonts'
import { Route, Routes } from 'react-router-dom'
// import MainPage from './pages/login/MainPage'
import HomePage from './pages/home/HomePage'
import HomeCommentPage from './pages/home/HomeCommentPage'
import HomeWritePage from './pages/home/HomeWritePage'

function App() {
  return (
    <>
      <Fonts />
      <LoginProvider>
        <Routes>
          {/* 처음 입장시 스플래시 화면 구성할 예정 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/complete" element={<LoginCompletePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/home/comment/:feedId" element={<HomeCommentPage />} />
          <Route path="/home/write" element={<HomeWritePage />} />
        </Routes>
      </LoginProvider>
    </>
  )
}

export default App
