import { ChatRoom } from '@/interfaces/ChatInterfaces'
import apiRequester from '@/services/api'

// 채팅 방 생성
export const createChatRoom = async (boardId: number) => {
  const response = await apiRequester.post('/api/chat/rooms', { boardId })
  return response.data.data.roomId
}

// 채팅방 목록 조회
export interface ChatListResponse {
  success: boolean
  message: string
  data: ChatRoom[]
}

export const getChatRoomList = async (): Promise<ChatRoom[]> => {
  const response = await apiRequester.get<ChatListResponse>('/api/chat/rooms')
  return response.data.data
}
