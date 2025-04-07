import SubHeader from '@/components/SubHeader'
import ChatCard from '@/features/chat/components/ChatCard'
import NavBar from '@/components/NavBar'
import tw from 'twin.macro'
import { useChatList } from '@/features/chat/hooks/useChatList'
import ErrorMessage from '@/components/message/ErrorMessage'
import LoadingMessage from '@/components/message/LoadingMessage'
import NoDataMessage from '@/components/message/NoDataMessage'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden
`

const ScrollArea = tw.div`
  flex-1 overflow-y-auto px-4
`

export default function ChatListPage() {
  const location = useLocation()
  const { data: chatRooms, isLoading, isError, refetch } = useChatList()

  // 페이지가 마운트될 때마다 refetch
  useEffect(() => {
    refetch()
  }, [location])

  return (
    <Container>
      <SubHeader title="채팅" />
      {/* SECTION - 채팅 리스트 영역 */}
      <ScrollArea>
        {isLoading && <LoadingMessage />}

        {isError && <ErrorMessage />}

        {!isLoading && !isError && (!chatRooms || chatRooms.length === 0) && (
          <NoDataMessage text="채팅 기록이 없습니다." />
        )}

        {chatRooms &&
          chatRooms.map((item) => <ChatCard key={item.roomId} {...item} />)}
      </ScrollArea>
      <NavBar />
    </Container>
  )
}
