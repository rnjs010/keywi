import InfiniteScroll from '@/components/InfiniteScroll'
import StyledTabs, { TabItem } from '@/components/StyledTabs'
import SearchFeed from '@/features/search/components/SearchFeed'
import { SearchHeader } from '@/features/search/components/SearchHeader'
import SearchProduct from '@/features/search/components/SearchProduct'
import SearchUser from '@/features/search/components/SearchUser'
import {
  useFeedSearchResults,
  useProductSearchResults,
  useUserSearchResults,
} from '@/features/search/hooks/useSearchResults'
import { useSearchStore } from '@/stores/searchStore'
import { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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
  relative
`
// 상단 고정 컨테이너
const FixedTopSection = tw.div`
  w-full
`
// 로딩 상태 컴포넌트
const LoadingIndicator = tw.div`
  flex
  justify-center 
  items-center 
  py-4
  text-darkGray
`
// 결과 없음 컴포넌트
const NoResults = tw.div`
  w-full 
  py-12 
  text-center 
  text-darkGray
`

export function AfterSearchPage() {
  const { query = '' } = useParams<{ query: string }>()
  const { currentTab, setCurrentTab, setQuery } = useSearchStore()

  // URL 쿼리 파라미터를 스토어에 동기화
  useEffect(() => {
    if (query) {
      setQuery(query)
    }
  }, [query, setQuery])

  // 탭별 데이터 쿼리
  const {
    data: feedData,
    fetchNextPage: fetchNextFeedPage,
    hasNextPage: hasNextFeedPage,
    isFetchingNextPage: isFetchingNextFeedPage,
    isLoading: isLoadingFeeds,
  } = useFeedSearchResults(query, currentTab === 'feeds')

  const {
    data: productData,
    fetchNextPage: fetchNextProductPage,
    hasNextPage: hasNextProductPage,
    isFetchingNextPage: isFetchingNextProductPage,
    isLoading: isLoadingProducts,
  } = useProductSearchResults(query, currentTab === 'products')

  const {
    data: userData,
    fetchNextPage: fetchNextUserPage,
    hasNextPage: hasNextUserPage,
    isFetchingNextPage: isFetchingNextUserPage,
    isLoading: isLoadingUsers,
  } = useUserSearchResults(query, currentTab === 'users')

  // 데이터 변환
  const feeds = feedData?.pages.flatMap((page) => page) || []
  const products = productData?.pages.flatMap((page) => page) || []
  const users = userData?.pages.flatMap((page) => page) || []

  // 탭 변경 핸들러
  const handleTabChange = useCallback(
    (value: string) => {
      setCurrentTab(value as 'feeds' | 'products' | 'users')
    },
    [setCurrentTab],
  )

  // 탭 아이템 정의
  const tabItems: TabItem[] = [
    {
      value: 'feeds',
      label: '피드',
      content: (
        <InfiniteScroll
          onLoadMore={fetchNextFeedPage}
          hasNextPage={hasNextFeedPage}
          isLoading={isFetchingNextFeedPage}
        >
          {isLoadingFeeds && feeds.length === 0 ? (
            <LoadingIndicator>피드 검색 중...</LoadingIndicator>
          ) : feeds.length === 0 ? (
            <NoResults>검색 결과가 없습니다.</NoResults>
          ) : (
            <SearchFeed feeds={feeds} />
          )}
        </InfiniteScroll>
      ),
    },
    {
      value: 'products',
      label: '상품',
      content: (
        <InfiniteScroll
          onLoadMore={fetchNextProductPage}
          hasNextPage={hasNextProductPage}
          isLoading={isFetchingNextProductPage}
        >
          {isLoadingProducts && products.length === 0 ? (
            <LoadingIndicator>상품 검색 중...</LoadingIndicator>
          ) : products.length === 0 ? (
            <NoResults>검색 결과가 없습니다.</NoResults>
          ) : (
            <SearchProduct products={products} />
          )}
        </InfiniteScroll>
      ),
    },
    {
      value: 'users',
      label: '계정',
      content: (
        <InfiniteScroll
          onLoadMore={fetchNextUserPage}
          hasNextPage={hasNextUserPage}
          isLoading={isFetchingNextUserPage}
        >
          {isLoadingUsers && users.length === 0 ? (
            <LoadingIndicator>계정 검색 중...</LoadingIndicator>
          ) : users.length === 0 ? (
            <NoResults>검색 결과가 없습니다.</NoResults>
          ) : (
            <SearchUser users={users} />
          )}
        </InfiniteScroll>
      ),
    },
  ]

  return (
    <Container>
      {/* 상단 고정 영역 */}
      <FixedTopSection>
        <SearchHeader height="2.5rem" value={query} onChange={setQuery} />
      </FixedTopSection>

      <StyledTabs
        tabs={tabItems}
        defaultValue="feeds"
        onChange={handleTabChange}
      />
    </Container>
  )
}
