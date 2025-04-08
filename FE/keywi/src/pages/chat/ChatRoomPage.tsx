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
import { useLocation, useParams } from 'react-router-dom'
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
import { ChatMessage, MessageGroup } from '@/interfaces/ChatInterfaces'
import { useChatHistory } from '@/features/chat/hooks/useChatHistory'

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

  // 정보 get
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

  // 채팅 내역 가져오기
  const location = useLocation()
  const { data: chatHistory, refetch } = useChatHistory(roomId!)
  const [messageGroups, setMessageGroups] = useState<MessageGroup[]>([])

  useEffect(() => {
    refetch()
  }, [location])

  useEffect(() => {
    if (chatHistory?.messageGroups) {
      setMessageGroups(chatHistory.messageGroups)
    }
  }, [chatHistory])

  // 메시지 수신
  const [client, setClient] = useState<Client | null>(null)
  const myId = useUserStore((state) => state.userId)

  const onMessage = useCallback((msg: ChatMessage) => {
    const sentDate = new Date(msg.sentAt)
    const formattedDate = `${sentDate.getFullYear()}년 ${sentDate.getMonth() + 1}월 ${sentDate.getDate()}일`

    setMessageGroups((prevGroups) => {
      const existingGroupIndex = prevGroups.findIndex(
        (group) => group.dateGroup === formattedDate,
      )

      // 기존 날짜 그룹이 있는 경우
      if (existingGroupIndex !== -1) {
        const updatedGroups = [...prevGroups]
        updatedGroups[existingGroupIndex] = {
          ...updatedGroups[existingGroupIndex],
          messages: [...updatedGroups[existingGroupIndex].messages, msg],
        }
        return updatedGroups
      }

      // 새로운 날짜 그룹 생성
      return [
        ...prevGroups,
        {
          dateGroup: formattedDate,
          messages: [msg],
        },
      ]
    })

    console.log('메시지 수신', msg)
    // 새 메시지가 오면 자동 스크롤 다운
    setTimeout(() => {
      scrollToBottom()
    }, 100)
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
            {messageGroups.map((group) => (
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
          </ChatContainer>

          {/* Input */}
          <ChatRoomSendBox />
        </Container>
      )}

      {showImage && <ImageInputScreen />}
    </StompContext.Provider>
  )
}

function mergeMessageGroups(
  newGroups: MessageGroup[],
  prevGroups: MessageGroup[],
): MessageGroup[] {
  const merged = [...newGroups]

  if (prevGroups.length > 0 && newGroups.length > 0) {
    const lastNew = newGroups[newGroups.length - 1]
    const firstPrev = prevGroups[0]

    if (lastNew.dateGroup === firstPrev.dateGroup) {
      // 같은 날짜 그룹이면 메시지 합치기
      merged[merged.length - 1] = {
        dateGroup: lastNew.dateGroup,
        messages: [...lastNew.messages, ...firstPrev.messages],
      }

      // 기존 prevGroups에서 중복된 첫 그룹 제거
      return [...merged, ...prevGroups.slice(1)]
    }
  }

  return [...merged, ...prevGroups]
}
