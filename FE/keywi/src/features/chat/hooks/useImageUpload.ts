// src/features/chat/hooks/useChatImageUpload.ts
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { WebSocketContext } from '@/services/WebSocketProvider'
import { useUserStore } from '@/stores/userStore'
import { chatService } from '../sevices/chatService'

interface UploadImageParams {
  roomId: string
  file: File
}

export const useChatImageUpload = (roomId: string) => {
  const { client, isConnected } = useContext(WebSocketContext)
  const userId = useUserStore((state) => state.userId)

  // 이미지 업로드 뮤테이션
  const uploadImageMutation = useMutation({
    mutationFn: async ({ roomId, file }: UploadImageParams) => {
      return await chatService.uploadChatImage(roomId, file)
    },
    onSuccess: (response, variables) => {
      if (response.success && client?.connected && isConnected && userId) {
        client.publish({
          destination: '/app/chat/message',
          body: JSON.stringify({
            roomId: variables.roomId,
            messageType: 'IMAGE',
            content: response.data,
            imageUrl: response.data,
            senderId: userId,
          }),
          headers: {
            'X-User-ID': userId?.toString() || '',
          },
        })
      }
    },
  })

  const uploadAndSendImage = async (file: File) => {
    if (!file || !roomId || !userId || !isConnected || !client?.connected) {
      throw new Error('필요한 정보가 없습니다.')
    }

    return uploadImageMutation.mutateAsync({ roomId, file })
  }

  return {
    uploadAndSendImage,
    isLoading: uploadImageMutation.isPending,
    isError: uploadImageMutation.isError,
    error: uploadImageMutation.error,
    isSuccess: uploadImageMutation.isSuccess,
  }
}
