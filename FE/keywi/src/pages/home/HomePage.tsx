import FeedWriteButton from '@/components/FeedWriteButton'
import NavBar from '@/components/NavBar'
import HomeFeedList from '@/features/home/components/feed/HomeFeedList'
import HomeHeader from '@/features/home/components/feed/HomeHeader'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { useFeedQuery } from '@/features/home/hooks/useFeedQuery'
import { FeedData } from '@/interfaces/HomeInterfaces'
import InfiniteScroll from '@/components/InfiniteScroll'
import { useFeedStore } from '@/stores/homeStore'
import { transformFeedData } from '@/features/home/utils/FeedDataConverter'
import { addScrollListener, getScrollPosition } from '@/utils/scrollManager'
import { useLocation } from 'react-router-dom'
import PullToRefresh from '@/components/PulltoRefresh'

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

  // 컴포넌트 마운트 시 항상 최신 데이터 조회 (staleTime이 지난 경우)
  useEffect(() => {
    refetch({ cancelRefetch: false })
  }, [refetch])

  //SECTION - 스크롤 위치 기억
  // 스크롤 영역에 대한 ref
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const scrollElement = scrollAreaRef.current
    if (!scrollElement) return
    // 이벤트 리스너 등록 및 클린업 함수 받기
    const cleanup = addScrollListener(scrollElement, SCROLL_KEY)
    return cleanup
  }, [])

  // 스크롤 위치 복원
  useLayoutEffect(() => {
    const isFromComments = location.state?.fromComments === true
    if (!isLoading && data?.pages) {
      if (scrollAreaRef.current && isFromComments) {
        const position = getScrollPosition(SCROLL_KEY)
        if (position > 0) {
          scrollAreaRef.current.scrollTop = position
        }
      } else if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = 0
      }
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

  // 새로고침 함수
  const handleRefresh = async () => {
    if (location.state?.fromComments) {
      window.history.replaceState({}, document.title)
    }

    try {
      await refetch()
    } catch (error) {
      console.error('피드 새로고침 실패:', error)
    }
  }

  return (
    <Container>
      <HeaderContainer>
        <HomeHeader />
      </HeaderContainer>
      <PullToRefresh onRefresh={handleRefresh} scrollRef={scrollAreaRef}>
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
      </PullToRefresh>
      <FeedWriteButton />
      <NavBarContainer>
        <NavBar />
      </NavBarContainer>
    </Container>
  )
}
