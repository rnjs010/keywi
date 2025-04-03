export interface ChatRoomProps {
  roomId: string
  assembler: {
    assemblerId: string
    nickname: string
    profileImageUrl: string
  }
  lastMessage: string
  lastMessageTime: string
  formattedTime: string
  unreadCount: number
  postTitle: string
}

export interface ChatParticipant {
  assemblerId: string // 사용자 ID
  nickname: string // 사용자 닉네임
  profileImageUrl: string // 프로필 이미지 URL
  reliability: number // 신뢰도 점수 (당도)
}

export interface PostInfo {
  postId: string
  thumbnailUrl: string
  title: string
  price: number
  status: string
  createdAt: string
}

export interface Message {
  messageId: string
  senderId: string
  senderType: string
  senderNickname: string
  senderProfileUrl: string
  content: string
  messageType: string
  timestamp: string
  formattedTime: string
  read: boolean
}

export interface DealMessageProps {
  messageType: string
  content: string
  isMine: boolean
}
