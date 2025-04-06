import { useQuery } from '@tanstack/react-query'
import { fetchPopularKeywords } from '../services/searchService'
import { KeywordRank } from '@/interfaces/SearchInterface'

export const usePopular = () => {
  return useQuery<KeywordRank[]>({
    queryKey: ['popularKeywords'],
    queryFn: fetchPopularKeywords,
    // 페이지 진입마다 최신 데이터 가져오기
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}
