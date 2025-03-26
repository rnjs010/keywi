import FeedWriteButton from '@/components/FeedWriteButton'
import NavBar from '@/components/NavBar'
import HomeFeedList from '@/features/home/components/HomeFeedList'
import HomeHeader from '@/features/home/components/HomeHeader'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { dummyFeeds } from '@/features/home/services/homeDummyData'
import { useEffect, useState } from 'react'

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

const ScrollArea = styled.div`
  ${tw`
    flex-1 
    overflow-y-auto 
    pb-16
  `}

  /* 스크롤바 숨기기 - 웹킷 기반 브라우저 (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    display: none;
  }
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

// API 호출을 시뮬레이션하기 위한 지연 - 로딩창 시연용
const fetchFeeds = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyFeeds)
    }, 1500)
  })
}

export default function HomePage() {
  const [feeds, setFeeds] = useState(dummyFeeds)
  const [isLoading, setIsLoading] = useState(false)

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadFeeds = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFeeds()
        setFeeds(data as typeof dummyFeeds)
      } catch (error) {
        console.error('피드를 불러오는 중 오류가 발생했습니다:', error)
        // 실제 구현에서는 에러 상태 처리
      } finally {
        setIsLoading(false)
      }
    }
    loadFeeds()
  }, [])

  return (
    <Container>
      <HeaderContainer>
        <HomeHeader />
      </HeaderContainer>
      <ScrollArea>
        <HomeFeedList feeds={feeds} isLoading={isLoading} />
      </ScrollArea>
      <FeedWriteButton />
      <NavBarContainer>
        <NavBar />
      </NavBarContainer>
    </Container>
  )
}
