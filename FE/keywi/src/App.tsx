import BoardDetailPage from './pages/board/BoardDetailPage'
import BoardPage from './pages/board/BoardPage'
import BoardWritePage from './pages/board/BoardWritePage'
import LoginCompletePage from './pages/login/LoginCompletePage'
import LoginPage from './pages/login/LoginPage'
import Fonts from './styles/fonts'
import MainPage from './pages/login/MainPage'
import HomePage from './pages/home/HomePage'
import HomeCommentPage from './pages/home/HomeCommentPage'
// NOTE - 로그인 테스트 원할 시 주석해제
import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
// import { Route, Routes, Navigate } from 'react-router-dom'
import PayPage from './pages/pay/PayPage'
import HomeImgSelectPage from './pages/home/HomeImgSelectPage'
import HomeTagPage from './pages/home/HomeTagPage'
import HomeWritePage from './pages/home/HomeWritePage'
import KakaoHandler from './features/login/hooks/KakaoHandler'
//NOTE - 로그인 테스트 원할 시 주석해제
import { ProtectedRoute } from './components/ProtectedRoute'
import MyPage from './pages/mypage/MyPage'
import { SettingPage } from './pages/mypage/SettingPage'
import { SettingAccountPage } from './pages/mypage/SettingAccountPage'
import ChatListPage from './pages/chat/ChatListPage'
import ChatRoomPage from './pages/chat/ChatRoomPage'
import DealRequestPage from './pages/chat/DealRequestPage'
import DealAcceptPage from './pages/chat/DealAcceptPage'
import SearchingPage from './pages/search/SearchingPage'
import { AfterSearchPage } from './pages/search/AfterSearchPage'
import { WebSocketProvider } from './services/WebSocketProvider'
import ProductPage from './pages/product/ProductPage'
import ProductDetailPage from './pages/product/ProductDetailPage'
import { AuthRedirect } from './components/AuthRedirect'
import FeedFullscreenPage from './pages/mypage/FeedFullscreenPage'

function App() {
  return (
    <WebSocketProvider>
      <Fonts />
      <Routes>
        {/* 메인 라우트 - 인증 상태에 따라 리다이렉트 */}
        <Route path="/" element={<AuthRedirect />} />

        {/* 공개 라우트 - 인증 필요 없음 */}
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/complete" element={<LoginCompletePage />} />
        <Route path="/callback/kakao" element={<KakaoHandler />} />
        {/* //NOTE - 로그인 테스트 원할 시 주석해제 */}
        {/* 보호된 라우트 - 인증 필요 */}
        <Route
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          {/* 홈 관련 라우트 */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/home/feed/:feedId" element={<FeedFullscreenPage />} />
          <Route path="/home/comment/:feedId" element={<HomeCommentPage />} />
          <Route path="/home/imgselect" element={<HomeImgSelectPage />} />
          <Route path="/home/tag" element={<HomeTagPage />} />
          <Route path="/home/write" element={<HomeWritePage />} />

          {/* 게시판 관련 라우트 */}
          <Route path="/board" element={<BoardPage />} />
          <Route path="/board/:postId" element={<BoardDetailPage />} />
          <Route path="/board/write" element={<BoardWritePage />} />

          {/* 결제 라우트 */}
          <Route path="/pay" element={<PayPage />} />

          {/* 상품 라우트 */}
          <Route
            path="/product/:categoryId?/:subCategoryId?"
            element={<ProductPage />}
          />
          <Route
            path="/product/detail/:productId"
            element={<ProductDetailPage />}
          />

          {/* 마이페이지 라우트 */}
          <Route path="/profile/:userId" element={<MyPage />} />
          <Route path="/setting" element={<SettingPage />} />
          <Route path="/setting/account" element={<SettingAccountPage />} />

          {/* 채팅페이지 라우트 */}
          <Route path="/chat" element={<ChatListPage />} />
          <Route path="/chat/:roomId" element={<ChatRoomPage />} />
          <Route
            path="/chat/:roomId/dealrequest"
            element={<DealRequestPage />}
          />
          <Route path="/chat/:roomId/dealaccept" element={<DealAcceptPage />} />

          {/* 검색 라우트 */}
          <Route path="/search" element={<SearchingPage />} />
          <Route path="/search/:query" element={<AfterSearchPage />} />
        </Route>

        {/* 404 페이지나 기타 예외 처리 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </WebSocketProvider>
  )
}

export default App
