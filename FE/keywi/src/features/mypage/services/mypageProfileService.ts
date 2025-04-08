import { MyAccountInfo, MypageProfileInfo } from '@/interfaces/MypageInterface'
import apiRequester from '@/services/api'
import { AxiosResponse } from 'axios'

export interface ProfileResponse {
  status: string
  message: string
  data: MypageProfileInfo
}

export const getProfileInfo = async (
  userId: number,
): Promise<MypageProfileInfo> => {
  const response: AxiosResponse<ProfileResponse> = await apiRequester.get(
    `/api/profile?userId=${userId}`,
  )
  return response.data.data
}

export const updateStatusMessage = async (
  statusMessage: string,
): Promise<string> => {
  const response = await apiRequester.put('/api/profile/status-message', {
    statusMessage,
  })
  return response.data.message
}

export const getAccountInfo = async (): Promise<MyAccountInfo> => {
  const response = await apiRequester.get('/api/payment/account')
  console.log('계정 정보 조회', response.data)
  return response.data
}
