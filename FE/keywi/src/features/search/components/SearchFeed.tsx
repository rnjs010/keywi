import tw from 'twin.macro'
import { FeedSearchResult } from '@/interfaces/SearchInterface'

const GridContainer = tw.div`
  grid 
  grid-cols-3 
  gap-0.5
`
const FeedItem = tw.div`
  relative
  aspect-square
  overflow-hidden
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

interface SearchFeedProps {
  feeds: FeedSearchResult[]
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
        <FeedItem key={feed.feedId}>
          <FeedImage src={feed.thumbnailUrl} alt={`피드 ${feed.feedId}`} />
        </FeedItem>
      ))}
    </GridContainer>
  )
}
