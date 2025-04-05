import { useAuthStore } from '@/stores/authStore'
import { Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, initialized, initialize } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  // 초기화되지 않았거나 로딩 중이면 로딩 표시
  if (!initialized || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>인증 상태 확인 중...</p>
      </div>
    )
  }

  // 인증되지 않았으면 홈으로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return <>{children}</>
}
