import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BoardCardData } from '@/interfaces/BoardInterface'
import {
  changeBoardStatus,
  getMyBoardList,
  ratingBoard,
} from '../services/mypageBoardService'

// 게시글 목록 관련 쿼리 키
export const myboardKeys = {
  all: ['boards'] as const,
  lists: () => [...myboardKeys.all, 'list'] as const,
  userBoards: (userId: number) => [...myboardKeys.lists(), userId] as const,
}

// 게시글 목록 조회 훅
export const useMyBoardList = (
  userId: number,
  page: number = 0,
  size: number = 10,
) => {
  return useQuery<BoardCardData[], Error>({
    queryKey: myboardKeys.userBoards(userId),
    queryFn: () => getMyBoardList(userId, page, size),
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
  })
}

// 상태 변경 훅
export const useChangeBoardStatus = (userId?: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      boardId,
      currentStatus,
    }: {
      boardId: number
      currentStatus: string
    }) => {
      // 현재 상태에 따라 다음 상태 결정
      let nextStatus = 'IN_PROGRESS'
      if (currentStatus === 'IN_PROGRESS') {
        nextStatus = 'COMPLETED'
      }

      return changeBoardStatus(boardId, nextStatus)
    },
    onSuccess: () => {
      // 특정 사용자의 게시물 목록 갱신
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: myboardKeys.userBoards(userId),
        })
      } else {
        // 전체 목록 갱신
        queryClient.invalidateQueries({ queryKey: myboardKeys.lists() })
      }
    },
  })
}

// 별점 제출 훅
export const useRatingBoard = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      boardId,
      targetUserId,
      rating,
    }: {
      boardId: number
      targetUserId: number
      rating: number
    }) => {
      return ratingBoard(boardId, targetUserId, rating)
    },
    onSuccess: () => {
      // 성공 시 게시글 목록 갱신
      queryClient.invalidateQueries({ queryKey: myboardKeys.lists() })
    },
  })
}
