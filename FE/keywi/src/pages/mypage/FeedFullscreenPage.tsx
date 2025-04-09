import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useFeedStore } from '@/stores/homeStore'
import HomeFeed from '@/features/home/components/feed/HomeFeed'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useUserStore } from '@/stores/userStore'
import NavBar from '@/components/NavBar'
import MypageHeader from '@/features/mypage/components/MypageHeader'
import NextHeader from '@/components/NextHeader'
import {
  getBookmarkedFeeds,
  useDeleteFeed,
} from '@/features/home/services/feedService'
import { toast } from 'sonner'
import { FeedData } from '@/interfaces/HomeInterfaces'
import {
  getMyFeeds,
  getUserFeeds,
} from '@/features/mypage/services/mypageFeedService'
import { useQueryClient } from '@tanstack/react-query'
import LoadingMessage from '@/components/message/LoadingMessage'

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
  const location = useLocation()
  const { feeds } = useFeedStore()
  const myUserId = useUserStore((state) => state.userId)
  const queryClient = useQueryClient()
  const initialFeedId = parseInt(feedId || '0', 10)

  const currentFeedFromUrl = Object.values(feeds).find(
    (feed) => feed.id === initialFeedId,
  )

  // 출처 타입을 명시적으로 저장하여 모호함 제거
  const [feedSource, setFeedSource] = useState<
    'bookmark' | 'myProfile' | 'userProfile' | 'general'
  >(
    location.state?.fromBookmarkPage
      ? 'bookmark'
      : location.state?.fromMyPage
        ? currentFeedFromUrl?.authorId === myUserId
          ? 'myProfile'
          : 'userProfile'
        : 'general',
  )

  // 로컬 상태로 사용할 피드들 관리
  const [localFeeds, setLocalFeeds] = useState<FeedData[]>([])
  const [isLoadingFeeds, setIsLoadingFeeds] = useState(true)
  const [localError, setLocalError] = useState<Error | null>(null)

  // 로컬 상태들
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadingState, setLoadingState] = useState<
    'initial' | 'changing' | 'complete'
  >('initial')

  // 드래그 관련 상태
  const dragStartY = useRef(0)
  const dragThreshold = 200

  // FeedFullscreenPage.tsx의 useEffect 부분 수정
  useEffect(() => {
    const loadAppropriateFeeds = async () => {
      setIsLoadingFeeds(true)
      try {
        let loadedFeeds: FeedData[] = []

        // URL 경로를 기반으로 적절한 데이터 로드
        if (location.pathname.includes('/profile/feed/')) {
          // 프로필 피드인 경우
          const isMyProfilePage = location.state?.fromMyPage || false
          const userIdFromState = location.state?.userId || myUserId

          console.log(
            '프로필 피드 로드 중...',
            isMyProfilePage ? '내 프로필' : '다른 사용자',
          )

          if (isMyProfilePage || userIdFromState === myUserId) {
            loadedFeeds = await getMyFeeds()
            setFeedSource('myProfile')
          } else {
            loadedFeeds = await getUserFeeds(userIdFromState)
            setFeedSource('userProfile')
          }
        } else if (location.pathname.includes('/bookmark/feed/')) {
          // 북마크 피드인 경우
          console.log('북마크 피드 로드 중...')
          loadedFeeds = await getBookmarkedFeeds()
          setFeedSource('bookmark')
        } else {
          // 일반 피드인 경우
          console.log('일반 피드 로드 중...')
          loadedFeeds = Object.values(feeds)
          setFeedSource('general')
        }

        console.log('로드된 피드 개수:', loadedFeeds.length)
        setLocalFeeds(loadedFeeds)

        // 적절한 인덱스 찾기
        const newIndex = loadedFeeds.findIndex(
          (feed) => feed.id === initialFeedId,
        )

        if (newIndex !== -1) {
          setCurrentIndex(newIndex)
        } else if (loadedFeeds.length > 0) {
          setCurrentIndex(0)
        }

        setLoadingState('complete')
      } catch (error) {
        console.error('피드 로드 중 오류:', error)
        setLocalError(
          error instanceof Error ? error : new Error('피드 로딩 실패'),
        )
      } finally {
        setIsLoadingFeeds(false)
      }
    }

    // 즉시 피드 로드 시작
    loadAppropriateFeeds()
  }, [location.pathname, initialFeedId, myUserId, feeds])

  // 인접 피드 미리 가져오기
  const prefetchAdjacentFeeds = (currentIdx: number, feedList: FeedData[]) => {
    // 다음 피드 미리 가져오기
    if (currentIdx < feedList.length - 1) {
      const nextFeedId = feedList[currentIdx + 1].id
      // 필요한 경우 다음 피드 세부 정보 미리 가져오기
      // queryClient.prefetchQuery...
    }
    // 이전 피드 미리 가져오기
    if (currentIdx > 0) {
      const prevFeedId = feedList[currentIdx - 1].id
      // 필요한 경우 이전 피드 세부 정보 미리 가져오기
      // queryClient.prefetchQuery...
    }
  }

  const changeFeed = (index: number) => {
    if (index >= 0 && index < localFeeds.length) {
      const newFeedId = localFeeds[index].id
      let newPath

      // 현재 URL 패턴에 따라 적절한 경로 생성
      if (location.pathname.includes('/profile/feed/')) {
        newPath = `/profile/feed/${newFeedId}`
      } else if (location.pathname.includes('/bookmark/feed/')) {
        newPath = `/bookmark/feed/${newFeedId}`
      } else {
        newPath = `/home/feed/${newFeedId}`
      }

      navigate(newPath, {
        replace: true,
        state: {
          ...location.state,
          currentSourceIndex: index,
        },
      })

      prefetchAdjacentFeeds(index, localFeeds)
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
      setLoadingState('changing')

      // 로딩 애니메이션 후 피드 변경
      setTimeout(() => {
        changeFeed(currentIndex - 1)
        setIsLoading(false)
        setIsRefreshing(false)
        setLoadingState('complete')
      }, 400)
    }
  }

  // 다음 피드로 이동
  const goToNextFeed = () => {
    if (currentIndex < localFeeds.length - 1) {
      setIsLoading(true)
      setIsRefreshing(true)
      setLoadingState('changing')

      // 로딩 애니메이션 후 피드 변경
      setTimeout(() => {
        changeFeed(currentIndex + 1)
        setIsLoading(false)
        setIsRefreshing(false)
        setLoadingState('complete')
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

  // 피드 수정 핸들러
  const handleEditFeed = () => {
    // 여기에 수정 로직 추가
  }

  // deleteFeed 함수 대신 훅 사용
  const deleteFeedWithInvalidation = useDeleteFeed()

  // 피드 삭제 핸들러
  const handleDeleteFeed = async () => {
    const currentFeed = localFeeds[currentIndex]
    if (!currentFeed) return

    try {
      // 사용자에게 삭제 확인 요청
      if (!window.confirm('정말 이 피드를 삭제하시겠습니까?')) {
        return
      }

      const result = await deleteFeedWithInvalidation(currentFeed.id)

      if (result.success) {
        // 삭제 성공 시 처리
        toast.success('피드가 삭제되었습니다')

        // 목록에서 제거하고 상태 업데이트
        const updatedFeeds = localFeeds.filter(
          (feed) => feed.id !== currentFeed.id,
        )
        setLocalFeeds(updatedFeeds)

        if (updatedFeeds.length === 0) {
          // 더 이상 표시할 피드가 없으면 이전 페이지로 이동
          navigate(-1)
        } else if (currentIndex >= updatedFeeds.length) {
          // 마지막 피드가 삭제된 경우 인덱스 조정
          setCurrentIndex(updatedFeeds.length - 1)
        }
      } else {
        toast.error('피드 삭제에 실패했습니다')
      }
    } catch (error) {
      console.error('피드 삭제 중 오류 발생:', error)
      toast.error('오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  // 로딩 중이거나 피드가 없으면 로딩 상태 표시
  if (isLoadingFeeds) {
    return (
      <Container>
        <LoadingMessage />
        <NavBarContainer>
          <NavBar />
        </NavBarContainer>
      </Container>
    )
  }

  // 피드가 없으면 빈 상태 표시
  if (localFeeds.length === 0) {
    return (
      <Container>
        <NextHeader startTitle="피드" />
        <div>
          <p className="text-lg text-gray-500">표시할 피드가 없습니다</p>
          <button
            className="mt-4 px-4 py-2 bg-kiwi text-white rounded-md"
            onClick={() => navigate(-1)}
          >
            뒤로 가기
          </button>
        </div>
        <NavBarContainer>
          <NavBar />
        </NavBarContainer>
      </Container>
    )
  }

  // 현재 피드 가져오기
  const currentFeed = localFeeds[currentIndex]

  // 내 피드인지 확인
  const isMyProfile = currentFeed?.authorId === myUserId

  return (
    <Container>
      <NextHeader
        startTitle={
          feedSource === 'bookmark'
            ? '북마크된 피드'
            : feedSource === 'myProfile'
              ? '내 피드'
              : feedSource === 'userProfile'
                ? '피드'
                : '피드'
        }
        more={isMyProfile}
        isMyContent={isMyProfile} // 내 피드인 경우에만 수정/삭제 버튼 표시
        onEdit={handleEditFeed}
        onDelete={handleDeleteFeed}
      />
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
