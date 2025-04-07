import { FavoriteProduct, FeedSearchProduct } from '@/interfaces/HomeInterfaces'
import apiRequester from '@/services/api'

const DEFAULT_IMAGE = '/default/default_product.png'

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

export const getSearchProducts = async (
  query: string,
): Promise<FeedSearchProduct[]> => {
  try {
    const response = await apiRequester.get<FeedSearchProduct[]>(
      '/api/search/feed/products/search',
      {
        params: {
          query,
        },
      },
    )

    const productData = response.data
    console.log('Search products:', productData)

    // 응답 데이터를 매핑하면서 null인 imageUrl을 기본 이미지로 대체
    return productData.map((product: FeedSearchProduct) => ({
      ...product,
      imageUrl: product.imageUrl || DEFAULT_IMAGE,
    }))
  } catch (error) {
    console.error('Search products error:', error)
    return []
  }
}
