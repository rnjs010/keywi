import { LoginProvider } from './features/login/services/LoginContext'
import CompletePage from './pages/login/CompletePage'
import LoginPage from './pages/login/LoginPage'
import Fonts from './styles/fonts'
import { Route, Routes } from 'react-router-dom'
import MainPage from './pages/login/MainPage'

function App() {
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
    </>
  )
}

export default App
