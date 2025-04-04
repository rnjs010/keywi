import { FavoriteProduct, FeedSearchProduct } from '@/interfaces/HomeInterfaces'
import apiRequester from '@/services/api'

// 상품 찜 목록 조회

interface FavoriteProductsResponse {
  status: string
  message: string
  data: FavoriteProduct[]
}

export const getFavoriteProducts = async (): Promise<FavoriteProduct[]> => {
  const response = await apiRequester.get<FavoriteProductsResponse>(
    '/api/product/favorites/list',
  )
  return response.data.data
}

// 피드 태그용 상품 검색 조회

interface FeedSearchProductResponse {
  status: string
  message: string
  data: FeedSearchProduct[]
}

export const getSearchProducts = async (
  query: string,
): Promise<FeedSearchProduct[]> => {
  const response = await apiRequester.get<FeedSearchProductResponse>(
    '/api/feed/products/search',
    {
      params: {
        query,
      },
    },
  )
  return response.data.data
}
