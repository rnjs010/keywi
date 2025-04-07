import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import LoadingMessage from '@/components/message/LoadingMessage'

export const AuthRedirect = () => {
  const { isAuthenticated, isLoading, initialized, initialize } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      // 초기화가 안되었으면 초기화 진행
      if (!initialized) {
        await initialize()
      }
      setIsChecking(false)
    }

    checkAuth()
  }, [initialized, initialize])

  // 초기화 중이거나 로딩 중이면 로딩 표시
  if (isChecking || isLoading) {
    return <LoadingMessage />
  }

  // 인증 상태에 따라 리다이렉트
  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  } else {
    return <Navigate to="/main" replace />
  }
}
