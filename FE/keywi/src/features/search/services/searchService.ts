import apiRequester from '@/services/api'
import {
  FeedSearchResult,
  ProductSearchResult,
  UserSearchResult,
  SearchParams,
} from '@/interfaces/SearchInterface'

// 피드 검색 API
export const fetchFeedResults = async (
  params: Omit<SearchParams, 'tab'>,
): Promise<FeedSearchResult[]> => {
  const { query, page, size } = params

  const response = await apiRequester.get('/api/search', {
    params: { tab: 'feeds', query, page, size },
  })

  return response.data
}

// 상품 검색 API
export const fetchProductResults = async (
  params: Omit<SearchParams, 'tab'>,
): Promise<ProductSearchResult[]> => {
  const { query, page, size } = params

  const response = await apiRequester.get('/api/search', {
    params: { tab: 'products', query, page, size },
  })

  return response.data
}

// 사용자 검색 API
export const fetchUserResults = async (
  params: Omit<SearchParams, 'tab'>,
): Promise<UserSearchResult[]> => {
  const { query, page, size } = params

  const response = await apiRequester.get('/api/search', {
    params: { tab: 'users', query, page, size },
  })

  return response.data
}
