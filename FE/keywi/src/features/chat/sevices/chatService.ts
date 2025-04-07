import { ChatPartner, ChatPost, ChatRoom } from '@/interfaces/ChatInterfaces'
import apiRequester from '@/services/api'

// 채팅 방 생성
export const createChatRoom = async (boardId: number) => {
  const response = await apiRequester.post('/api/chat/rooms', { boardId })
  return response.data.data.roomId
}

// 채팅방 목록 조회
export const getChatRoomList = async (): Promise<ChatRoom[]> => {
  const response = await apiRequester.get('/api/chat/rooms')
  console.log('목록', response)
  return response.data.data
}

// 상대방 정보 가져오기
export const getChatPartner = async (roomId: string): Promise<ChatPartner> => {
  const response = await apiRequester.get(`/api/chat/rooms/${roomId}/partner`)
  console.log('상대방', response)
  return response.data.data
}

// 거래 게시글 정보 가져오기
export const getChatPost = async (roomId: string): Promise<ChatPost> => {
  const response = await apiRequester.get(`/api/chat/rooms/${roomId}/board`)
  console.log('게시글', response)
  return response.data.data
}
