// 견적 게시글 목록
export interface BoardCardData {
  boardId: number
  writerId: number
  writerNickname: string
  title: string
  thumbnailUrl: string
  dealState: string
  viewCnt: number
  chatCount: number
  createdAt: string
  updatedAt: string
}

// 견적 게시글 상세 페이지
export interface BoardDetailData {
  boardId: number
  title: string
  content: string
  authorNickname: string
  dealState: string
  chatCount: number
  bookmarkCount: number
  viewCnt: number
  createdAt: string
  imageUrls: string[]
  products: BoardItem[]
  bookmarked: boolean
  author: boolean
}

// 견적 게시글 내 상품 (채팅에도 사용중,,)
export interface BoardItem {
  categoryId: number
  categoryName: string
  productId: number
  productName: string
  price: number
  imageUrl: string
  manufacturer: string | null
  createdAt: string | null
}

export const categories = [
  { id: 1, name: '하우징' },
  { id: 2, name: '키캡' },
  { id: 3, name: '스위치' },
  { id: 4, name: '스테빌라이저' },
  { id: 5, name: '흡음재' },
  { id: 6, name: '보강판' },
  { id: 7, name: '기판' },
]

// 화면에 보여줄 상품 정보
export interface BoardItemUsingInfo {
  categoryId: number
  categoryName: string
  productId: number
  productName: string
  price: number
  imageUrl: string
}
