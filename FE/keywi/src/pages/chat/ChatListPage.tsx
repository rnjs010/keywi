import SubHeader from '@/components/SubHeader'
import ChatCard from '@/features/chat/components/ChatCard'
import NavBar from '@/components/NavBar'
import tw from 'twin.macro'
import { useChatList } from '@/features/chat/hooks/useChatList'
import ErrorMessage from '@/components/message/ErrorMessage'
import LoadingMessage from '@/components/message/LoadingMessage'
import NoDataMessage from '@/components/message/NoDataMessage'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden
`

const ScrollArea = tw.div`
  flex-1 overflow-y-auto px-4
`

export default function ChatListPage() {
  const { data: chatRooms, isLoading, isError } = useChatList()

  return (
    <Container>
      <SubHeader title="채팅" />
      {/* SECTION - 채팅 리스트 영역 */}
      <ScrollArea>
        {isLoading ? (
          <LoadingMessage />
        ) : isError ? (
          <ErrorMessage />
        ) : !chatRooms ? (
          <NoDataMessage text="데이터가 없습니다." />
        ) : (
          <>
            {chatRooms.map((item) => (
              <ChatCard key={item.roomId} {...item} />
            ))}
          </>
        )}
      </ScrollArea>
      <NavBar />
    </Container>
  )
}
