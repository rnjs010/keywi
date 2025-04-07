import { useState, useEffect } from 'react'
import { CommentData } from '@/interfaces/HomeInterfaces'
import { getComments, createComment } from '../services/commentService'

export const useComments = (feedId: number) => {
  const [comments, setComments] = useState<CommentData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // 댓글 목록 가져오기
  const fetchComments = async () => {
    try {
      setIsLoading(true)
      const data = await getComments(feedId)
      setComments(data)
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('댓글을 불러오는데 실패했습니다'),
      )
    } finally {
      setIsLoading(false)
    }
  }

  // 컴포넌트 마운트 시 댓글 가져오기
  useEffect(() => {
    if (feedId) {
      fetchComments()
    }
  }, [feedId])

  // 댓글 작성하기
  const submitComment = async (content: string) => {
    if (!content.trim() || !feedId) return

    try {
      const newComment = await createComment(feedId, content)
      if (newComment) {
        setComments((prev) => [...prev, newComment])
      }
    } catch (err) {
      console.error('댓글 작성 실패:', err)
    }
  }

  return {
    comments,
    isLoading,
    error,
    submitComment,
    refreshComments: fetchComments,
  }
}
