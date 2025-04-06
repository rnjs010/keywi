import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchRecentKeywords,
  deleteAllRecentKeywords,
  searchKeys,
} from '../services/searchService'

// 최근 검색어
export const useRecent = (userId: number = 1) => {
  // 유저아이디 꼭 필요한 것인가,,, 토큰으로 유저 검색 가능함,,?
  const queryClient = useQueryClient()

  // 최근 검색어 가져오기
  const { data: recentKeywords = [] } = useQuery({
    queryKey: searchKeys.recentKeywords(userId),
    queryFn: () => fetchRecentKeywords(userId),
    // 페이지 진입마다 최신 데이터 가져오기
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  // 모든 최근 검색어 삭제 뮤테이션
  const deleteAllMutation = useMutation({
    mutationFn: () => deleteAllRecentKeywords(userId),
    onSuccess: () => {
      // 성공 시 캐시 무효화하고 다시 불러오기
      queryClient.invalidateQueries({
        queryKey: searchKeys.recentKeywords(userId),
      })
      // 또는 직접 데이터를 업데이트할 수도 있음
      queryClient.setQueryData(searchKeys.recentKeywords(userId), [])
    },
  })

  return {
    recentKeywords,
    deleteAllRecentKeywords: () => deleteAllMutation.mutate(),
    isDeleting: deleteAllMutation.isPending,
  }
}
