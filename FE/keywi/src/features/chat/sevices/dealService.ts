import apiRequester from '@/services/api'
import { BoardItemUsingInfo } from '@/interfaces/BoardInterface'
import { CategoryAllProductResponse } from '@/interfaces/ChatInterfaces'

// 카테고리 별 전체 상품 조회 함수
export const getCategoryAllProducts = async (
  categoryId: number,
): Promise<BoardItemUsingInfo[]> => {
  const response = await apiRequester.get<CategoryAllProductResponse>(
    `/api/product/${categoryId}`,
  )

  return response.data.data.map((item) => ({
    categoryId: item.categoryId,
    categoryName: '',
    productId: item.productId,
    productName: item.productName,
    price: item.price,
    imageUrl: item.productImage,
  }))
}

// 카테고리별 검색 상품 조회 함수
interface ProductSearchResponse {
  productId: number
  productName: string
  categoryId: number
  categoryName: string
  price: number
  imageUrl: string | null
  createdAt: string
  searchCount: number | null
}

export const searchProductsDeal = async (
  categoryId: number,
  query: string,
): Promise<BoardItemUsingInfo[]> => {
  const response = await apiRequester.get<ProductSearchResponse[]>(
    '/api/search/board/products/search',
    {
      params: {
        categoryId,
        query,
      },
    },
  )

  return response.data.map((item) => ({
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    productId: item.productId,
    productName: item.productName,
    price: item.price,
    imageUrl: item.imageUrl ?? '',
  }))
}
