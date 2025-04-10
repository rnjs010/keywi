import Badge from '@/components/Badge'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { ChatPost } from '@/interfaces/ChatInterfaces'
import getBadgeData from '@/utils/getBadgeData'
import { useNavigate } from 'react-router-dom'

const Container = tw.div`
  flex items-center gap-4 p-4 border-b border-[#dbdbdb] 
`

const ThumbnailImage = tw.img`
  w-[3rem] h-[3rem] rounded-md object-cover self-start
`

export default function ChatRoomPostInfo({
  boardId,
  title,
  thumbnailUrl,
  dealState,
}: ChatPost) {
  const navigate = useNavigate()
  const badgeData = getBadgeData(dealState)

  return (
    <Container onClick={() => navigate(`/board/${boardId}`)}>
      <ThumbnailImage
        src={thumbnailUrl || '/default/default_product.png'}
        alt="thumbnail"
      />
      <div className="flex flex-col justify-center">
        <Badge title={badgeData.title} color={badgeData.color} />
        <Text variant="caption1" weight="bold" color="darkGray">
          {title}
        </Text>
      </div>
    </Container>
  )
}
