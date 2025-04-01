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

const Container = tw.div`
  flex items-center justify-between p-4 border-b border-[#dbdbdb]
`

export default function ChatRoomHeader({
  nickname,
  reliability,
}: ChatParticipant) {
  const navigate = useNavigate()
  const getDangdoColor = getDangdoBadgeData(reliability)

  return (
    <Container>
      <NavArrowLeft onClick={() => navigate('/chat')} />
      <div className="flex items-center">
        <Text variant="body1" weight="bold" color="black">
          {nickname}
        </Text>
        <Badge title={`당도 ${reliability}`} color={getDangdoColor || 'gray'} />
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
          <DropdownMenuItem onClick={() => alert('채팅방 나가기')}>
            <BsTrash3 color="red" />
            <Text variant="body1" weight="regular" style={{ color: 'red' }}>
              채팅방 나가기
            </Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Container>
  )
}
