export interface BoardItem {
  categoryId: number
  categoryName: string
  itemId: number
  itemName: string
  price: number
  imageUrl: string
}

export interface BoardData {
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
