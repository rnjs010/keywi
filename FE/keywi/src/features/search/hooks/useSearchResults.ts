// features/search/hooks/useSearchResults.ts
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchSearchResults } from '../services/searchService'

export const useSearchResults = (
  tab: 'feeds' | 'products' | 'users',
  query: string,
) => {
  return useInfiniteQuery({
    queryKey: ['search', tab, query],
    queryFn: ({ pageParam = 1 }) =>
      fetchSearchResults({
        tab,
        query,
        page: pageParam,
        size: 30, // 한 번에 가져올 결과 수
      }),
    getNextPageParam: (lastPage, allPages) => {
      // 더 불러올 데이터가 있는지 확인
      // API가 다음 페이지 여부를 반환하지 않는다면 결과 길이로 판단
      return lastPage.length === 0 ? undefined : allPages.length + 1
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  })
}
