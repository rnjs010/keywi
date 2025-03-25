import FeedWriteButton from '@/components/FeedWriteButton'
import NavBar from '@/components/NavBar'
import HomeFeed from '@/features/home/components/HomeFeed'
import HomeHeader from '@/features/home/components/HomeHeader'
import tw from 'twin.macro'

const Container = tw.div`
  w-full 
  max-w-screen-sm 
  mx-auto 
  flex 
  flex-col 
  h-screen 
  box-border 
  overflow-x-hidden
`

const HeaderContainer = tw.div`
  px-4
  z-10
`

const ScrollArea = tw.div`
  flex-1 
  overflow-y-auto 
  pb-16 
`

const NavBarContainer = tw.div`
  fixed
  bottom-0
  left-0
  right-0
  bg-white
  z-10
  max-w-screen-sm
  mx-auto
  w-full
`

export default function HomePage() {
  return (
    <Container>
      <HeaderContainer>
        <HomeHeader />
      </HeaderContainer>
      <ScrollArea>
        <HomeFeed />
      </ScrollArea>
      <FeedWriteButton />
      <NavBarContainer>
        <NavBar />
      </NavBarContainer>
    </Container>
  )
}
