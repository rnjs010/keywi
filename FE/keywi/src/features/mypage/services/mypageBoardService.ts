import { BoardCardData } from '@/interfaces/BoardInterface'
import apiRequester from '@/services/api'
import { AxiosResponse } from 'axios'

// 게시글 목록 조회 함수
export interface BoardListResponse {
  status: string
  message: string
  data: BoardCardData[]
}

export const getMyBoardList = async (): Promise<BoardCardData[]> => {
  const response: AxiosResponse<BoardListResponse> = await apiRequester.get(
    '/api/estimate-boards/me',
  )
  console.log('내 게시물 조회', response.data.data)
  return response.data.data
}

export const changeBoardStatus = async (boardId: number, dealState: string) => {
  const response = await apiRequester.patch(
    `/api/estimate-boards/${boardId}/state?dealState=${dealState}`,
  )
  return response.data.data
}

// 별점 주기
export const ratingBoard = async (
  boardId: number,
  targetUserId: number,
  rating: number,
) => {
  const response = await apiRequester.post('/api/ratings', {
    boardId,
    targetUserId,
    rating,
  })
  return response.data
}
