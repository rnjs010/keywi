import React, { createContext, useRef, useEffect, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { getCookie } from '@/hooks/useCookieAuth'

const TOKEN_NAME = 'accessToken'

type WebSocketContextType = {
  client: Client | null
  isConnected: boolean
}

export const WebSocketContext = createContext<WebSocketContextType>({
  client: null,
  isConnected: false,
})

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const token = getCookie(TOKEN_NAME)
  const [isConnected, setIsConnected] = useState(false)
  const clientRef = useRef<Client | null>(null)

  // WebSocket 연결 함수
  const connectWebSocket = () => {
    const socket = new SockJS('https://j12e202.p.ssafy.io/chat/ws-endpoint')
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      debug: (str) => console.log('[STOMP]', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        console.log('[STOMP] connected')
        setIsConnected(true)
      },
      onDisconnect: () => {
        console.log('[STOMP] disconnected')
        setIsConnected(false)
      },
      onStompError: (frame) => {
        console.error('[STOMP ERROR]', frame)
      },
      onWebSocketError: (err) => {
        console.error('[WEBSOCKET ERROR]', err)
      },
    })

    client.activate()
    clientRef.current = client
  }

  useEffect(() => {
    connectWebSocket()

    // 포그라운드 복귀 시 웹소켓 재연결
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        (!clientRef.current || !clientRef.current.connected)
      ) {
        console.log('[STOMP] Reconnecting on foreground...')
        connectWebSocket()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clientRef.current?.deactivate()
    }
    // NOTE: token이 바뀌었을 때 재연결하고 싶다면 [token]을 의존성에 추가할 수도 있음
  }, [])

  return (
    <WebSocketContext.Provider
      value={{
        client: clientRef.current,
        isConnected,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}
