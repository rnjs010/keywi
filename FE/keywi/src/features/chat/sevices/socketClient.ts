import { BASE_URL } from '@/config'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { getCookie } from '@/hooks/useCookieAuth'

const TOKEN_NAME = 'accessToken'

export const createStompClient = () => {
  const token = getCookie(TOKEN_NAME)

  const client = new Client({
    brokerURL: undefined, // SockJS 사용하는 경우 undefined
    webSocketFactory: () => new SockJS(`${BASE_URL}/ws`), // 서버 웹소켓 엔드포인트
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (str) => {
      console.log('[STOMP]', str)
    },
    reconnectDelay: 5000,
  })

  return client
}
