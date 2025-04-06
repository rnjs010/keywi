// 인기 검색어
export interface KeywordRank {
  timeBlock: string
  keyword: string
  ranking: number
  changeStatus: 'NEW' | 'UP' | 'DOWN' | 'SAME' | 'NONE'
}

// 피드 검색 결과
export interface FeedSearchResult {
  feedId: number
  thumbnailUrl: string
}

// 유저 검색 결과
export interface UserSearchResult {
  userId: number
  nickname: string
  brix?: number
  profileImageUrl?: string
  profileContent?: string
}

// 상품 검색 결과
export interface ProductSearchResult {
  productId: number
  productName: string
  categoryId?: number
  categoryName?: string
  price?: number
  thumbnailUrl?: string
  manufacturer?: string
}

// 헤더 검색 상태
export interface HeaderSearchProps {
  height?: string
  placeholder?: string
  onFocus?: () => void
  value?: string
  onChange?: (value: string) => void
}

// 검색 호출용
export interface SearchParams {
  tab: 'feeds' | 'products' | 'users'
  query: string
  page: number
}
