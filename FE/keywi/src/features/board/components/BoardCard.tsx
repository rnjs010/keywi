import Badge from '@/components/Badge'
import getBadgeData from '@/utils/getBadgeData'
import { colors } from '@/styles/colors'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { ChatBubbleSolid } from 'iconoir-react'
import { Link } from 'react-router-dom'

const CardContainer = tw.div`
  flex flex-col justify-between items-start py-4 border-b border-[#EEEEEE]
`

const ContentContainer = tw.div`
  mt-1 flex flex-row justify-between w-full justify-items-center
`

const TitleContainer = tw.div`
  flex items-center gap-4
`

const ThumbnailImage = tw.img`
    w-[3rem] h-[3rem] rounded-md object-cover self-start
  `

interface BoardCardProps {
  id: number
  status: string
  title: string
  authorNickname: string
  date: string
  chstCount?: number
  thumbnailUrl: string
}

export default function BoardCard({
  id,
  status,
  title,
  authorNickname,
  date,
  chstCount,
  thumbnailUrl,
}: BoardCardProps) {
  const badgeData = getBadgeData(status)

  return (
    <Link to={`/board/${id}`}>
      <CardContainer>
        <Badge title={badgeData.title} color={badgeData.color} />
        <ContentContainer>
          <div className="flex-1">
            {/* 제목, 채팅 수 */}
            <TitleContainer>
              <Text variant="body1" weight="regular">
                {title}
              </Text>
              {chstCount !== 0 && (
                <span className="flex flex-row gap-1 items-center">
                  <ChatBubbleSolid
                    color={colors.gray}
                    width="1rem"
                    height="1rem"
                  />
                  <Text variant="caption1" weight="regular" color="gray">
                    {chstCount}
                  </Text>
                </span>
              )}
            </TitleContainer>
            {/* 닉네임, 날짜 */}
            <div className="mt-1">
              <Text variant="caption2" weight="regular" color="gray">
                {authorNickname} · {date}
              </Text>
            </div>
          </div>
          {/* 사진 */}
          {thumbnailUrl && (
            <ThumbnailImage src={thumbnailUrl} alt="thumbnail" />
          )}
        </ContentContainer>
      </CardContainer>
    </Link>
  )
}
