import Badge from '@/components/Badge'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { NavArrowLeft, MoreVert } from 'iconoir-react'
import { ChatParticipant } from '@/interfaces/ChatInterfaces'

const Container = tw.div`
  flex items-center justify-between p-4 border-b border-[#dbdbdb]
`

export default function ChatRoomHeader({
  nickname,
  reliability,
}: ChatParticipant) {
  return (
    <Container>
      <NavArrowLeft />
      <div className="flex items-center">
        <Text variant="body1" weight="bold" color="black">
          {nickname}
        </Text>
        <Badge title={`당도 ${reliability}`} color={'high'} />
      </div>
      <MoreVert />
    </Container>
  )
}
