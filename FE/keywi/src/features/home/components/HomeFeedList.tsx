import tw from 'twin.macro'
import { HomeFeedListProps } from '@/interfaces/HomeInterfaces'
import HomeFeed from './HomeFeed'

const Container = tw.div`
  w-full
`

export default function HomeFeedList({
  feeds,
  isLoading = false,
}: HomeFeedListProps) {
  if (isLoading) {
    return <div>피드를 불러오는 중...</div>
  }

  if (feeds.length === 0) {
    return <div>표시할 피드가 없습니다.</div>
  }

  return (
    <Container>
      {feeds.map((feed) => (
        <HomeFeed key={feed.id} feed={feed} />
      ))}
    </Container>
  )
}
