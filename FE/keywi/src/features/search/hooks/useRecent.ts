import apiRequester from '@/services/api'
import { useEffect, useState } from 'react'

// 최근 검색어 관련 훅
export const useRecent = () => {
  const [recentKeywords, setRecentKeywords] = useState<string[]>([])

  // 임시로 유저아이디 1로 둠
  const USER_ID = 1

  const fetchRecentKeywords = async () => {
    try {
      const res = await apiRequester.get<string[]>('/api/search/keywords', {
        params: { userId: USER_ID },
      })
      setRecentKeywords(res.data)
    } catch (err) {
      console.error('api error - 최신 검색:', err)
    }
  }

  const deleteAllRecentKeywords = async () => {
    try {
      await apiRequester.delete('/api/search/keywords', {
        params: { userId: USER_ID },
      })
      setRecentKeywords([])
    } catch (err) {
      console.error('api error - 최신 검색 삭제:', err)
    }
  }

  useEffect(() => {
    fetchRecentKeywords()
  }, [])

  return { recentKeywords, deleteAllRecentKeywords }
}
