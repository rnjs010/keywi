//NOTE - 피드 작성
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFeed } from '../services/feedService'
import { CreateFeedDTO } from '@/interfaces/HomeInterfaces'
import { useNavigate } from 'react-router-dom'

export function useFeedMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      feedData,
      files,
    }: {
      feedData: CreateFeedDTO
      files: File[]
    }) => createFeed(feedData, files),

    onSuccess: () => {
      // 피드 목록 캐시 무효화 (새로운 피드 반영)
      queryClient.invalidateQueries({ queryKey: ['feeds'] })

      navigate('/home', {
        state: {
          refreshFeed: true,
          timestamp: new Date().getTime(),
        },
      })
      console.log('게시물이 작성되었습니다!', queryClient)
    },

    onError: (error) => {
      console.error('피드 작성 실패:', error)
    },
  })
}
