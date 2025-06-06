import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { Link } from 'react-router-dom'
import { ChatRoom } from '@/interfaces/ChatInterfaces'
import getTimeDiff from '@/utils/getTimeDiff'

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
  otherUserNickname,
  otherUserProfileImage,
  lastMessage,
  lastMessageTime,
}: ChatRoom) {
  return (
    <Link to={`/chat/${roomId}`}>
      <CardContainer>
        {/* 사진 */}
        <ProfileImage
          src={otherUserProfileImage || '/default/default_product.png'}
          alt="thumbnail"
        />
        <div className="flex-1">
          {/* 상대방 이름, 마지막 연락 시간 */}
          <TitleContainer>
            <Text variant="body1" weight="regular">
              {otherUserNickname}
            </Text>
            <Text variant="caption2" weight="regular" color="gray">
              · {getTimeDiff(lastMessageTime)}
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
