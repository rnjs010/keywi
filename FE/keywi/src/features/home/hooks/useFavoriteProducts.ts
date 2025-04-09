import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getZzimProducts,
  toggleProductFavorite,
} from '@/features/home/services/feedProductService'
import { FavoriteProduct } from '@/interfaces/HomeInterfaces'
import { useState } from 'react'

export const FAVORITE_PRODUCTS_QUERY_KEY = ['favoriteProducts']

export function useZzimProducts() {
  const queryClient = useQueryClient()
  const [isToggling, setIsToggling] = useState<Record<number, boolean>>({})

  const {
    data: favoriteProducts = [],
    isLoading,
    error,
    refetch,
  } = useQuery<FavoriteProduct[]>({
    queryKey: FAVORITE_PRODUCTS_QUERY_KEY,
    queryFn: getZzimProducts,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })

  const toggleFavorite = async (productId: number) => {
    // 이미 처리 중인 상품은 중복 요청 방지
    if (isToggling[productId]) return

    setIsToggling((prev) => ({ ...prev, [productId]: true }))

    try {
      await toggleProductFavorite(productId)

      // 상품 찜 목록에서 제거
      queryClient.setQueryData(
        FAVORITE_PRODUCTS_QUERY_KEY,
        (oldData: FavoriteProduct[] | undefined) =>
          oldData
            ? oldData.filter((product) => product.productId !== productId)
            : [],
      )
    } catch (error) {
      console.error('찜 목록 토글 실패:', error)
    } finally {
      setIsToggling((prev) => ({ ...prev, [productId]: false }))
    }
  }

  return {
    favoriteProducts,
    isLoading,
    error,
    refetch,
    toggleFavorite,
    isToggling,
  }
}
