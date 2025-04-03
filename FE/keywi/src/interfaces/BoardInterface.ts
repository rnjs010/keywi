// 견적 게시글 목록
export interface BoardCardData {
  boardId: number
  writerId: number
  writerNickname: string
  title: string
  thumbnailUrl: string
  dealState: string
  chatCount: number
  createdAt: string
  updatedAt: string
}

// 견적 게시글 상세 페이지
export interface BoardDetailData {
  id: number
  title: string
  content: string
  authorNickname: string
  createdAt: string
  status: string
  chatCount: number
  bookmarkCount: number
  viewCount: number
  isBookmarked: boolean
  isAuthor: boolean
  items: BoardItem[]
  images: string[]
}

// 상품
export interface BoardItem {
  categoryId: number
  categoryName: string
  itemId: number
  itemName: string
  price: number
  imageUrl: string
}
