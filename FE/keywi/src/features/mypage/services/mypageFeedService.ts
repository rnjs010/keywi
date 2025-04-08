import apiRequester from '@/services/api'
import { FeedData } from '@/interfaces/HomeInterfaces'

// API 응답 타입 (배열 형태로 직접 반환)
export type ApiFeedListResponse = FeedData[]

// 내 피드 조회 (전체 조회)
export const getMyFeeds = async (): Promise<FeedData[]> => {
  try {
    const response = await apiRequester.get<FeedData[]>('/api/feed/me')
    console.log('내 피드 가져오기 성공:', response.data)

    // 서버에서 직접 배열 형태로 반환
    return response.data || []
  } catch (error) {
    console.error('내 피드 가져오기 실패:', error)
    throw error
  }
}

// 특정 사용자의 피드 조회 (전체 조회)
export const getUserFeeds = async (userId: number): Promise<FeedData[]> => {
  try {
    const response = await apiRequester.get<FeedData[]>(
      `/api/feed/user/${userId}`,
    )
    console.log(`사용자(${userId}) 피드 가져오기 성공:`, response.data)

    // 서버에서 직접 배열 형태로 반환
    return response.data || []
  } catch (error) {
    console.error(`사용자(${userId}) 피드 가져오기 실패:`, error)
    throw error
  }
}
