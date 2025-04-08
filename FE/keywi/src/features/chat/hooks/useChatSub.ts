import { useContext, useEffect } from 'react'
import { WebSocketContext } from '@/services/WebSocketProvider'
import { useChatConnectStore } from '@/stores/chatStore'

export const useChatSubscription = ({
  roomId,
  onMessage,
}: {
  roomId: string
  onMessage?: (msg: any) => void
}) => {
  const { client, isConnected } = useContext(WebSocketContext)
  const subscribeToRoom = useChatConnectStore((state) => state.subscribeToRoom)

  useEffect(() => {
    if (!client || !isConnected || !roomId) return
    subscribeToRoom(roomId, client, onMessage || (() => {}))
  }, [client, isConnected, roomId, onMessage])
}
