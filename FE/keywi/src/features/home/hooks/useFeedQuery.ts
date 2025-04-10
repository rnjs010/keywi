//NOTE - 피드 무한스크롤 조회
import { useInfiniteQuery } from '@tanstack/react-query'
import { FeedResponse } from '@/interfaces/HomeInterfaces'
import { getRecommendedFeeds } from '../services/feedService'

export const useFeedQuery = () => {
  return useInfiniteQuery<
    FeedResponse,
    Error,
    { pages: FeedResponse[]; pageParams: number[] }
  >({
    queryKey: ['feeds', 'recommended'],
    queryFn: async ({ pageParam }) => {
      try {
        const response = await getRecommendedFeeds(Number(pageParam), 5)
        return response
      } catch (error) {
        console.error('피드 요청 오류:', error)
        throw error
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.last && lastPage.content.length > 0) {
        return lastPage.currentPage + 1
      }
      return undefined
    },
    staleTime: 1000 * 60 * 1, // 1분
    refetchOnWindowFocus: false, // 창이 포커스를 얻을 때 다시 가져오지 않음
    retry: 2, // 실패 시 최대 2번 재시도
    // React Query 캐시가 유지되는 시간 설정 (10분)
    gcTime: 1000 * 60 * 1,
  })
}
