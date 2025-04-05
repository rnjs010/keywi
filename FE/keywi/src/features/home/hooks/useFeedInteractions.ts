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
  const queryClient = useQueryClient()
  const { toggleLike } = useFeedStore()

  return useMutation<LikeResponse, Error, number>({
    mutationFn: (feedId: number) => toggleFeedLike(feedId),
    onMutate: async (feedId) => {
      // ui 업뎃
      toggleLike(feedId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] })
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
  const queryClient = useQueryClient()
  const { toggleBookmark } = useFeedStore()

  return useMutation<BookmarkResponse, Error, number>({
    mutationFn: (feedId: number) => toggleFeedBookmark(feedId),
    onMutate: async (feedId) => {
      // ui 업뎃
      toggleBookmark(feedId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] })
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
  const queryClient = useQueryClient()

  return useMutation<FollowResponse, Error, number>({
    mutationFn: (userId: number) => toggleUserFollow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] })
    },
  })
}
