// features/home/services/feedService.ts
import { CreateFeedDTO } from '@/interfaces/HomeInterfaces'
import apiRequester from '@/services/api'

export const createFeed = async (feedData: CreateFeedDTO, images: File[]) => {
  // FormData 객체 생성
  const formData = new FormData()

  // feedData를 JSON 문자열로 변환하여 추가
  formData.append('feedData', JSON.stringify(feedData))

  // 이미지 파일들 추가
  images.forEach((image, index) => {
    formData.append('images', image, `image-${index}.jpg`)
  })

  // API 요청
  const response = await apiRequester.post('/api/feed', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
