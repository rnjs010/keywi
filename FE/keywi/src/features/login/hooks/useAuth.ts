import { useAuthStore } from '@/stores/authStore'
import { useEffect, useState } from 'react'
import { useUserInfo } from '@/features/login/hooks/useUserInfo'

function useAuth() {
  const {
    isLoading: authLoading,
    isAuthenticated,
    error: authError,
    logout,
    initialize,
    initialized,
  } = useAuthStore()

  const [isInitializing, setIsInitializing] = useState(!initialized)

  // useUserInfo 훅 사용 (인증된 경우에만 쿼리 실행)
  const {
    userInfo,
    isLoading: userLoading,
    error: userError,
    updateUserInfo,
  } = useUserInfo()

  // 컴포넌트 마운트시 인증상태 초기화
  useEffect(() => {
    const initAuth = async () => {
      if (!initialized) {
        setIsInitializing(true)
        await initialize()
        setIsInitializing(false)
      }
    }

    initAuth()
  }, [initialized, initialize])

  // 로그아웃 확장 함수 - 서버 로그아웃 처리 추가
  const handleLogout = async () => {
    try {
      // 서버 로그아웃 API 호출 (필요한 경우)
      // await authServices.logout()

      // 로컬 로그아웃 처리
      logout()
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error)
      // 오류가 발생해도 로컬에서는 로그아웃 처리
      logout()
    }
  }

  return {
    isLoading: authLoading || userLoading || isInitializing,
    isAuthenticated,
    error: authError || userError,
    userInfo,
    logout: handleLogout,
    updateUserInfo,
    isInitialized: initialized && !isInitializing,
  }
}

export default useAuth
