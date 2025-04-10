import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFeedStore } from '@/stores/homeStore'
import HomeFeed from '@/features/home/components/feed/HomeFeed'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useUserStore } from '@/stores/userStore'
import NavBar from '@/components/NavBar'
import NextHeader from '@/components/NextHeader'
import { useDeleteFeed } from '@/features/home/services/feedService'
import { toast } from 'sonner'
import LoadingMessage from '@/components/message/LoadingMessage'
import { useBookmarkedFeedsQuery } from '@/features/home/hooks/useBookmarkedFeedsQuery'

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
const FeedContainer = tw.div`
  flex-1
  relative
  overflow-hidden
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

export default function BookmarkFullscreenPage() {
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
  const feedQuery = useBookmarkedFeedsQuery()

  // 북마크된 피드
  const bookmarkedFeeds = feedQuery.bookmarkedFeeds || []

  // 현재 피드 인덱스
  const [currentIndex, setCurrentIndex] = useState(() => {
    return bookmarkedFeeds.findIndex((feed) => feed.id === initialFeedId)
  })

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false)

  // 현재 피드
  const currentFeed = bookmarkedFeeds[currentIndex]

  // 새로고침 애니메이션 진행 중 여부
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 드래그 관련 상태
  const dragStartY = useRef(0)
  const dragThreshold = 200

  // 데이터가 로드되면 피드 인덱스 업데이트
  useEffect(() => {
    if (bookmarkedFeeds.length > 0) {
      const newIndex = bookmarkedFeeds.findIndex(
        (feed) => feed.id === initialFeedId,
      )
      if (newIndex !== -1) {
        setCurrentIndex(newIndex)
      } else if (bookmarkedFeeds.length > 0) {
        // 피드 ID를 찾을 수 없으면 첫 번째 피드로
        setCurrentIndex(0)
        navigate(`/bookmark/feed/${bookmarkedFeeds[0].id}`, { replace: true })
      }
    }
  }, [bookmarkedFeeds, initialFeedId, navigate])

  // 피드 변경 핸들러
  const changeFeed = (index: number) => {
    if (index >= 0 && index < bookmarkedFeeds.length) {
      setCurrentIndex(index)
      navigate(`/bookmark/feed/${bookmarkedFeeds[index].id}`, { replace: true })
    }
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
    if (currentIndex < bookmarkedFeeds.length - 1) {
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

    if (dragDistance < -dragThreshold) {
      // 위로 스와이프 - 다음 피드로 이동
      goToNextFeed()
    } else if (dragDistance > dragThreshold) {
      // 아래로 스와이프 - 이전 피드로 이동
      goToPreviousFeed()
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
    const currentFeed = bookmarkedFeeds[currentIndex]
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
        const updatedFeeds = bookmarkedFeeds.filter(
          (feed) => feed.id !== currentFeed.id,
        )

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

  // 로딩 중이면 로딩 상태 표시
  if (feedQuery.isLoading) {
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
  if (bookmarkedFeeds.length === 0) {
    return (
      <Container>
        <NextHeader startTitle="피드" />
        <div>
          <p className="text-lg text-gray">표시할 피드가 없습니다</p>
        </div>
        <NavBarContainer>
          <NavBar />
        </NavBarContainer>
      </Container>
    )
  }

  return (
    <Container>
      <NextHeader
        startTitle="북마크한 피드"
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
