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
  return response.data.data
}

// 게시글 생성 함수
export interface CreateBoardRequest {
  title: string
  content: string
  images: string[]
  items: { categoryId: number; productId: number }[]
}

export const createBoardPost = async (data: CreateBoardRequest) => {
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
    `/api/product/favorites?categoryId=${categoryId}`,
  )

  return response.data.data.map((item) => ({
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    productId: item.productId,
    productName: item.productName,
    price: item.price,
    imageUrl: item.productImage,
  }))
}
