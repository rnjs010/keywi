import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
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
    queryFn: () => getChatHistory(roomId, 20),
    enabled: !!roomId, // roomId가 있을 때만 호출
    staleTime: 1000 * 60, // 1분 동안 캐시 유지
  })
}

// 채팅 내역 더 가져오기
// export const useChatHistoryMore = (
//   roomId: string,
//   beforeMessageId: string,
//   size = 20,
// ) => {
//   return useQuery({
//     queryKey: chatKeys.historyMore(roomId, beforeMessageId),
//     queryFn: () => getChatHistoryMore({ roomId, beforeMessageId, size }),
//     enabled: !!roomId && !!beforeMessageId,
//     staleTime: 1000 * 60,
//   })
// }

interface UseChatHistoryMoreOptions {
  enabled?: boolean
  onSuccess?: (data: ChatMessagesResponseData) => void
}

export const useChatHistoryMore = (
  roomId: string,
  initialMessageId: string,
  options?: UseChatHistoryMoreOptions,
) => {
  return useInfiniteQuery<
    ChatMessagesResponseData,
    Error,
    ChatMessagesResponseData,
    readonly unknown[],
    string
  >({
    queryKey: chatKeys.historyMore(roomId, initialMessageId),
    initialPageParam: initialMessageId,
    queryFn: ({ pageParam }) =>
      getChatHistoryMore({ roomId, beforeMessageId: pageParam }),
    getNextPageParam: (lastPage) => {
      const groups = lastPage.messageGroups
      if (!lastPage.pageInfo.hasMoreMessages || groups.length === 0) {
        return undefined
      }

      // Find the earliest message from all groups
      let earliestMessageId: string | undefined = undefined
      let earliestDate = new Date().getTime()

      groups.forEach((group) => {
        if (group.messages.length > 0) {
          const firstMessage = group.messages[0]
          const messageDate = new Date(firstMessage.sentAt).getTime()
          if (messageDate < earliestDate) {
            earliestDate = messageDate
            earliestMessageId = firstMessage.messageId
          }
        }
      })

      return earliestMessageId
    },
    enabled: !!roomId && !!initialMessageId && options?.enabled !== false,
    ...options,
  })
}
