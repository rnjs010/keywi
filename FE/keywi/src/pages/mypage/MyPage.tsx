import { useState, useEffect } from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import MypageHeader from '@/features/mypage/MypageHeader'
import MypageProfile from '@/features/mypage/MypageProfile'
import MypageFeedGrid from '@/features/mypage/MypageFeed'
import MypageQuoteList from '@/features/mypage/MypageBoard'
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
  overflow-x-hidden
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

const TabContainer = tw.div`
  border-b border-[#EEEEEE]
`

const StyledTabs = styled(Tabs)`
  ${tw`w-full`}
`

const StyledTabsList = styled(TabsList)`
  ${tw`
    w-full 
    bg-transparent 
    border-b-0
    justify-center
    h-12
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
    // levelBadgeText: '런타이 16',
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
  ])

  const [quotes, setQuotes] = useState([
    {
      id: 1,
      status: '진행중',
      title: '견적부탁드립니다...',
      authorNickname: '지민춘',
      date: '2023.03.13',
      chatCount: 1,
      thumbnailUrl: 'https://picsum.photos/50?random=10',
    },
    {
      id: 2,
      status: '구매완료',
      title: '키위에 견적 부탁드려요...!!',
      authorNickname: '규리몽땅',
      date: '2023.03.13',
      chatCount: 3,
      thumbnailUrl: 'https://picsum.photos/50?random=11',
    },
  ])

  return (
    <Container>
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

      <TabContainer>
        <ScrollArea>
          <StyledTabs defaultValue="feed">
            <StyledTabsList>
              <StyledTabsTrigger value="feed">피드</StyledTabsTrigger>
              <StyledTabsTrigger value="quote">견적</StyledTabsTrigger>
            </StyledTabsList>

            <TabsContent value="feed" className="mt-0">
              <MypageFeedGrid feeds={feeds} />
            </TabsContent>

            <TabsContent value="quote" className="mt-0">
              <MypageQuoteList quotes={quotes} />
            </TabsContent>
          </StyledTabs>
        </ScrollArea>
      </TabContainer>

      <NavBarContainer>
        <NavBar />
      </NavBarContainer>
    </Container>
  )
}
