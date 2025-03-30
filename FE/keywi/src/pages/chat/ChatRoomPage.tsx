import { Plus, Download, Send } from 'lucide-react'
import tw from 'twin.macro'
import ChatRoomHeader from '@/features/chat/components/ChatRoomHeader'
import ChatRoomPostInfo from '@/features/chat/components/ChatRoomPostInfo'
import MyMessage from '@/features/chat/components/MessageBox/MyMessage'
import OpponentMessage from '@/features/chat/components/MessageBox/OpponentMessage'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden
`

export default function ChatApp() {
  const myId = 'user789'

  return (
    <Container>
      <ChatRoomHeader {...chatParticipant} />
      <ChatRoomPostInfo {...post} />

      {/* Date(messageGroup 만큼 반복) + Chat */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {messageGroup.map((group) => (
          <>
            {/* Date */}
            <div key={group.dateGroup} className="flex justify-center py-4">
              <span className="text-sm text-[#a4a8ae]">{group.dateGroup}</span>
            </div>

            {/* Chat */}
            {group.messages.map((message) =>
              message.senderId === myId ? (
                <MyMessage key={message.messageId} {...message} />
              ) : (
                <OpponentMessage key={message.messageId} {...message} />
              ),
            )}
          </>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-[#dbdbdb] p-2 flex items-center">
        <button className="p-2 text-[#a4a8ae]">
          <Plus className="w-6 h-6" />
        </button>
        <div className="flex-1 mx-2 bg-[#f5f5f8] rounded-full px-4 py-2 flex items-center">
          <input
            type="text"
            placeholder="메시지 보내기"
            className="flex-1 bg-transparent outline-none text-[#303337]"
          />
        </div>
        <button className="p-2 text-[#a4a8ae]">
          <Send className="w-6 h-6" />
        </button>
      </div>

      {/* Download Button */}
      <div className="fixed bottom-24 right-4">
        <button className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
          <Download className="w-6 h-6 text-[#303337]" />
        </button>
      </div>
    </Container>
  )
}

// NOTE - 더미데이터
const chatParticipant = {
  assemblerId: 'user456',
  nickname: '컴퓨터달인',
  profileImageUrl: 'https://picsum.photos/200',
  reliability: 85, // 당도(신뢰도) 점수
}

const post = {
  postId: 'post789',
  thumbnailUrl: 'https://picsum.photos/200',
  title: '고성능 게이밍 키보드 조립 요청',
  price: 150000,
  status: 'IN_PROGRESS', // 견적요청, 진행중, 구매완료, 삭제됨 중 하나
  createdAt: '2025-03-15T10:30:00',
}

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
        senderNickname: '내닉네임',
        senderProfileUrl: 'https://picsum.photos/200',
        content: '네, 감사합니다. 잘 부탁드립니다.',
        messageType: 'TEXT',
        timestamp: '2025-03-18T11:46:15',
        formattedTime: '오전 11:46',
        read: true,
      },
      {
        messageId: 'msg123',
        senderId: 'user456',
        senderType: 'ASSEMBLER',
        senderNickname: '컴퓨터달인',
        senderProfileUrl: 'https://picsum.photos/200',
        content: '',
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
        senderNickname: '내닉네임',
        senderProfileUrl: 'https://picsum.photos/200',
        content: '견적 확인 부탁드립니다.',
        messageType: 'TEXT',
        timestamp: '2025-03-17T15:22:10',
        formattedTime: '오후 3:22',
        read: true,
      },
      {
        messageId: 'msg121',
        senderId: 'user456',
        senderType: 'ASSEMBLER',
        senderNickname: '컴퓨터달인',
        senderProfileUrl: 'https://picsum.photos/200',
        content: 'https://example.com/images/quote.jpg',
        messageType: 'IMAGE',
        timestamp: '2025-03-17T15:30:45',
        formattedTime: '오후 3:30',
        read: true,
      },
    ],
  },
]
