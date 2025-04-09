import tw from 'twin.macro'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useBookmarkedFeedsQuery } from '../../hooks/useBookmarkedFeedsQuery'

const GridContainer = tw.div`
  grid grid-cols-3 gap-0.5
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
  flex-col
  justify-center 
  items-center
  gap-2
`
const SkeletonGrid = tw.div`
  grid grid-cols-3 gap-0.5
`

export default function BookmarkedFeedGrid() {
  const navigate = useNavigate()
  const { bookmarkedFeeds, isLoading } = useBookmarkedFeedsQuery()

  // 피드 클릭 핸들러
  const handleFeedClick = (feedId: number) => {
    navigate(`/bookmark/feed/${feedId}`, {
      state: { fromBookmarkPage: true },
    })
  }

  // 로딩 시 스켈레톤 표시
  if (isLoading) {
    return (
      <SkeletonGrid>
        {Array(9)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="w-full aspect-square" />
          ))}
      </SkeletonGrid>
    )
  }

  // 북마크 피드가 없을 때
  if (!bookmarkedFeeds || bookmarkedFeeds.length === 0) {
    return (
      <EmptyContainer>
        <p className="text-gray">북마크한 게시물이 없습니다.</p>
        <p className="text-gray text-sm">관심있는 게시물을 북마크 해보세요!</p>
      </EmptyContainer>
    )
  }

  return (
    <GridContainer>
      {bookmarkedFeeds.map((feed) => (
        <FeedItem key={feed.id} onClick={() => handleFeedClick(feed.id)}>
          <FeedImage
            src={feed.images[0]}
            alt={`피드 ${feed.id}`}
            loading="lazy"
          />
        </FeedItem>
      ))}
    </GridContainer>
  )
}
