import { useQuery } from '@tanstack/react-query'
import { getBoardList } from '../services/boardService'
import { BoardCardData } from '@/interfaces/BoardInterface'

// 게시글 목록 관련 쿼리 키
export const boardKeys = {
  all: ['boards'] as const,
  lists: () => [...boardKeys.all, 'list'] as const,
}

// 게시글 목록 조회 훅
export const useBoardList = () => {
  return useQuery<BoardCardData[], Error>({
    queryKey: boardKeys.lists(),
    queryFn: getBoardList,
  })
}
