import Badge from '@/components/Badge'
import getBadgeData from '@/utils/getBadgeData'
import { Text } from '@/styles/typography'
import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { ChatBubbleSolid, Bookmark } from 'iconoir-react'
import { IoEyeOutline } from 'react-icons/io5'
import { BoardDetailData } from '@/interfaces/BoardInterface'

const InfoContent = tw.div`
  pt-2 pb-4 border-b border-b-[#EEEEEE]
`

const CurrentInfo = tw.div`
  mt-4 flex items-center justify-between
`

const CurrentInfoBox = tw.div`
  flex items-center gap-2
`

const SingleInfoBox = tw.span`
  flex flex-row gap-0.5 items-center
`

export default function BoardDetailTop({ data }: { data: BoardDetailData }) {
  const badgeData = getBadgeData(data.status)

  return (
    <InfoContent>
      {/* 제목, 닉네임, 날짜 */}
      <Text variant="title3" weight="regular">
        {data.title}
      </Text>
      <div>
        <Text variant="caption1" weight="regular" color="gray">
          {data.authorNickname} · {data.createdAt}
        </Text>
      </div>
      {/* 상태, 채팅, 북마크, 조회수 */}
      <CurrentInfo>
        <CurrentInfoBox>
          <Badge title={badgeData.title} color={badgeData.color} />
          {data.chatCount !== 0 && (
            <SingleInfoBox>
              <ChatBubbleSolid color={colors.gray} width="1rem" height="1rem" />
              <Text variant="caption1" weight="regular" color="darkGray">
                {data.chatCount}
              </Text>
            </SingleInfoBox>
          )}
        </CurrentInfoBox>
        <CurrentInfoBox>
          <SingleInfoBox>
            <Bookmark color={colors.gray} width="1rem" height="1rem" />
            <Text variant="caption1" weight="regular" color="darkGray">
              {data.bookmarkCount}
            </Text>
          </SingleInfoBox>
          <SingleInfoBox>
            <IoEyeOutline color={colors.gray} size="1rem" />
            <Text variant="caption1" weight="regular" color="darkGray">
              {data.viewCount}
            </Text>
          </SingleInfoBox>
        </CurrentInfoBox>
      </CurrentInfo>
    </InfoContent>
  )
}
