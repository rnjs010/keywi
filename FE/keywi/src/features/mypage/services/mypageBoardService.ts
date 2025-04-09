import { BoardCardData } from '@/interfaces/BoardInterface'
import apiRequester from '@/services/api'
import { AxiosResponse } from 'axios'

// 게시글 목록 조회 함수
export interface BoardListResponse {
  status: string
  message: string
  data: BoardCardData[]
}

export const getMyBoardList = async (
  writerId: number,
  page: number = 0,
  size: number = 10,
): Promise<BoardCardData[]> => {
  const response: AxiosResponse<BoardListResponse> = await apiRequester.get(
    `/api/estimate-boards/users/${writerId}?page=${page}&size=${size}`,
  )
  console.log(`사용자 ${writerId}의 게시물 조회`, response.data.data)
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

// 영수증 정보 조회 함수
export interface ReceiptItem {
  productId: number
  categoryId: number
  productName: string
  categoryName: string
  imageUrl: string
  price: number
}

export interface ReceiptData {
  receiptId: number
  roomId: number
  boardId: number
  messageId: string
  assemblerId: number
  buyerId: number
  totalAmount: number
  amount: number
  charge: number
  createdAt: string
  items: ReceiptItem[]
}

export interface ReceiptResponse {
  success: boolean
  message: string
  data: ReceiptData[]
}

export const getBoardReceipt = async (
  boardId: number,
): Promise<ReceiptData[]> => {
  const response: AxiosResponse<ReceiptResponse> = await apiRequester.get(
    `/api/chat/board/${boardId}`,
  )
  console.log(`게시글 ${boardId}의 영수증 정보:`, response.data.data)
  return response.data.data
}
