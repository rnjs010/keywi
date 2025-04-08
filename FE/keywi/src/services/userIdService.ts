import apiRequester from '@/services/api'

export interface UserData {
  userId: number
  userName: string
  userNickname: string
  statusMessage: string
  brix: number
  role: string
  profileUrl: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string | null
  accountConnected: boolean
  email: string | null
  loginType: string
}

export interface UserResponse {
  success: boolean
  message: string
  data: UserData
}

export const fetchUserInfo = async (): Promise<UserData> => {
  const response = await apiRequester.get<UserResponse>('/api/auth/members/me')
  return response.data.data
}
