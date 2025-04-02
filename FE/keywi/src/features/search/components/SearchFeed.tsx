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
  feedId: number
  thumbnailUrl: string
}

interface SearchFeedProps {
  feeds: Feed[]
}

export default function SearchFeed({ feeds }: SearchFeedProps) {
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
        <FeedItem key={feed.feedId} to={`/home/feed/${feed.feedId}`}>
          <FeedImage src={feed.thumbnailUrl} alt={`피드 ${feed.feedId}`} />
        </FeedItem>
      ))}
    </GridContainer>
  )
}
