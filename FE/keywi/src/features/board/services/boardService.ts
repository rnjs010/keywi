import apiRequester from '@/services/api'
import { BoardCardData, BoardDetailData } from '@/interfaces/BoardInterface'
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
