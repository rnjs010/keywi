import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchUserInfo, UserData } from '@/services/userIdService'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'

// 쿼리 키 상수
export const USER_INFO_QUERY_KEY = ['userInfo']

export const useUserInfo = () => {
  const { isAuthenticated } = useAuthStore()
  const { userId, setUserId } = useUserStore()
  const queryClient = useQueryClient()

  // useQuery에서 콜백을 제거하고 기본 옵션만 사용
  const query = useQuery<UserData>({
    queryKey: USER_INFO_QUERY_KEY,
    queryFn: fetchUserInfo,
    enabled: isAuthenticated, // 인증된 경우에만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 신선하게 유지
    gcTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
    retry: 1, // 실패 시 1번만 재시도
  })

  const { data: userInfo, isLoading, error, refetch } = query

  // useEffect를 사용하여 데이터 변경 시 처리
  useEffect(() => {
    if (userInfo?.userId && (!userId || userId !== userInfo.userId)) {
      setUserId(userInfo.userId)
    }
  }, [userInfo, userId, setUserId])

  // 에러 처리를 위한 useEffect
  useEffect(() => {
    if (error) {
      console.error('Failed to fetch user info:', error)
    }
  }, [error])

  // 사용자 정보 수동 업데이트 함수
  const updateUserInfo = () => {
    queryClient.invalidateQueries({ queryKey: USER_INFO_QUERY_KEY })
  }

  return {
    userInfo,
    isLoading,
    error,
    refetch,
    updateUserInfo,
  }
}
