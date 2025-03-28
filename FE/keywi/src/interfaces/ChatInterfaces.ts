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
