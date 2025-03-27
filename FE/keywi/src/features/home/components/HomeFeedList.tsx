import tw from 'twin.macro'
import { HomeFeedListProps } from '@/interfaces/HomeInterfaces'
import HomeFeed from './HomeFeed'
import HomeFeedSkeleton from './HomeFeedSkeleton'

const Container = tw.div`
  w-full
`
const EmptyFeedContainer = tw.div`
  w-full
  h-40
  flex
  justify-center
  items-center
  text-gray
`

export default function HomeFeedList({
  feeds,
  isLoading = false,
}: HomeFeedListProps) {
  if (isLoading) {
    return (
      <Container>
        <HomeFeedSkeleton />
      </Container>
    )
  }

  if (feeds.length === 0) {
    return <EmptyFeedContainer>표시할 피드가 없습니다.</EmptyFeedContainer>
  }

  return (
    <Container>
      {feeds.map((feed) => (
        <HomeFeed key={feed.id} feed={feed} />
      ))}
    </Container>
  )
}
