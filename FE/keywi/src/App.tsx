import CompletePage from './pages/login/CompletePage'
import LoginPage from './pages/login/LoginPage'
import MainPage from './pages/login/MainPage'
import Fonts from './styles/fonts'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <>
      <Fonts />
      <CompletePage />
      <Routes>
        {/* 스플래시 화면 구성할 예정 */}
        {/* <Route path="/" element={<MainPage />} /> */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </>
  )
}

export default App
