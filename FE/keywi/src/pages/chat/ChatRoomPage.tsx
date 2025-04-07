import ChatRoomHeader from '@/features/chat/components/ChatRoomHeader'
import ChatRoomPostInfo from '@/features/chat/components/ChatRoomPostInfo'
import MyMessage from '@/features/chat/components/MessageBox/MyMessage'
import OpponentMessage from '@/features/chat/components/MessageBox/OpponentMessage'
import ChatRoomSendBox from '@/features/chat/components/ChatRoomSendBox'
import ImageInputScreen from '@/features/chat/components/ImageInputScreen'
import tw from 'twin.macro'
import { ArrowDown } from 'iconoir-react'
import { useChatImageStore } from '@/stores/chatStore'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  useChatPartner,
  useChatPost,
} from '@/features/chat/hooks/useChatRoomInfo'
import LoadingMessage from '@/components/message/LoadingMessage'
import ErrorMessage from '@/components/message/ErrorMessage'
import NoDataMessage from '@/components/message/NoDataMessage'
import { StompContext } from '@/stores/stompContext'
import { useUserStore } from '@/stores/userStore'
import { Client } from '@stomp/stompjs'
import { useChatSocket } from '@/features/chat/hooks/useChatSocket'
import { Message } from '@/interfaces/ChatInterfaces'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden
`

const ChatContainer = tw.div`
  flex-1 overflow-y-auto px-4
`

const DateBox = tw.div`
  flex justify-center py-4
`

const DownBtnBox = tw.button`
  fixed left-[84vw] z-10 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center
`

export default function ChatRoomPage() {
  // const myId = 'user789'

  const containerRef = useRef<HTMLDivElement>(null)
  const downBtnRef = useRef<HTMLButtonElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const showImage = useChatImageStore((state) => state.showImage)

  const { roomId } = useParams<{ roomId: string }>()
  const {
    data: partner,
    isLoading: loadingPartner,
    isError: errorPartner,
  } = useChatPartner(roomId!)
  const {
    data: post,
    isLoading: loadingPost,
    isError: errorPost,
  } = useChatPost(roomId!)

  const [client, setClient] = useState<Client | null>(null)
  const myId = useUserStore((state) => state.userId)
  const [messages, setMessages] = useState<Message[]>([])

  const onMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg])
    console.log('메시지 수신', msg)
  }, [])

  // 클라이언트 생성 후 저장
  useChatSocket(roomId!, onMessage, setClient)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  const startToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'auto',
      })
    }
  }

  useEffect(() => {
    const handleVisualViewPortResize = () => {
      const currentVisualViewport = Number(window.visualViewport?.height)
      if (containerRef.current) {
        containerRef.current.style.height = `${currentVisualViewport}px`
        window.scrollTo(0, 20)
      }

      if (downBtnRef.current) {
        downBtnRef.current.style.top = `${currentVisualViewport - 130}px`
      }
    }

    // 초기 설정
    handleVisualViewPortResize()
    startToBottom()

    // 이벤트 리스너 등록
    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        'resize',
        handleVisualViewPortResize,
      )
    }

    // 클린업 함수
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          'resize',
          handleVisualViewPortResize,
        )
      }
    }
  }, [[showImage]])

  if (!roomId)
    return (
      <Container>
        <ErrorMessage text="채팅방 ID가 없습니다." />
      </Container>
    )
  if (loadingPartner || loadingPost)
    return (
      <Container>
        <LoadingMessage />
      </Container>
    )
  if (errorPartner || errorPost)
    return (
      <Container>
        <ErrorMessage text="정보를 불러오지 못했습니다." />
      </Container>
    )
  if (!partner || !post)
    return (
      <Container>
        <NoDataMessage text="채팅 기록이 없습니다." />
      </Container>
    )

  return (
    <StompContext.Provider value={client}>
      {!showImage && (
        <Container ref={containerRef}>
          <div className="sticky top-0">
            <ChatRoomHeader {...partner} />
            <ChatRoomPostInfo {...post} />
          </div>

          {/* Down Button */}
          <DownBtnBox ref={downBtnRef} onClick={scrollToBottom}>
            <ArrowDown />
          </DownBtnBox>

          {/* Date + Chat */}
          <ChatContainer ref={chatContainerRef}>
            {messageGroup.map((group) => (
              <>
                {/* Date */}
                <DateBox key={group.dateGroup}>
                  <span className="text-sm text-[#a4a8ae]">
                    {group.dateGroup}
                  </span>
                </DateBox>

                {/* Chat */}
                {group.messages.map((message) =>
                  message.senderId === String(myId) ? (
                    <MyMessage key={message.messageId} {...message} />
                  ) : (
                    <OpponentMessage key={message.messageId} {...message} />
                  ),
                )}
              </>
            ))}

            {messages.map((m) => (
              <p key={m.messageId}>{m.content}</p>
            ))}
          </ChatContainer>

          {/* Input */}
          <ChatRoomSendBox />
        </Container>
      )}

      {showImage && <ImageInputScreen />}
    </StompContext.Provider>
  )
}

// NOTE - 더미데이터
const messageGroup = [
  {
    dateGroup: '2025년 3월 18일',
    messages: [
      {
        messageId: 'msg123',
        senderId: 'user456',
        senderType: 'ASSEMBLER',
        senderNickname: '컴퓨터달인',
        senderProfileUrl: 'https://picsum.photos/200',
        content: '안녕하세요, 조립 시작하겠습니다.',
        messageType: 'TEXT',
        timestamp: '2025-03-18T11:45:30',
        formattedTime: '오전 11:45',
        read: true,
      },
      {
        messageId: 'msg124',
        senderId: 'user789',
        senderType: 'REQUESTER',
        senderNickname: '키린이',
        senderProfileUrl: 'https://picsum.photos/200',
        content: '네, 감사합니다. 잘 부탁드립니다.',
        messageType: 'TEXT',
        timestamp: '2025-03-18T11:46:15',
        formattedTime: '오전 11:46',
        read: true,
      },
      {
        messageId: 'msg125',
        senderId: 'user456',
        senderType: 'ASSEMBLER',
        senderNickname: '컴퓨터달인',
        senderProfileUrl: 'https://picsum.photos/200',
        content: '523,000',
        messageType: 'DEALREQUEST',
        timestamp: '2025-03-18T11:45:30',
        formattedTime: '오전 11:45',
        read: true,
      },
    ],
  },
  {
    dateGroup: '2025년 3월 17일',
    messages: [
      {
        messageId: 'msg120',
        senderId: 'user789',
        senderType: 'REQUESTER',
        senderNickname: '키린이',
        senderProfileUrl: 'https://picsum.photos/200',
        content: '견적 확인 부탁드립니다.',
        messageType: 'TEXT',
        timestamp: '2025-03-17T15:22:10',
        formattedTime: '오후 3:22',
        read: true,
      },
      {
        messageId: 'msg126',
        senderId: 'user789',
        senderType: 'REQUESTER',
        senderNickname: '키린이',
        senderProfileUrl: 'https://picsum.photos/200',
        content: '523,000',
        messageType: 'DEALREQUEST',
        timestamp: '2025-03-18T11:45:30',
        formattedTime: '오전 11:45',
        read: true,
      },
      {
        messageId: 'msg127',
        senderId: 'user789',
        senderType: 'REQUESTER',
        senderNickname: '키린이',
        senderProfileUrl: 'https://picsum.photos/200',
        content: '',
        messageType: 'DEALPROGRESS',
        timestamp: '2025-03-18T11:45:30',
        formattedTime: '오전 11:45',
        read: true,
      },
      {
        messageId: 'msg128',
        senderId: 'user456',
        senderType: 'ASSEMBLER',
        senderNickname: '컴퓨터달인',
        senderProfileUrl: 'https://picsum.photos/200',
        content: '',
        messageType: 'DEALPROGRESS',
        timestamp: '2025-03-18T11:45:30',
        formattedTime: '오전 11:45',
        read: true,
      },
      {
        messageId: 'msg129',
        senderId: 'user789',
        senderType: 'REQUESTER',
        senderNickname: '키린이',
        senderProfileUrl: 'https://picsum.photos/200',
        content: '',
        messageType: 'DEALCOMPLETE',
        timestamp: '2025-03-18T11:45:30',
        formattedTime: '오전 11:45',
        read: true,
      },
      {
        messageId: 'msg180',
        senderId: 'user456',
        senderType: 'ASSEMBLER',
        senderNickname: '컴퓨터달인',
        senderProfileUrl: 'https://picsum.photos/200',
        content: '523,000',
        messageType: 'DEALCOMPLETE',
        timestamp: '2025-03-18T11:45:30',
        formattedTime: '오전 11:45',
        read: true,
      },
      {
        messageId: 'msg121',
        senderId: 'user456',
        senderType: 'ASSEMBLER',
        senderNickname: '컴퓨터달인',
        senderProfileUrl: 'https://picsum.photos/200',
        content: 'https://picsum.photos/200',
        messageType: 'IMAGE',
        timestamp: '2025-03-17T15:30:45',
        formattedTime: '오후 3:30',
        read: true,
      },
    ],
  },
]
