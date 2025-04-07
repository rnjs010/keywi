import apiRequester from '@/services/api'
import { CommentData } from '@/interfaces/HomeInterfaces'
import getTimeDiff from '@/utils/getTimeDiff'

interface CommentAuthor {
  id: number
  nickname: string
  profileImageUrl: string | null
  bio: string
  followed: boolean
}

interface CommentResponse {
  id: number
  feedId: number
  author: CommentAuthor
  content: string
  createdAt: string
  mentionedUserIds: number[]
}

// 댓글 API 응답을 UI에서 사용하는 형태로 변환하는 함수
const transformComment = (comment: CommentResponse): CommentData => {
  return {
    id: comment.id,
    username: comment.author.nickname,
    profileImage:
      comment.author.profileImageUrl || '/default/default_product.png',
    content: comment.content,
    timeAgo: getTimeDiff(comment.createdAt),
    authorId: comment.author.id,
    // 이후 mentionedUser 구현 시 추가
  }
}

// 피드 댓글 조회 API
export const getComments = async (feedId: number): Promise<CommentData[]> => {
  try {
    const response = await apiRequester.get<CommentResponse[]>(
      `/api/feed/${feedId}/comments`,
    )
    // 시간순으로 정렬 (오래된 댓글 -> 최신 댓글 순)
    const sortedComments = response.data.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    return sortedComments.map(transformComment)
  } catch (error) {
    console.error('댓글 조회 중 오류 발생:', error)
    return []
  }
}

// 댓글 작성 요청 인터페이스
interface CreateCommentRequest {
  content: string
  mentionedUserIds: number[]
}

// 댓글 작성 API
export const createComment = async (
  feedId: number,
  content: string,
): Promise<CommentData | null> => {
  try {
    const requestData: CreateCommentRequest = {
      content,
      mentionedUserIds: [], // 현재는 멘션 기능 미구현으로 빈 배열
    }

    const response = await apiRequester.post<CommentResponse>(
      `/api/feed/${feedId}/comments`,
      requestData,
    )

    return transformComment(response.data)
  } catch (error) {
    console.error('댓글 작성 중 오류 발생:', error)
    return null
  }
}
