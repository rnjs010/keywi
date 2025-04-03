import { useState, useEffect } from 'react'
import apiRequester from '@/services/api'
import { KeywordRank } from '@/interfaces/SearchInterface'

// 인기 검색어 데이터를 가져오는 훅
export const useRank = () => {
  const [data, setData] = useState<KeywordRank[] | null>(null)
  // 로딩 오래 걸린다 싶으면 로딩창 만들때 사용하기
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchPopularKeywords = async () => {
    try {
      setIsLoading(true)
      const res = await apiRequester.get('/api/search/rankings/latest')
      setData(res.data)
    } catch (err) {
      console.error('api error - 인기검색:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPopularKeywords()
  }, [])

  return { data, isLoading }
}
