import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFeedStore } from '@/stores/homeStore'
import HomeFeed from '@/features/home/components/feed/HomeFeed'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { XmarkCircle } from 'iconoir-react'
import { useMypageFeedQuery } from '@/features/mypage/hooks/useMypageFeedQuery'
import { useUserStore } from '@/stores/userStore'
import NavBar from '@/components/NavBar'
import MypageHeader from '@/features/mypage/components/MypageHeader'
import NextHeader from '@/components/NextHeader'

const Container = tw.div`
  fixed
  inset-0
  bg-white
  z-50
  flex
  flex-col
  overflow-hidden
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
const Header = tw.div`
  flex
  justify-between
  items-center
  px-4
  py-3
  bg-black
  text-white
  z-10
`
const FeedContainer = tw.div`
  flex-1
  relative
  overflow-hidden
`
const CloseButton = tw.button`
  p-1
`
const LoadingIndicator = styled(motion.div)`
  ${tw`
    absolute
    top-0
    left-0
    right-0
    h-1
    bg-kiwi
  `}
`
const FeedWrapper = styled(motion.div)`
  ${tw`
    absolute
    inset-0
    bg-white
    overflow-auto
  `}
  /* 스크롤바 숨김 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

export default function FeedFullscreenPage() {
  const { feedId } = useParams<{ feedId: string }>()
  const navigate = useNavigate()
  const { feeds } = useFeedStore()
  const myUserId = useUserStore((state) => state.userId)

  // 현재 피드에서 작성자 ID 가져오기 (URL에서 feedId를 통해)
  const initialFeedId = parseInt(feedId || '0', 10)
  const currentFeedFromUrl = Object.values(feeds).find(
    (feed) => feed.id === initialFeedId,
  )

  // 작성자 ID 및 내 프로필 여부 확인
  const authorId = currentFeedFromUrl?.authorId
  const isMyProfile = authorId === myUserId

  // 단일 쿼리 사용 - 작성자의 모든 피드 가져오기
  // 첫 로드 시에는 정보가 없을 수 있으므로 조건부 실행
  const feedQuery = useMypageFeedQuery(
    isMyProfile,
    isMyProfile ? undefined : authorId,
  )

  // 모든 피드
  const allFeeds = Object.values(feeds)

  // 현재 피드 인덱스
  const [currentIndex, setCurrentIndex] = useState(() => {
    return allFeeds.findIndex((feed) => feed.id === initialFeedId)
  })

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false)

  // 현재 피드
  const currentFeed = allFeeds[currentIndex]

  // 새로고침 애니메이션 진행 중 여부
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 드래그 시작 위치
  const dragStartY = useRef(0)
  const dragThreshold = 200 // 스와이프로 인정할 임계값

  // 데이터가 로드되면 피드 인덱스 업데이트
  useEffect(() => {
    if (allFeeds.length > 0) {
      const newIndex = allFeeds.findIndex((feed) => feed.id === initialFeedId)
      if (newIndex !== -1) {
        setCurrentIndex(newIndex)
      } else if (allFeeds.length > 0) {
        // 피드 ID를 찾을 수 없으면 첫 번째 피드로
        setCurrentIndex(0)
        navigate(`/home/feed/${allFeeds[0].id}`, { replace: true })
      }
    }
  }, [allFeeds, initialFeedId, navigate])

  // 피드 변경 핸들러
  const changeFeed = (index: number) => {
    if (index >= 0 && index < allFeeds.length) {
      setCurrentIndex(index)
      navigate(`/home/feed/${allFeeds[index].id}`, { replace: true })
    }
  }

  // 닫기 버튼 핸들러
  const handleClose = () => {
    navigate(-1)
  }

  // 이전 피드로 이동
  const goToPreviousFeed = () => {
    if (currentIndex > 0) {
      setIsLoading(true)
      setIsRefreshing(true)

      // 로딩 애니메이션 후 피드 변경
      setTimeout(() => {
        changeFeed(currentIndex - 1)
        setIsLoading(false)
        setIsRefreshing(false)
      }, 400)
    }
  }

  // 다음 피드로 이동
  const goToNextFeed = () => {
    if (currentIndex < allFeeds.length - 1) {
      setIsLoading(true)
      setIsRefreshing(true)

      // 로딩 애니메이션 후 피드 변경
      setTimeout(() => {
        changeFeed(currentIndex + 1)
        setIsLoading(false)
        setIsRefreshing(false)
      }, 400)
    }
  }

  // 드래그 시작 핸들러
  const handleDragStart = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    dragStartY.current = info.point.y
  }

  // 드래그 종료 핸들러
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const dragDistance = info.point.y - dragStartY.current

    // 위로 스와이프
    if (dragDistance < -dragThreshold) {
      goToPreviousFeed()
    }
    // 아래로 스와이프
    else if (dragDistance > dragThreshold) {
      goToNextFeed()
    }
  }

  // 로딩 중이거나 피드가 없으면 로딩 상태 표시
  if (feedQuery.isLoading || allFeeds.length === 0) {
    return (
      <Container>
        <MypageHeader />
        <Header>
          <div>로딩 중...</div>
          <CloseButton onClick={handleClose}>
            <XmarkCircle width={24} height={24} />
          </CloseButton>
        </Header>
        <div className="flex-1 flex items-center justify-center">
          <div>피드를 불러오는 중...</div>
        </div>
        <NavBarContainer>
          <NavBar />
        </NavBarContainer>
      </Container>
    )
  }

  return (
    <Container>
      <NextHeader startTitle="나의 피드" />
      <FeedContainer>
        {/* 로딩 인디케이터 */}
        <AnimatePresence>
          {isLoading && (
            <LoadingIndicator
              initial={{ scaleX: 0, transformOrigin: 'left' }}
              animate={{ scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </AnimatePresence>
        {/* 피드 컨텐츠 */}
        <AnimatePresence initial={false}>
          <FeedWrapper
            key={currentFeed.id}
            initial={{ opacity: 0, y: isRefreshing ? -20 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="max-w-screen-sm mx-auto">
              {currentFeed && <HomeFeed feed={currentFeed} />}
            </div>
          </FeedWrapper>
        </AnimatePresence>
      </FeedContainer>
      <NavBarContainer>
        <NavBar />
      </NavBarContainer>
    </Container>
  )
}
