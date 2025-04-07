import { useState, useEffect } from 'react'
import apiRequester from '@/services/apijson'

export const useFavorite = (productId: number, initialIsFavorite: boolean) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsFavorite(initialIsFavorite)
  }, [initialIsFavorite])

  const fetchFavoriteStatus = async () => {
    try {
      const response = await apiRequester.get<{ data: boolean }>(
        `/api/product/favorites/${productId}`,
      )
      setIsFavorite(response.data.data)
    } catch (error) {
      console.error('찜 상태 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async () => {
    setLoading(true)
    try {
      const response = await apiRequester.post<{ data: boolean }>(
        '/api/product/favorites',
        { productId },
      )
      setIsFavorite(response.data.data)
    } catch (error) {
      console.error('찜 토글 실패:', error)
      fetchFavoriteStatus() // 실패 시 원상태 복구
    } finally {
      setLoading(false)
    }
  }

  // useEffect(() => {
  //   fetchFavoriteStatus()
  // }, [productId])

  return { isFavorite, loading, toggleFavorite }
}
