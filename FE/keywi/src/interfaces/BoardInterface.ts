// 견적 게시글 목록
export interface BoardCardData {
  boardId: number
  writerId: number
  authorNickname: string
  title: string
  thumbnailUrl: string
  dealState: string
  viewCount: number
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
  viewCount: number
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

// 화면에 보여줄 상품 정보
export interface BoardItemUsingInfo {
  categoryId: number
  categoryName: string
  productId: number
  productName: string
  price: number
  imageUrl: string
}
