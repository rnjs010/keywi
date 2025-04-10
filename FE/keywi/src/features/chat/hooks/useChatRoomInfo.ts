import { useQuery } from '@tanstack/react-query'
import {
  getChatPartner,
  getChatPost,
} from '@/features/chat/sevices/chatService'

export const chatInfoKeys = {
  all: ['chat'] as const,
  partner: (roomId: string) =>
    [...chatInfoKeys.all, 'partner', roomId] as const,
  post: (roomId: string) => [...chatInfoKeys.all, 'post', roomId] as const,
}

// 상대방 정보
export const useChatPartner = (roomId: string) => {
  return useQuery({
    queryKey: chatInfoKeys.partner(roomId),
    queryFn: () => getChatPartner(roomId),
    enabled: !!roomId,
    staleTime: 0,
  })
}

// 게시글 정보
export const useChatPost = (roomId: string) => {
  return useQuery({
    queryKey: chatInfoKeys.post(roomId),
    queryFn: () => getChatPost(roomId),
    enabled: !!roomId,
    staleTime: 0,
  })
}
