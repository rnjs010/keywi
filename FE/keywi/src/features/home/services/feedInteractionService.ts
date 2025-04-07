import apiRequester from '@/services/api'

// 좋아요 토글
export interface LikeResponse {
  feedId: number
  likeCount: number
  liked: boolean
}

export const toggleFeedLike = async (feedId: number): Promise<LikeResponse> => {
  const response = await apiRequester.post<LikeResponse>(
    `/api/feed/${feedId}/like`,
  )
  console.log('좋아요 토글 성공:', response.data)
  return response.data
}

// 북마크 토글
export interface BookmarkResponse {
  feedId: number
  bookmarkCount: number
  bookmarked: boolean
}

export const toggleFeedBookmark = async (
  feedId: number,
): Promise<BookmarkResponse> => {
  const response = await apiRequester.post<BookmarkResponse>(
    `/api/feed/${feedId}/bookmark`,
  )
  console.log('북마크 토글 성공:', response.data)
  return response.data
}

// 팔로우 토글
export interface FollowResponse {
  targetUserId: number
  followed: boolean
}

export const toggleUserFollow = async (
  userId: number,
): Promise<FollowResponse> => {
  const response = await apiRequester.post<FollowResponse>(
    `/api/feed/follow/${userId}`,
  )
  console.log('팔로우 api 성공:', response.data)
  return response.data
}
