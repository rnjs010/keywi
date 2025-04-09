import { useState } from 'react'
import tw from 'twin.macro'
import MypageHeader from '@/features/mypage/components/MypageHeader'
import MypageProfile from '@/features/mypage/components/MypageProfile'
import MypageFeed from '@/features/mypage/components/MypageFeed'
import MypageBoard from '@/features/mypage/components/MypageBoard'
import NavBar from '@/components/NavBar'
import StyledTabs, { TabItem } from '@/components/StyledTabs'
import { useParams } from 'react-router-dom'
import { useUserStore } from '@/stores/userStore'
import { useMypageFeedQuery } from '@/features/mypage/hooks/useMypageFeedQuery'
import { Skeleton } from '@/components/ui/skeleton'

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
const LoadingContainer = tw.div`
  p-4
  flex
  flex-col
  gap-4
`

export default function MyPage() {
  // URL 파라미터에서 사용자 ID 가져오기
  const { userId: userIdParam } = useParams<{ userId?: string }>()
  const myUserId = useUserStore((state) => state.userId)

  // 현재 사용자 ID 결정
  const userId = userIdParam ? parseInt(userIdParam) : undefined // 프로필 조회 유저 아이디
  const isMyProfile = !userIdParam || parseInt(userIdParam) === myUserId // 내 프로필 주소인지 확인

  // 현재 적절한 쿼리 선택
  const feedQuery = useMypageFeedQuery(isMyProfile, userId || undefined)

  // 현재 탭
  const [currentTab, setCurrentTab] = useState('feed')

  // 로딩 중이면 스켈레톤 표시
  if (feedQuery.isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <Skeleton className="h-10 w-full" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex justify-between gap-4 mt-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </LoadingContainer>
      </Container>
    )
  }

  // 피드 데이터 가져오기
  const feeds = feedQuery.data || []

  // 탭 아이템 정의
  const tabItems: TabItem[] = [
    {
      value: 'feed',
      label: '피드',
      content: <MypageFeed feeds={feeds} isLoading={feedQuery.isLoading} />,
    },
    {
      value: 'quote',
      label: '견적',
      content: <MypageBoard userId={userId || 0} isMyProfile={isMyProfile} />,
    },
  ]

  const handleTabChange = (value: string) => {
    setCurrentTab(value)
    console.log('현재 탭', currentTab)
  }

  return (
    <Container>
      {/* 상단 고정 영역 */}
      <FixedTopSection>
        <MypageHeader />
        {userId && <MypageProfile userId={userId} isMyProfile={isMyProfile} />}
      </FixedTopSection>

      <StyledTabs
        tabs={tabItems}
        defaultValue="feed"
        onChange={handleTabChange}
      />

      <NavBarContainer>
        <NavBar />
      </NavBarContainer>
    </Container>
  )
}
