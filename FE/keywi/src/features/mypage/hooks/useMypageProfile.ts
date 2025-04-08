// features/mypage/hooks/useMypageProfile.ts
import { MyAccountInfo, MypageProfileInfo } from '@/interfaces/MypageInterface'
import { useQuery } from '@tanstack/react-query'
import {
  getAccountInfo,
  getProfileInfo,
} from '../services/mypageProfileService'

export const useMypageProfile = (userId: number | undefined) => {
  return useQuery<MypageProfileInfo, Error>({
    queryKey: ['mypage', 'profile', userId],
    queryFn: () => {
      if (!userId) throw new Error('사용자 ID가 필요합니다')
      return getProfileInfo(userId)
    },
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분 캐시
    gcTime: 10 * 60 * 1000, // 10분 동안 가비지 컬렉션 전까지 캐시 유지
    retry: 1, // 실패 시 1번만 재시도
  })
}

export const useMyAccountInfo = () => {
  return useQuery<MyAccountInfo, Error>({
    queryKey: ['mypage', 'account'],
    queryFn: getAccountInfo,
  })
}
