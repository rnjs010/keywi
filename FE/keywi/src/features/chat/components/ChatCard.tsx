import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { Link } from 'react-router-dom'
import { ChatRoomProps } from '@/interfaces/ChatInterfaces'

const CardContainer = tw.div`
  flex justify-between items-center py-4 gap-5
`

const TitleContainer = tw.div`
  flex items-center gap-2
`

const ProfileImage = tw.img`
    w-[4rem] h-[4rem] rounded-full object-cover self-start
  `

export default function ChatCard({
  roomId,
  assembler,
  lastMessage,
  formattedTime,
}: ChatRoomProps) {
  return (
    <Link to={`/chat/${roomId}`}>
      <CardContainer>
        {/* 사진 */}
        {assembler.profileImageUrl && (
          <ProfileImage src={assembler.profileImageUrl} alt="thumbnail" />
        )}
        <div className="flex-1">
          {/* 상대방 이름, 마지막 연락 시간 */}
          <TitleContainer>
            <Text variant="body1" weight="regular">
              {assembler.nickname}
            </Text>
            <Text variant="caption2" weight="regular" color="gray">
              · {formattedTime}
            </Text>
          </TitleContainer>
          {/* 마지막 문자 내용 */}
          <Text variant="caption2" weight="regular" color="gray">
            {lastMessage}
          </Text>
        </div>
      </CardContainer>
    </Link>
  )
}
