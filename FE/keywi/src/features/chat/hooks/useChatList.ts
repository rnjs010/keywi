import { useQuery } from '@tanstack/react-query'
import { getChatRoomList } from '@/features/chat/sevices/chatService'
import { ChatRoom } from '@/interfaces/ChatInterfaces'

export const chatKeys = {
  all: ['chats'] as const,
  list: () => [...chatKeys.all, 'list'] as const,
}

export const useChatList = () => {
  return useQuery<ChatRoom[]>({
    queryKey: chatKeys.list(),
    queryFn: getChatRoomList,
    staleTime: 1000 * 60 * 5,
  })
}
