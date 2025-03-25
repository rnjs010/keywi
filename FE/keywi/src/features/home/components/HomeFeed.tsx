import tw from 'twin.macro'
import HomeFeedProfile from './HomeFeedProfile'
import HomeFeedImg from './HomeFeedImg'
import HomeFeedInteraction from './HomeFeedInteraction'
import HomeFeedText from './HomeFeedText'

const Container = tw.div`
  w-full
  mb-6
`

const ProfileWrapper = tw.div`
  px-4
`

export default function HomeFeed() {
  return (
    <Container>
      <ProfileWrapper>
        <HomeFeedProfile />
      </ProfileWrapper>
      <HomeFeedImg />
      <HomeFeedInteraction />
      <HomeFeedText />
    </Container>
  )
}
