import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  toggleFeedLike,
  toggleFeedBookmark,
  toggleUserFollow,
  LikeResponse,
  BookmarkResponse,
  FollowResponse,
} from '../services/feedInteractionService'
import { useFeedStore } from '@/stores/homeStore'

// 좋아요 기능 훅
export const useLikeMutation = () => {
  const { toggleLike } = useFeedStore()

  return useMutation<LikeResponse, Error, number>({
    mutationFn: (feedId: number) => toggleFeedLike(feedId),
    onMutate: async (feedId) => {
      // ui 업뎃
      toggleLike(feedId)
    },
    onSuccess: () => {
      console.log('좋아요 성공')
    },
    onError: (error, feedId) => {
      // 실패 시 원상복구
      console.error('좋아요 처리 실패:', error)
      toggleLike(feedId) // 다시 토글하여 원래 상태로 되돌림
    },
  })
}

// 북마크 기능 훅
export const useBookmarkMutation = () => {
  const { toggleBookmark } = useFeedStore()

  return useMutation<BookmarkResponse, Error, number>({
    mutationFn: (feedId: number) => toggleFeedBookmark(feedId),
    onMutate: async (feedId) => {
      // ui 업뎃
      toggleBookmark(feedId)
    },
    onSuccess: () => {
      console.log('북마크 성공')
    },
    onError: (error, feedId) => {
      // 실패 시 원상복구
      console.error('북마크 처리 실패:', error)
      toggleBookmark(feedId)
    },
  })
}

// 팔로우 기능 훅
export const useFollowMutation = () => {
  const { toggleFollow } = useFeedStore()
  const queryClient = useQueryClient()

  return useMutation<FollowResponse, Error, number>({
    mutationFn: (userId: number) => toggleUserFollow(userId),
    onMutate: async (userId) => {
      // 쿼리 무효화 방지
      await queryClient.cancelQueries({ queryKey: ['feeds'] })

      // 스토어는 컴포넌트에서 직접 업데이트하므로 여기서는 생략
      return { userId }
    },
    onSuccess: () => {
      console.log('팔로우 성공')
    },
    onError: (error, userId) => {
      console.error('팔로우 처리 중 오류:', error)
      toggleFollow(userId)
    },
  })
}
