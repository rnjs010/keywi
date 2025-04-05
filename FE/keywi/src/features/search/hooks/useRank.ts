import { useQuery } from '@tanstack/react-query'
import { fetchPopularKeywords, searchKeys } from '../services/searchService'
import { KeywordRank } from '@/interfaces/SearchInterface'

// 인기 검색어 데이터
export const useRank = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: searchKeys.rankings,
    queryFn: fetchPopularKeywords,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    data: data as KeywordRank[] | undefined,
    isLoading,
    isError,
    error,
    refetch,
  }
}
