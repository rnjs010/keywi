import { FavoriteProduct, FeedSearchProduct } from '@/interfaces/HomeInterfaces'
import apiRequester from '@/services/api'

const DEFAULT_IMAGE = '/default/default_product.png'

// 상품 찜 목록 조회
interface FavoriteProductsResponse {
  status: string
  message: string
  data: FavoriteProduct[]
}

export const getZzimProducts = async (): Promise<FavoriteProduct[]> => {
  const response = await apiRequester.get<FavoriteProductsResponse>(
    '/api/product/favorites/list',
  )
  console.log('상품 찜 목록 조회 성공:', response)
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

// 상품 찜 등록/해제
export const toggleProductFavorite = async (productId: number) => {
  try {
    const response = await apiRequester.post('/api/product/favorites', {
      productId,
    })
    return response.data
  } catch (error) {
    console.error('상품 찜 토글 실패:', error)
    throw error
  }
}
