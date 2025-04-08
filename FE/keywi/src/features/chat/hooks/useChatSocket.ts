// features/chat/hooks/useChatSocket.ts
import { Client, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useEffect, useRef } from 'react'
import { useChatConnectStore } from '@/stores/chatStore'

export const useChatSocket = (
  roomId: string,
  onMessage: (msg: any) => void,
  setClient?: (client: Client) => void,
) => {
  const clientRef = useRef<Client | null>(null)
  const setConnected = useChatConnectStore((state) => state.setConnected)

  useEffect(() => {
    const socket = new SockJS('https://j12e202.p.ssafy.io/chat/ws-endpoint')
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        // 인증 필요 시 Authorization 헤더 추가
      },
      debug: (str) => console.log('[STOMP]', str),
      onConnect: () => {
        setConnected(true)

        // 채팅방 메시지 구독
        client.subscribe(`/topic/chat/${roomId}`, (message: IMessage) => {
          const body = JSON.parse(message.body)
          console.log('채팅방 메시지 수신', body)
          onMessage(body)
        })

        // 개인 메시지 구독
        client.subscribe('/user/queue/message', (message: IMessage) => {
          const body = JSON.parse(message.body)
          console.log('개인 메시지 수신', body)
        })

        // 입장 알림
        client.publish({
          destination: '/app/chat.enter',
          body: JSON.stringify({ roomId }),
        })
      },
      onStompError: (frame) => {
        console.error('[STOMP ERROR]', frame)
      },
      onWebSocketError: (err) => {
        console.error('[WEBSOCKET ERROR]', err)
      },
      onDisconnect: () => {
        setConnected(false)
      },
      reconnectDelay: 5000,
    })

    client.activate()
    clientRef.current = client
    setClient?.(client)

    return () => {
      client.deactivate()
    }
  }, [roomId, onMessage])
}
