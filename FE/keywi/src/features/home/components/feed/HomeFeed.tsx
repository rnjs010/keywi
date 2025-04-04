import tw from 'twin.macro'
import HomeFeedProfile from './HomeFeedProfile'
import HomeFeedImg from './HomeFeedImg'
import HomeFeedInteraction from './HomeFeedInteraction'
import HomeFeedText from './HomeFeedText'
import { HomeFeedProps } from '@/interfaces/HomeInterfaces'

const Container = tw.div`
  w-full
  mb-6
`
const ProfileWrapper = tw.div`
  px-4
`

export default function HomeFeed({ feed }: HomeFeedProps) {
  return (
    <Container>
      <ProfileWrapper>
        <HomeFeedProfile
          username={feed.username}
          profileImage={feed.profileImage}
          description={feed.description}
          isFollowing={feed.isFollowing}
        />
      </ProfileWrapper>
      <HomeFeedImg mainImages={feed.images} productTags={feed.productTags} />
      <HomeFeedInteraction
        likeCount={feed.likeCount}
        commentCount={feed.commentCount}
        isLiked={feed.isLiked}
        isBookmarked={feed.isBookmarked}
        feedId={feed.id}
      />
      <HomeFeedText
        content={feed.content}
        hashtags={feed.hashtags}
        timeAgo={feed.timeAgo}
      />
    </Container>
  )
}
