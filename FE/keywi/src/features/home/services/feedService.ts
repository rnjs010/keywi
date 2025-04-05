import { CreateFeedDTO, FeedResponse } from '@/interfaces/HomeInterfaces'
import apiRequester from '@/services/api'

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

    // API 응답 로깅 (디버깅용)
    console.log(`피드 가져오기 성공 - 페이지 ${page}:`, response.data)

    return response.data
  } catch (error) {
    console.error(`피드 가져오기 실패 - 페이지 ${page}:`, error)
    throw error
  }
}
