import SubHeader from '@/components/SubHeader'
import ChatCard from '@/features/chat/components/ChatCard'
import NavBar from '@/components/NavBar'
import tw from 'twin.macro'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden
`

const ScrollArea = tw.div`
  flex-1 overflow-y-auto px-4
`

export default function ChatPage() {
  return (
    <Container>
      <SubHeader title="채팅" />
      {/* SECTION - 채팅 리스트 영역 */}
      <ScrollArea>
        {dummyChatRooms.map((item) => (
          <ChatCard key={item.roomId} {...item} />
        ))}
      </ScrollArea>
      <NavBar />
    </Container>
  )
}

//NOTE - 채팅방 리스트 데이터 예시
// 채팅방 더미 데이터
export const dummyChatRooms = [
  {
    roomId: 'room123',
    assembler: {
      assemblerId: 'user456',
      nickname: '컴퓨터달인',
      profileImageUrl: 'https://picsum.photos/200',
    },
    lastMessage: '네, 내일 오후에 조립 완료해드리겠습니다.',
    lastMessageTime: '2025-03-18T14:30:45',
    formattedTime: '5분 전',
    unreadCount: 2,
    postTitle: '고성능 게이밍 PC 조립 요청',
  },
  {
    roomId: 'room124',
    assembler: {
      assemblerId: 'user789',
      nickname: '조립장인',
      profileImageUrl: 'https://picsum.photos/200',
    },
    lastMessage: '부품이 도착하면 연락주세요. 바로 조립 시작하겠습니다.',
    lastMessageTime: '2025-03-17T09:15:22',
    formattedTime: '1일 전',
    unreadCount: 0,
    postTitle: '사무용 PC 조립 요청',
  },
  {
    roomId: 'room125',
    assembler: {
      assemblerId: 'user101',
      nickname: 'PC마스터',
      profileImageUrl: 'https://picsum.photos/200',
    },
    lastMessage: '조립 완료했습니다. 확인해주세요.',
    lastMessageTime: '2025-03-10T18:22:30',
    formattedTime: '1주일 전',
    unreadCount: 0,
    postTitle: '방송용 워크스테이션 조립 요청',
  },
  {
    roomId: 'room126',
    assembler: {
      assemblerId: 'user202',
      nickname: '하드웨어전문가',
      profileImageUrl: 'https://picsum.photos/200',
    },
    lastMessage: 'CPU 쿨러 설치 중 문제가 있어 확인 부탁드립니다.',
    lastMessageTime: '2025-03-27T10:45:12',
    formattedTime: '어제',
    unreadCount: 3,
    postTitle: '저소음 미니 PC 조립 요청',
  },
  {
    roomId: 'room127',
    assembler: {
      assemblerId: 'user303',
      nickname: '그래픽장인',
      profileImageUrl: 'https://picsum.photos/200',
    },
    lastMessage: '그래픽카드 재고 확보했습니다. 조립 진행할까요?',
    lastMessageTime: '2025-03-28T09:30:00',
    formattedTime: '6시간 전',
    unreadCount: 1,
    postTitle: '그래픽 작업용 워크스테이션 조립',
  },
  {
    roomId: 'room128',
    assembler: {
      assemblerId: 'user404',
      nickname: '수냉달인',
      profileImageUrl: 'https://picsum.photos/200',
    },
    lastMessage:
      '수냉 쿨링 설치 완료했습니다. 테스트 결과 온도가 매우 안정적입니다.',
    lastMessageTime: '2025-03-25T16:20:33',
    formattedTime: '3일 전',
    unreadCount: 0,
    postTitle: '수냉 쿨링 게이밍 PC 조립 요청',
  },
]
