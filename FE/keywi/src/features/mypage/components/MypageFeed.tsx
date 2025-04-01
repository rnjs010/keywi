import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

const GridContainer = tw.div`
  grid grid-cols-3 gap-0.5
`

const FeedItem = styled(Link)`
  ${tw`
    relative
    aspect-square
    overflow-hidden
  `}
`

const FeedImage = tw.img`
  w-full
  h-full
  object-cover
`

const EmptyContainer = tw.div`
  w-full 
  py-12
  flex 
  justify-center 
  items-center
`

interface Feed {
  id: number
  imageUrl: string
}

interface MypageFeedProps {
  feeds: Feed[]
}

export default function MypageFeed({ feeds }: MypageFeedProps) {
  if (feeds.length === 0) {
    return (
      <EmptyContainer>
        <p className="text-gray">게시물이 없습니다.</p>
      </EmptyContainer>
    )
  }

  return (
    <GridContainer>
      {feeds.map((feed) => (
        <FeedItem key={feed.id} to={`/home/feed/${feed.id}`}>
          <FeedImage src={feed.imageUrl} alt={`피드 ${feed.id}`} />
        </FeedItem>
      ))}
    </GridContainer>
  )
}
