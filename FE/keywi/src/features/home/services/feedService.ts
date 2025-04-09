import {
  CreateFeedDTO,
  FeedData,
  FeedResponse,
  Hashtag,
} from '@/interfaces/HomeInterfaces'
import apiRequester from '@/services/api'
import { useQueryClient } from '@tanstack/react-query'
import { transformFeedData } from '../utils/FeedDataConverter'

// 피드 작성
export const createFeed = async (feedData: CreateFeedDTO, images: File[]) => {
  const formData = new FormData() // 보낼 양식 세팅
  formData.append('feedData', JSON.stringify(feedData))
  images.forEach((image, index) => {
    formData.append('images', image, `image-${index}.jpg`)
  })
  const response = await apiRequester.post('/api/feed', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// 피드 조회
export const getRecommendedFeeds = async (
  page: number,
  size: number = 5,
): Promise<FeedResponse> => {
  try {
    const response = await apiRequester.get<FeedResponse>(
      `/api/feed/recommended?page=${page}&size=${size}`,
    )
    return response.data
  } catch (error) {
    console.error(`피드 가져오기 실패 - 페이지 ${page}:`, error)
    throw error
  }
}

// 해시태그 목록 조회
export const getHashtags = async (): Promise<Hashtag[]> => {
  try {
    const response = await apiRequester.get('/api/feed/hashtags')
    return response.data
  } catch (error) {
    console.error('해시태그 조회 실패:', error)
    throw error
  }
}

// 피드 삭제 후 쿼리 무효화를 위한 훅
export const useDeleteFeed = () => {
  const queryClient = useQueryClient()

  return async (feedId: number) => {
    try {
      const response = await apiRequester.delete(`/api/feed/${feedId}`)

      // 삭제 성공 시 관련된 모든 쿼리 캐시 무효화
      if (response.data.success) {
        // 홈 피드 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: ['feeds', 'recommended'] })

        // 마이페이지 피드 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: ['feeds', 'my'] })
      }

      return response.data
    } catch (error) {
      console.error(`피드 삭제 실패 (ID: ${feedId}):`, error)
      throw error
    }
  }
}

// 북마크한 피드 목록 조회
export const getBookmarkedFeeds = async (): Promise<FeedData[]> => {
  try {
    const response = await apiRequester.get('/api/feed/bookmarks')
    // 메시지만 있는 경우 (북마크 정보가 없는 경우)
    if (
      response.data &&
      response.data.message &&
      !Array.isArray(response.data)
    ) {
      console.log('북마크 정보 없음:', response.data.message)
      return [] // 빈 배열 반환
    }
    // API 응답 데이터를 FeedData 형식으로 변환
    return response.data.map((item: any) => transformFeedData(item))
  } catch (error) {
    console.error('북마크 피드 목록 조회 실패:', error)
    throw error
  }
}
