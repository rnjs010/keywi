import { useQuery } from '@tanstack/react-query'
import {
  getChatHistory,
  getChatHistoryMore,
} from '@/features/chat/sevices/chatService'
import type { ChatMessagesResponseData } from '@/interfaces/ChatInterfaces'

export const chatKeys = {
  all: ['chats'] as const,
  history: (roomId: string) => [...chatKeys.all, 'history', roomId] as const,
  historyMore: (roomId: string, beforeMessageId: string) =>
    [...chatKeys.history(roomId), beforeMessageId] as const,
}

// 채팅 내역 가져오기
export const useChatHistory = (roomId: string) => {
  return useQuery<ChatMessagesResponseData>({
    queryKey: chatKeys.history(roomId),
    queryFn: () => getChatHistory(roomId, 100),
    enabled: !!roomId, // roomId가 있을 때만 호출
    // staleTime: 1000 * 60, // 1분 동안 캐시 유지
    staleTime: 0,
    gcTime: 0, // ✅ 캐시 제거
    refetchOnMount: true, // ✅ 컴포넌트 진입 시마다 refetch
  })
}

// 채팅 내역 더 가져오기
export const useChatHistoryMore = (
  roomId: string,
  lastMessageId: string,
  size = 20,
) => {
  return useQuery({
    queryKey: chatKeys.historyMore(roomId, lastMessageId),
    queryFn: () => getChatHistoryMore({ roomId, lastMessageId, size }),
    enabled: !!roomId && !!lastMessageId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })
}
