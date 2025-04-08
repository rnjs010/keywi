import {
  ChatMessagesResponseData,
  ChatPartner,
  ChatPost,
  ChatRoom,
} from '@/interfaces/ChatInterfaces'
import apiRequester from '@/services/api'

// 채팅 방 생성
export const createChatRoom = async (boardId: number) => {
  const response = await apiRequester.post(`/api/chat/rooms?boardId=${boardId}`)
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

// 채팅 내역 가져오기
export const getChatHistory = async (
  roomId: string,
  size: number = 100,
): Promise<ChatMessagesResponseData> => {
  const response = await apiRequester.get(
    `/api/chat/rooms/${roomId}/messages`,
    {
      params: { size },
    },
  )
  console.log('채팅내역', response)
  return response.data.data
}

// 채팅 내역 더 가져오기
export const getChatHistoryMore = async ({
  roomId,
  lastMessageId,
  size = 20,
}: {
  roomId: string
  lastMessageId: string
  size?: number
}): Promise<ChatMessagesResponseData> => {
  const response = await apiRequester.get(
    `/api/chat/rooms/${roomId}/messages/history`,
    {
      params: {
        lastMessageId,
        size,
      },
    },
  )
  console.log('채팅내역 더', response)
  return response.data.data
}
