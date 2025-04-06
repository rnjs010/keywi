import apiRequester from '@/services/api'
import {
  FeedSearchResult,
  ProductSearchResult,
  UserSearchResult,
  SearchParams,
  KeywordRank,
} from '@/interfaces/SearchInterface'

// 키 생성 함수들
export const searchKeys = {
  all: ['search'] as const,
  feeds: (params: Omit<SearchParams, 'tab'>) =>
    [...searchKeys.all, 'feeds', params] as const,
  products: (params: Omit<SearchParams, 'tab'>) =>
    [...searchKeys.all, 'products', params] as const,
  users: (params: Omit<SearchParams, 'tab'>) =>
    [...searchKeys.all, 'users', params] as const,
  rankings: ['search', 'rankings'] as const,
  recentKeywords: (userId: number) =>
    [...searchKeys.all, 'recent', userId] as const,
  suggestions: (query: string) =>
    [...searchKeys.all, 'suggestions', query] as const,
}

// 피드 검색 API
export const fetchFeedResults = async (
  params: Omit<SearchParams, 'tab'>,
): Promise<FeedSearchResult[]> => {
  const { query, page } = params

  const response = await apiRequester.get('/api/search', {
    params: { tab: 'feeds', query, page },
  })
  console.log('피드 response', response)
  return response.data || []
}

// 상품 검색 API
export const fetchProductResults = async (
  params: Omit<SearchParams, 'tab'>,
): Promise<ProductSearchResult[]> => {
  const { query, page } = params

  const response = await apiRequester.get('/api/search', {
    params: { tab: 'products', query, page },
  })
  console.log('상품 response', response)
  return response.data || []
}

// 사용자 검색 API
export const fetchUserResults = async (
  params: Omit<SearchParams, 'tab'>,
): Promise<UserSearchResult[]> => {
  const { query, page } = params

  const response = await apiRequester.get('/api/search', {
    params: { tab: 'users', query, page },
  })
  console.log('사용자 response', response)
  return response.data || []
}

// 인기 검색어 랭킹 API
export const fetchPopularKeywords = async (): Promise<KeywordRank[]> => {
  const response = await apiRequester.get('/api/search/rankings/latest')
  return response.data || []
}

// 최근 검색어 목록 가져오기
export const fetchRecentKeywords = async (
  userId: number,
): Promise<string[]> => {
  const response = await apiRequester.get('/api/search/keywords', {
    params: { userId },
  })
  return response.data || []
}

// 최근 검색어 모두 삭제하기
export const deleteAllRecentKeywords = async (
  userId: number,
): Promise<void> => {
  await apiRequester.delete('/api/search/keywords', {
    params: { userId },
  })
}

// 검색어 자동완성
export const fetchSuggestions = async (query: string): Promise<string[]> => {
  if (!query.trim()) return []

  const response = await apiRequester.get('/api/search/suggestions', {
    params: { query },
  })
  return response.data.data || []
}

// 검색어 저장 (검색 실행 시)
export const saveSearchKeyword = async (
  userId: number,
  keyword: string,
): Promise<void> => {
  await apiRequester.post('/api/search/keywords', {
    userId,
    keyword,
  })
}
