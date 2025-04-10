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
  chatInfoKeys,
  useChatPartner,
  useChatPost,
} from '@/features/chat/hooks/useChatRoomInfo'
import LoadingMessage from '@/components/message/LoadingMessage'
import ErrorMessage from '@/components/message/ErrorMessage'
import NoDataMessage from '@/components/message/NoDataMessage'
import { useUserStore } from '@/stores/userStore'
import {
  ChatMessage,
  ChatMessagesResponseData,
} from '@/interfaces/ChatInterfaces'
import { chatKeys, useChatHistory } from '@/features/chat/hooks/useChatHistory'
import { useChatSubscription } from '@/features/chat/hooks/useChatSub'
import { useQueryClient } from '@tanstack/react-query'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const downBtnRef = useRef<HTMLButtonElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const showImage = useChatImageStore((state) => state.showImage)
  const [showDownBtn, setShowDownBtn] = useState(false)
  const { roomId } = useParams<{ roomId: string }>()
  const myId = useUserStore((state) => state.userId)
  const queryClient = useQueryClient()

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

  const invalidateChat = () => {
    queryClient.invalidateQueries({ queryKey: chatInfoKeys.partner(roomId!) })
    queryClient.invalidateQueries({ queryKey: chatInfoKeys.post(roomId!) })
  }

  // 채팅방 입장 시 계좌 정보 무효화
  const invalidateAccount = () => {
    queryClient.invalidateQueries({ queryKey: ['paymentAccount'] })
  }

  useEffect(() => {
    invalidateAccount()
  }, [])

  // 채팅 내역 가져오기
  const location = useLocation()
  const { data: chatHistory, refetch } = useChatHistory(roomId!)
  const messageGroups = chatHistory?.messageGroups || []

  useEffect(() => {
    refetch()
  }, [location, refetch])

  const onMessage = useCallback(
    (msg: ChatMessage) => {
      const sentDate = new Date(msg.sentAt)
      const formattedDate = `${sentDate.getFullYear()}년 ${sentDate.getMonth() + 1}월 ${sentDate.getDate()}일`

      queryClient.setQueryData(
        chatKeys.history(roomId!),
        (oldData: ChatMessagesResponseData | undefined) => {
          if (!oldData) return { messageGroups: [] }

          const updatedGroups = [...oldData.messageGroups]
          const existingGroupIndex = updatedGroups.findIndex(
            (group) => group.dateGroup === formattedDate,
          )

          // 기존 날짜 그룹이 있는 경우
          if (existingGroupIndex !== -1) {
            updatedGroups[existingGroupIndex] = {
              ...updatedGroups[existingGroupIndex],
              messages: [...updatedGroups[existingGroupIndex].messages, msg],
            }
          } else {
            // 새로운 날짜 그룹 생성
            updatedGroups.push({
              dateGroup: formattedDate,
              messages: [msg],
            })
          }

          return { ...oldData, messageGroups: updatedGroups }
        },
      )

      console.log('메시지 수신', msg)
      invalidateChat()
      // 새 메시지가 오면 자동 스크롤 다운
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    },
    [queryClient, roomId, invalidateChat],
  )

  useChatSubscription({
    roomId: roomId!,
    onMessage,
  })

  // 스크롤
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

  // Down button 표시 여부
  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isBottom = scrollHeight - scrollTop <= clientHeight + 10 // 하단 여유 범위 10px
      setShowDownBtn(!isBottom)
    }

    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 상태별 화면
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
    <>
      {!showImage && (
        <Container ref={containerRef}>
          <div className="sticky top-0">
            <ChatRoomHeader {...partner} />
            <ChatRoomPostInfo {...post} />
          </div>

          {/* Down Button */}
          {showDownBtn && (
            <DownBtnBox ref={downBtnRef} onClick={scrollToBottom}>
              <ArrowDown />
            </DownBtnBox>
          )}

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
          <ChatRoomSendBox dealDisabled={Number(post.buyerId) === myId} />
        </Container>
      )}

      {showImage && <ImageInputScreen />}
    </>
  )
}
