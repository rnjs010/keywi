import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'

function useAuth() {
  const { isLoading, isAuthenticated, error, logout, checkAuth } =
    useAuthStore()

  // 컴포넌트 마운트시 인증상태 확인
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    isLoading,
    isAuthenticated,
    error,
    logout,
  }
}

export default useAuth
