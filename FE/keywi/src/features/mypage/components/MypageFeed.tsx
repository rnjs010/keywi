import tw from 'twin.macro'
import { useNavigate } from 'react-router-dom'
import { FeedData } from '@/interfaces/HomeInterfaces'
import { Skeleton } from '@/components/ui/skeleton'

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
  justify-center 
  items-center
`
const SkeletonGrid = tw.div`
  grid grid-cols-3 gap-0.5
`

interface MypageFeedProps {
  feeds: FeedData[]
  isLoading: boolean
}

export default function MypageFeed({ feeds, isLoading }: MypageFeedProps) {
  const navigate = useNavigate()

  // 피드 클릭 핸들러
  const handleFeedClick = (feedId: number) => {
    navigate(`/home/feed/${feedId}`, {
      state: { fromMyPage: true },
    })
  }
  // 로딩 시 스켈레톤 표시
  if (isLoading && feeds.length === 0) {
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
  // 피드가 없을 때
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
        <FeedItem key={feed.id} onClick={() => handleFeedClick(feed.id)}>
          <FeedImage src={feed.images[0]} alt={`피드 ${feed.id}`} />
        </FeedItem>
      ))}
    </GridContainer>
  )
}
