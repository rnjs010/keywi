export interface MypageBoardCardProps {
  id: number
  status: string
  title: string
  date: string
  time: string
  chstCount?: number
  thumbnailUrl: string
}

export interface MypageProfileInfo {
  userId: number
  nickname: string
  profileImageUrl: string
  brix: number
  profileContent: string
  followerCount: number
  followingCount: number
  buildCount: number
}

export interface MyAccountInfo {
  accountNo: string
  bankCode: string
}
