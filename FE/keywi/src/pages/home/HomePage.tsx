import FeedWriteButton from '@/components/FeedWriteButton'
import NavBar from '@/components/NavBar'
import HomeFeedList from '@/features/home/components/feed/HomeFeedList'
import HomeHeader from '@/features/home/components/feed/HomeHeader'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { useCallback, useEffect, useRef } from 'react'
import { useFeedQuery } from '@/features/home/hooks/useFeedQuery'
import { FeedData } from '@/interfaces/HomeInterfaces'
import InfiniteScroll from '@/components/InfiniteScroll'
import { useFeedStore } from '@/stores/homeStore'
import { transformFeedData } from '@/features/home/utils/FeedDataConverter'
import { addScrollListener, getScrollPosition } from '@/utils/scrollManager'
import { useLocation } from 'react-router-dom'

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
  z-10
`
const ScrollArea = styled.div`
  ${tw`
    flex-1 
    overflow-y-auto 
    overflow-x-hidden
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
const LoadingContainer = tw.div`
  flex
  justify-center
  items-center
  py-4
  text-darkKiwi
`

const ErrorContainer = tw.div`
  p-4 
  text-center 
  text-kiwi
  my-4
`
const RetryButton = tw.button`
  mt-2
  px-4
  py-2
  bg-kiwi
  text-white
  rounded-md
`

// 이 페이지의 스크롤 키
const SCROLL_KEY = 'home-feed'

export default function HomePage() {
  const location = useLocation()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useFeedQuery()

  const { setFeeds } = useFeedStore()

  //SECTION - 스크롤 위치 기억

  // 스크롤 영역에 대한 ref
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // 컴포넌트 마운트 시 항상 최신 데이터 조회 (staleTime이 지난 경우)
  useEffect(() => {
    // 페이지 진입 시 항상 최신 데이터 확인
    console.log('홈 페이지 진입: 최신 데이터 확인')
    refetch({ cancelRefetch: false })
  }, [refetch])

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const scrollElement = scrollAreaRef.current
    if (!scrollElement) return

    // 이벤트 리스너 등록 및 클린업 함수 받기
    const cleanup = addScrollListener(scrollElement, SCROLL_KEY)

    return cleanup
  }, [])

  // 스크롤 위치 복원
  useEffect(() => {
    // location.state를 확인하여 댓글에서 돌아왔는지 확인
    const isFromComments = location.state?.fromComments === true

    // 댓글에서 돌아온 경우에만 스크롤 위치 복원
    if (scrollAreaRef.current && !isLoading && data?.pages && isFromComments) {
      const position = getScrollPosition(SCROLL_KEY)
      if (position > 0) {
        setTimeout(() => {
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = position
          }
        }, 200)
      }
    } else {
      // 댓글에서 돌아온 것이 아니면 스크롤 위치 초기화
      scrollAreaRef.current?.scrollTo(0, 0)
    }
  }, [data, isLoading, location.state])

  // 피드 데이터가 변경되면 Zustand 스토어에 저장
  useEffect(() => {
    if (data?.pages) {
      const allFeeds = data.pages.flatMap((page) => page.content)
      setFeeds(allFeeds)
    }
  }, [data, setFeeds])

  // 다음 페이지 로드 함수
  const loadMoreFeeds = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  // 모든 페이지의 피드를 하나의 배열로 합치기
  const feeds: FeedData[] = data
    ? data.pages.flatMap((page) =>
        page.content.map((feed) => transformFeedData(feed)),
      )
    : []

  return (
    <Container>
      <HeaderContainer>
        <HomeHeader />
      </HeaderContainer>
      <ScrollArea ref={scrollAreaRef}>
        {isError ? (
          <ErrorContainer>
            <div>피드를 불러오는 중 오류가 발생했습니다.</div>
            <div className="mt-1 text-sm">{error?.message}</div>
            <RetryButton onClick={() => refetch()}>다시 시도하기</RetryButton>
          </ErrorContainer>
        ) : (
          <InfiniteScroll
            onLoadMore={loadMoreFeeds}
            hasNextPage={!!hasNextPage}
            isLoading={isFetchingNextPage}
            loadingComponent={
              <LoadingContainer>
                {isFetchingNextPage ? '더 많은 피드를 불러오는 중...' : ''}
              </LoadingContainer>
            }
          >
            <HomeFeedList
              feeds={feeds}
              isLoading={isLoading && feeds.length === 0}
            />
          </InfiniteScroll>
        )}
      </ScrollArea>
      <FeedWriteButton />
      <NavBarContainer>
        <NavBar />
      </NavBarContainer>
    </Container>
  )
}
