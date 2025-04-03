// features/search/services/searchService.ts
import apiRequester from '@/services/api'
import {
  FeedSearchResult,
  ProductSearchResult,
  UserSearchResult,
  SearchParams,
} from '@/interfaces/SearchInterface'

// 응답 타입 (tab에 따라 다름)
type SearchResultType<T extends SearchParams['tab']> = T extends 'feeds'
  ? FeedSearchResult[]
  : T extends 'products'
    ? ProductSearchResult[]
    : T extends 'users'
      ? UserSearchResult[]
      : never

export const fetchSearchResults = async (
  params: SearchParams,
): Promise<FeedSearchResult[]> => {
  const { tab, query, page, size } = params

  const response = await apiRequester.get(`/api/search`, {
    params: { tab, query, page, size },
  })

  return response.data
}
