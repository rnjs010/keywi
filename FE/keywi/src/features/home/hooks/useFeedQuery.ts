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
      console.log('피드 요청 - 페이지:', pageParam)
      try {
        const response = await getRecommendedFeeds(Number(pageParam), 5)
        return response
      } catch (error) {
        console.error('피드 요청 오류:', error)
        throw error
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // 디버깅용 로그 추가
      console.log('마지막 페이지 정보:', {
        currentPage: lastPage.currentPage,
        totalPages: lastPage.totalPages,
        isLast: lastPage.last,
        hasContent: lastPage.content.length > 0,
        pageCount: allPages.length,
      })

      // 더 가져올 데이터가 있고, 현재 페이지가 전체 페이지보다 작은 경우 다음 페이지 반환
      if (!lastPage.last && lastPage.content.length > 0) {
        return lastPage.currentPage + 1
      }

      // 마지막 페이지이거나 데이터가 없는 경우 undefined 반환 (더 이상 페이지 없음)
      return undefined
    },
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false, // 창이 포커스를 얻을 때 다시 가져오지 않음
    retry: 2, // 실패 시 최대 2번 재시도
    // React Query 캐시가 유지되는 시간 설정 (10분)
    gcTime: 1000 * 60 * 10,
  })
}
