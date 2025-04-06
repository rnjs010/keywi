import Badge from '@/components/Badge'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import {
  NavArrowLeft,
  MoreVert,
  Prohibition,
  TriangleFlag,
  BellOff,
} from 'iconoir-react'
import { BsTrash3 } from 'react-icons/bs'
import { ChatParticipant } from '@/interfaces/ChatInterfaces'
import getDangdoBadgeData from '@/utils/getDandoBadgeData'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import TwoBtnModal from '@/components/TwoBtnModal'

const Container = tw.div`
  flex items-center justify-between p-4 border-b border-[#dbdbdb]
`

export default function ChatRoomHeader({
  nickname,
  reliability,
}: ChatParticipant) {
  const navigate = useNavigate()
  const getDangdoColor = getDangdoBadgeData(reliability)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLeaveChatRoom = () => {
    setIsModalOpen(true)
  }

  const handleConfirmLeave = () => {
    setIsModalOpen(false)
    navigate('/chat')
  }

  const handleCancleLeave = () => {
    setIsModalOpen(false)
  }

  return (
    <Container>
      <NavArrowLeft onClick={() => navigate('/chat')} />
      <div className="flex items-center gap-1">
        <Text variant="body1" weight="bold" color="black">
          {nickname}
        </Text>
        <Badge
          title={`당도 ${reliability}`}
          color={getDangdoColor || 'gray'}
          size="small"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>
            <MoreVert />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="w-40">
          <DropdownMenuItem onClick={() => alert('차단하기')}>
            <Prohibition />
            <Text variant="body1" weight="regular" color="darkGray">
              차단하기
            </Text>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert('신고하기')}>
            <TriangleFlag />
            <Text variant="body1" weight="regular" color="darkGray">
              신고하기
            </Text>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert('알림끄기')}>
            <BellOff />
            <Text variant="body1" weight="regular" color="darkGray">
              알림끄기
            </Text>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLeaveChatRoom}>
            <BsTrash3 color="red" />
            <Text variant="body1" weight="regular" style={{ color: 'red' }}>
              채팅방 나가기
            </Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TwoBtnModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="채팅방을 나갈까요?"
        content="채팅방을 나가면 채팅 목록 및 대화 내용이 삭제되고 복구할 수 없어요."
        cancleText="취소"
        confirmText="나가기"
        onCancle={handleCancleLeave}
        onConfirm={handleConfirmLeave}
      />
    </Container>
  )
}
