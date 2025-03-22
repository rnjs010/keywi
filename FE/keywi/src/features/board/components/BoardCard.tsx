import Badge from '@/components/Badge'
import { colors } from '@/styles/colors'
import { Text } from '@/styles/typography'
import { ChatBubbleSolid } from 'iconoir-react'
import tw from 'twin.macro'

const CardContainer = tw.div`
  flex flex-col justify-between items-start py-4 border-b border-[#EEEEEE]
`

const ContentContainer = tw.div`
  mt-1 flex flex-row justify-between w-full justify-items-center
`

const LeftContent = tw.div`
  flex-1
`

const TitleContainer = tw.div`
  flex items-center gap-4
`

const MetaInfo = tw.div`
  mt-1 text-gray
`

const ThumbnailImage = tw.img`
    w-[3rem] h-[3rem] rounded-md object-cover self-start
  `

//NOTE - 상태에 따른 텍스트와 색상을 반환하는 함수
const getBadgeData = (status: string) => {
  switch (status) {
    case 'REQUEST':
      return { title: '조립요청', color: 'red' } as const
    case 'IN_PROGRESS':
      return { title: '진행중', color: 'blue' } as const
    case 'COMPLETED':
      return { title: '조립완료', color: 'gray' } as const
    default:
      return { title: '', color: 'red' } as const
  }
}

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
  status,
  title,
  authorNickname,
  date,
  chstCount,
  thumbnailUrl,
}: BoardCardProps) {
  const badgeData = getBadgeData(status)

  return (
    <CardContainer>
      <Badge title={badgeData.title} color={badgeData.color} />
      <ContentContainer>
        <LeftContent>
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
          <MetaInfo>
            <Text variant="caption2" weight="regular" color="gray">
              {authorNickname} · {date}
            </Text>
          </MetaInfo>
        </LeftContent>
        {/* 사진 */}
        {thumbnailUrl && <ThumbnailImage src={thumbnailUrl} alt="thumbnail" />}
      </ContentContainer>
    </CardContainer>
  )
}
