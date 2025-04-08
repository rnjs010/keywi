// providers/WebSocketProvider.tsx
import React, { createContext, useRef, useEffect, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

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
  const [isConnected, setIsConnected] = useState(false)
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    const socket = new SockJS('https://j12e202.p.ssafy.io/chat/ws-endpoint')
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('[STOMP]', str),
      reconnectDelay: 5000,
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

    return () => {
      client.deactivate()
    }
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
