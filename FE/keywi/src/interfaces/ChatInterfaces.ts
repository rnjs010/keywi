import { BoardItemUsingInfo } from './BoardInterface'

// 채팅방 리스트
export interface ChatRoom {
  roomId: string
  otherUserId: string
  otherUserNickname: string
  otherUserProfileImage: string
  lastMessage: string
  lastMessageTime: string
  notificationEnabled: boolean
}

// 채팅방 정보
export interface ChatPartner {
  otherUserId: string
  otherUserNickname: string
  brix: number
}

export interface ChatPost {
  boardId: string
  title: string
  thumbnailUrl: string
  dealState: string
  buyerId: string
  assemblerId: string
}

// 단일 메시지
export interface ChatMessageItems {
  productId: number
  productName: string
  price: number
}

export interface ChatMessage {
  messageId: string
  roomId: string
  senderId: string
  senderNickname: string
  senderProfileUrl: string
  receiverId: string | null
  messageType: string
  content: string | null
  items: ChatMessageItems[] // JSON 형식의 문자열 (예: '[{"productId": 1, "productName": "상품명", "price": 1000}]')
  imageUrl: string | null
  transactionAmount: number | null
  transactionStatus: string | null
  sentAt: string // ISO 8601 형식 (예: "2025-04-07T16:04:30.782")
  messageRead: boolean
}

export interface MessageGroup {
  dateGroup: string // 예: "2025년 4월 7일"
  messages: ChatMessage[]
}

export interface PageInfo {
  totalMessages: number
  pageSize: number
  hasMoreMessages: boolean
}

export interface ChatMessagesResponseData {
  messageGroups: MessageGroup[]
  pageInfo: PageInfo
}

// 거래 메시지 타입
export interface DealMessageProps {
  messageId: string
  messageType: string
  content: string
  isMine: boolean
}

// 거래 상품 정보 (카테고리 별 상품)
export interface ProductData {
  productId: number
  categoryId: number
  categoryName: string
  productName: string
  isFavorite: boolean
  price: number
  productUrl: string
  productImage: string
  manufacturer: string
  descriptions: string | null
}

export interface CategoryAllProductResponse {
  status: string
  message: string
  data: ProductData[]
}

// 거래 영수증 정보
export interface ReceiptData {
  receiptId: number
  roomId: number
  boardId: number
  messageId: string
  assemblerId: number
  buyerId: number
  totalAmount: number
  amount: number
  charge: number
  createdAt: string
  items: BoardItemUsingInfo[]
}
