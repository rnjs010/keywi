import { useState, useEffect } from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import MypageHeader from '@/features/mypage/MypageHeader'
import MypageProfile from '@/features/mypage/MypageProfile'
import MypageFeed from '@/features/mypage/MypageFeed'
import MypageBoard from '@/features/mypage/MypageBoard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import NavBar from '@/components/NavBar'

const Container = tw.div`
  w-full 
  max-w-screen-sm 
  mx-auto 
  flex 
  flex-col 
  h-screen 
  box-border 
  overflow-hidden
  relative
`

// 상단 고정 영역 위한 컨테이너
const FixedTopSection = tw.div`
  w-full
`

const TabContainer = tw.div`
  mt-1
  flex 
  flex-col
  flex-1
`

const StyledTabs = styled(Tabs)`
  ${tw`
    w-full
    flex
    flex-col
    h-full
  `}
`

const StyledTabsList = styled(TabsList)`
  ${tw`
    w-full 
    bg-transparent 
    border-b
    border-white
    justify-center
    h-9
    shrink-0
  `}
`

const StyledTabsTrigger = styled(TabsTrigger)`
  ${tw`
    flex-1 
    text-base 
    data-[state=active]:text-black 
    data-[state=active]:shadow-none
    data-[state=active]:border-b-2
    data-[state=active]:border-black
    data-[state=active]:rounded-none
    data-[state=active]:font-bold
    py-3
  `}
`

const ContentWrapper = tw.div`
  flex-1
  relative
`

const StyledTabsContent = styled(TabsContent)`
  ${tw`
    hidden
    data-[state=active]:block
    absolute
    inset-0
    overflow-y-auto 
    pb-16
  `}

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }

  /* iOS 스크롤 부드럽게 */
  -webkit-overflow-scrolling: touch;
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

export default function MyPage() {
  // 더미 데이터
  const [profileData, setProfileData] = useState({
    nickname: '규리몽땅',
    profileImage: 'https://picsum.photos/200',
    // levelBadgeText: '당도 16',
    followers: 0,
    following: 3,
    posts: 0,
    description: '감성만땅',
  })

  const [feeds, setFeeds] = useState([
    { id: 1, imageUrl: 'https://picsum.photos/300?random=1' },
    { id: 2, imageUrl: 'https://picsum.photos/300?random=2' },
    { id: 3, imageUrl: 'https://picsum.photos/300?random=3' },
    { id: 4, imageUrl: 'https://picsum.photos/300?random=4' },
    { id: 5, imageUrl: 'https://picsum.photos/300?random=5' },
    { id: 6, imageUrl: 'https://picsum.photos/300?random=6' },
    { id: 7, imageUrl: 'https://picsum.photos/300?random=7' },
    { id: 8, imageUrl: 'https://picsum.photos/300?random=8' },
    { id: 9, imageUrl: 'https://picsum.photos/300?random=9' },
    { id: 10, imageUrl: 'https://picsum.photos/300?random=10' },
    { id: 11, imageUrl: 'https://picsum.photos/300?random=11' },
    { id: 12, imageUrl: 'https://picsum.photos/300?random=12' },
    { id: 13, imageUrl: 'https://picsum.photos/300?random=13' },
    { id: 14, imageUrl: 'https://picsum.photos/300?random=14' },
    { id: 15, imageUrl: 'https://picsum.photos/300?random=15' },
  ])

  const [quotes, setQuotes] = useState([
    {
      id: 1,
      status: 'REQUEST',
      title: '견적부탁드립니다...',
      date: '2023.03.13',
      time: '15:43',
      chatCount: 1,
      thumbnailUrl: 'https://picsum.photos/50?random=10',
    },
    {
      id: 2,
      status: 'COMPLETED',
      title: '키위에 견적 부탁드려요...!!',
      date: '2023.03.10',
      time: '10:43',
      chatCount: 3,
      thumbnailUrl: 'https://picsum.photos/50?random=11',
    },
  ])

  return (
    <Container>
      {/* 상단 고정 영역 */}
      <FixedTopSection>
        <MypageHeader />
        <MypageProfile
          nickname={profileData.nickname}
          profileImage={profileData.profileImage}
          // levelBadgeText={profileData.levelBadgeText}
          followers={profileData.followers}
          following={profileData.following}
          posts={profileData.posts}
          description={profileData.description}
        />
      </FixedTopSection>

      <TabContainer>
        <StyledTabs defaultValue="feed">
          <StyledTabsList>
            <StyledTabsTrigger value="feed">피드</StyledTabsTrigger>
            <StyledTabsTrigger value="quote">견적</StyledTabsTrigger>
          </StyledTabsList>

          <ContentWrapper>
            <StyledTabsContent value="feed">
              <MypageFeed feeds={feeds} />
            </StyledTabsContent>
            <StyledTabsContent value="quote">
              <MypageBoard quotes={quotes} />
            </StyledTabsContent>
          </ContentWrapper>
        </StyledTabs>
      </TabContainer>

      <NavBarContainer>
        <NavBar />
      </NavBarContainer>
    </Container>
  )
}
