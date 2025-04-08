import { useQuery } from '@tanstack/react-query'
import {
  getChatPartner,
  getChatPost,
} from '@/features/chat/sevices/chatService'

export const chatKeys = {
  all: ['chat'] as const,
  partner: (roomId: string) => [...chatKeys.all, 'partner', roomId] as const,
  post: (roomId: string) => [...chatKeys.all, 'post', roomId] as const,
}

// 상대방 정보
export const useChatPartner = (roomId: string) => {
  return useQuery({
    queryKey: chatKeys.partner(roomId),
    queryFn: () => getChatPartner(roomId),
    enabled: !!roomId,
  })
}

// 게시글 정보
export const useChatPost = (roomId: string) => {
  return useQuery({
    queryKey: chatKeys.post(roomId),
    queryFn: () => getChatPost(roomId),
    enabled: !!roomId,
  })
}
