import { IMessage } from '@stomp/stompjs'
import { useEffect, useRef } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { createStompClient } from '@/features/chat/sevices/socketClient'

export const useChatSocket = (
  roomId: string,
  onMessage: (msg: any) => void,
) => {
  const clientRef = useRef<ReturnType<typeof createStompClient> | null>(null)
  const setConnected = useChatStore((state) => state.setConnected)

  useEffect(() => {
    const client = createStompClient()

    client.onConnect = () => {
      console.log('STOMP Connected')
      setConnected(true)

      // 채팅방 메시지 구독
      client.subscribe(`/topic/chat/room/${roomId}`, (message: IMessage) => {
        const body = JSON.parse(message.body)
        onMessage(body)
      })

      // 개인별 메시지 수신 구독
      client.subscribe('/user/queue/messages', (message: IMessage) => {
        const body = JSON.parse(message.body)
        console.log('[개인 메시지]', body)
      })

      // 입장 알림
      client.publish({
        destination: '/app/chat.enter',
        body: JSON.stringify({ roomId }),
      })
    }

    client.onDisconnect = () => {
      setConnected(false)
    }

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [roomId, onMessage])
}
