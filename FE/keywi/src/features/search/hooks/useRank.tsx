import { useState, useEffect } from 'react'
import apiRequester from '@/services/api'
import { KeywordRank } from '@/interfaces/SearchInterface'

// 인기 검색어 데이터를 가져오는 훅
export const useRank = () => {
  const [data, setData] = useState<KeywordRank[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPopularKeywords = async () => {
      try {
        setIsLoading(true)
        const response = await apiRequester.get('/api/search/rankings/latest')
        setData(response.data)
        setError(null)
      } catch (err) {
        console.error('api error:', err)
        setError(err instanceof Error ? err : new Error('인기 검색어'))
      } finally {
        setIsLoading(false)
      }
    }
    fetchPopularKeywords()
  }, [])

  return { data, isLoading, error }
}
