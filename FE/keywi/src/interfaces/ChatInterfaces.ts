export interface ChatRoom {
  roomId: string
  otherUserId: string
  otherUserNickname: string
  otherUserProfileImage: string
  lastMessage: string
  lastMessageTime: string
  notificationEnabled: boolean
}

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

// export interface ChatRoomProps {
//   roomId: string
//   assembler: {
//     assemblerId: string
//     nickname: string
//     profileImageUrl: string
//   }
//   lastMessage: string
//   lastMessageTime: string
//   formattedTime: string
//   unreadCount: number
//   postTitle: string
// }

// export interface ChatParticipant {
//   assemblerId: string // 사용자 ID
//   nickname: string // 사용자 닉네임
//   profileImageUrl: string // 프로필 이미지 URL
//   reliability: number // 신뢰도 점수 (당도)
// }

// export interface PostInfo {
//   postId: string
//   thumbnailUrl: string
//   title: string
//   price: number
//   status: string
//   createdAt: string
// }

export interface ChatMessage {
  messageId: string
  roomId: string
  senderId: string
  senderNickname: string
  senderProfileUrl: string
  receiverId: string | null
  messageType: string
  content: string | null
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
  currentPage: number
  hasMoreMessages: boolean
}

// API 응답 데이터
export interface ChatMessagesResponseData {
  messageGroups: MessageGroup[]
  pageInfo: PageInfo
}

export interface DealMessageProps {
  messageType: string
  content: string
  isMine: boolean
}
