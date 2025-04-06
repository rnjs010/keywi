import { useEffect, useState } from 'react'
import { getBoardDetail } from '../services/boardService'
import { BoardDetailData } from '@/interfaces/BoardInterface'

export const useBoardDetail = (boardId: number) => {
  const [data, setData] = useState<BoardDetailData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        setLoading(true)
        const response = await getBoardDetail(boardId)
        setData(response)
      } catch (err) {
        setError('게시글을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchBoardDetail()
  }, [boardId])

  return { data, loading, error }
}
