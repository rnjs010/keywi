import { useInfiniteQuery } from '@tanstack/react-query'
import {
  fetchFeedResults,
  fetchProductResults,
  fetchUserResults,
} from '../services/searchService'
import { useSearchStore } from '@/stores/searchStore'

// 기본 페이지 크기
const DEFAULT_PAGE_SIZE = 30

// 피드 검색 결과 훅
export const useFeedSearchResults = (query: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['search', 'feeds', query],
    queryFn: ({ pageParam = 1 }) =>
      fetchFeedResults({
        query,
        page: pageParam,
        size: DEFAULT_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < DEFAULT_PAGE_SIZE
        ? undefined
        : allPages.length + 1
    },
    initialPageParam: 1,
    enabled: !!query && enabled,
    staleTime: 5 * 60 * 1000, // 5분 캐싱
  })
}

// 상품 검색 결과 훅
export const useProductSearchResults = (query: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['search', 'products', query],
    queryFn: ({ pageParam = 1 }) =>
      fetchProductResults({
        query,
        page: pageParam,
        size: DEFAULT_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < DEFAULT_PAGE_SIZE
        ? undefined
        : allPages.length + 1
    },
    initialPageParam: 1,
    enabled: !!query && enabled,
    staleTime: 5 * 60 * 1000,
  })
}

// 사용자 검색 결과 훅
export const useUserSearchResults = (query: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['search', 'users', query],
    queryFn: ({ pageParam = 1 }) =>
      fetchUserResults({
        query,
        page: pageParam,
        size: DEFAULT_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < DEFAULT_PAGE_SIZE
        ? undefined
        : allPages.length + 1
    },
    initialPageParam: 1,
    enabled: !!query && enabled,
    staleTime: 5 * 60 * 1000,
  })
}

// 현재 탭에 따른 검색 결과 가져오기
export const useActiveTabResults = () => {
  const { query, currentTab } = useSearchStore()

  const feedResults = useFeedSearchResults(query, currentTab === 'feeds')
  const productResults = useProductSearchResults(
    query,
    currentTab === 'products',
  )
  const userResults = useUserSearchResults(query, currentTab === 'users')

  switch (currentTab) {
    case 'feeds':
      return feedResults
    case 'products':
      return productResults
    case 'users':
      return userResults
    default:
      return feedResults
  }
}
