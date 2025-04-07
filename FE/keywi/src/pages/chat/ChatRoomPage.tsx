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
import {
  ChatMessage,
  ChatMessagesResponseData,
  MessageGroup,
} from '@/interfaces/ChatInterfaces'
import {
  useChatHistory,
  useChatHistoryMore,
} from '@/features/chat/hooks/useChatHistory'

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
  const prevScrollHeightRef = useRef<number>(0)
  const isInitialLoadRef = useRef<boolean>(true)

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
  const hasMoreMessages = chatHistory?.pageInfo?.hasMoreMessages ?? false
  const [messageGroups, setMessageGroups] = useState<MessageGroup[]>([])

  useEffect(() => {
    refetch()
  }, [location])

  useEffect(() => {
    if (chatHistory?.messageGroups) {
      setMessageGroups(chatHistory.messageGroups)

      setTimeout(() => {
        startToBottom()
        isInitialLoadRef.current = false
      }, 100)
    }
  }, [chatHistory])

  const [initialLastMessageId, setInitialLastMessageId] = useState<
    string | null
  >(null)

  useEffect(() => {
    if ((chatHistory?.messageGroups ?? []).length > 0) {
      const firstMessage = chatHistory?.messageGroups[0]?.messages[0]
      if (firstMessage?.messageId) {
        setInitialLastMessageId(firstMessage.messageId)
      }
    }
  }, [chatHistory])

  // 과거 채팅 무한스크롤
  const {
    data: moreHistoryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatHistoryMore(roomId!, initialLastMessageId ?? '', {
    enabled: !!roomId && !!initialLastMessageId && hasMoreMessages,
    onSuccess: () => {
      // 스크롤 위치 유지를 위해 현재 스크롤 높이 저장
      if (chatContainerRef.current) {
        prevScrollHeightRef.current = chatContainerRef.current.scrollHeight
      }
    },
  })

  // 무한스크롤: top에 도달하면 이전 메시지 불러오기
  const topSentinelRef = useRef<HTMLDivElement>(null) // 상단 감지용

  useEffect(() => {
    if (!topSentinelRef.current || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        // 상단에 도달하고 로딩 중이 아니면 이전 메시지 불러오기
        if (entries[0].isIntersecting && !isFetchingNextPage && hasNextPage) {
          console.log('Loading more messages...')
          fetchNextPage()
        }
      },
      {
        root: null, // viewport 기준으로 변경
        threshold: 0.1,
        rootMargin: '100px', // 일찍 감지하기 위해 margin 추가
      },
    )

    observer.observe(topSentinelRef.current)
    return () => observer.disconnect()
  }, [topSentinelRef.current, hasNextPage, isFetchingNextPage, fetchNextPage])

  // 이전 메시지 로드 후 스크롤 위치 조정
  useEffect(() => {
    if (
      isFetchingNextPage === false &&
      chatContainerRef.current &&
      prevScrollHeightRef.current > 0
    ) {
      // 이전 로드 후 스크롤 위치 유지
      const newScrollHeight = chatContainerRef.current.scrollHeight
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current

      if (scrollDiff > 0) {
        chatContainerRef.current.scrollTop = scrollDiff
      }

      prevScrollHeightRef.current = 0
    }
  }, [isFetchingNextPage])

  // 더 가져온 메시지 병합
  useEffect(() => {
    if (
      !moreHistoryData ||
      !moreHistoryData.messageGroups ||
      moreHistoryData.messageGroups.length === 0
    )
      return

    setMessageGroups((prev) => {
      const mergedGroups = new Map<string, ChatMessage[]>()

      // 기존 메시지 그룹을 Map에 저장
      prev.forEach((group) => {
        mergedGroups.set(group.dateGroup, [...group.messages])
      })

      // 새로 가져온 메시지를 Map에 병합
      moreHistoryData.messageGroups.forEach((group: MessageGroup) => {
        const existing = mergedGroups.get(group.dateGroup) || []

        // 중복 메시지 방지
        const uniqueMessages = group.messages.filter(
          (newMsg: ChatMessage) =>
            !existing.some(
              (existingMsg) => existingMsg.messageId === newMsg.messageId,
            ),
        )

        mergedGroups.set(
          group.dateGroup,
          [...uniqueMessages, ...existing].sort(
            (a, b) =>
              new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
          ),
        )
      })

      // Map을 MessageGroup[] 배열로 변환하고 날짜순으로 정렬
      return Array.from(mergedGroups.entries())
        .map(([dateGroup, messages]) => ({ dateGroup, messages }))
        .sort((a, b) => {
          const aDate = new Date(a.messages[0]?.sentAt || '')
          const bDate = new Date(b.messages[0]?.sentAt || '')
          return aDate.getTime() - bDate.getTime()
        })
    })
  }, [moreHistoryData])

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
            <div ref={topSentinelRef} />
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
