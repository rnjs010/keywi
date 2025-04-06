import apiRequester from '@/services/api'
import {
  BoardCardData,
  BoardDetailData,
  BoardItemUsingInfo,
} from '@/interfaces/BoardInterface'
import { AxiosResponse } from 'axios'

// 게시글 목록 조회 함수
export interface BoardListResponse {
  status: string
  message: string
  data: BoardCardData[]
}

export const getBoardList = async (): Promise<BoardCardData[]> => {
  const response: AxiosResponse<BoardListResponse> = await apiRequester.get(
    '/api/estimate-boards',
  )
  return response.data.data
}

// 게시글 상세 조회 함수
export interface BoardDetailResponse {
  status: string
  message: string
  data: BoardDetailData
}

export const getBoardDetail = async (
  boardId: number,
): Promise<BoardDetailData> => {
  const response = await apiRequester.get<BoardDetailResponse>(
    `/api/estimate-boards/${boardId}`,
  )
  console.log('게시글 상세 조회', response.data.data)
  return response.data.data
}

// 게시글 생성 함수
export const createBoardPost = async (data: FormData) => {
  const response = await apiRequester.post('/api/estimate-boards', data)
  return response.data
}

// 카테고리별 찜한 상품 조회 함수
interface FavoriteProductResponse {
  status: string
  message: string
  data: {
    productId: number
    categoryId: number
    categoryName: string
    productName: string
    price: number
    productUrl: string
    productImage: string
    manufacturer: string
    descriptions: string | null
  }[]
}

export const getFavoriteProducts = async (
  categoryId: number,
): Promise<BoardItemUsingInfo[]> => {
  const response = await apiRequester.get<FavoriteProductResponse>(
    `/api/product/favorites/list?categoryId=${categoryId}`,
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

export const searchProducts = async (
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
