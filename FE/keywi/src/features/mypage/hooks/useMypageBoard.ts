import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BoardCardData } from '@/interfaces/BoardInterface'
import {
  changeBoardStatus,
  getBoardReceipt,
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

// 별점 제출 훅 (영수증에서 조립자 ID 가져오기)
export const useRatingBoard = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      boardId,
      rating,
    }: {
      boardId: number
      rating: number
    }) => {
      // 1. 먼저 영수증 정보를 가져와서 조립자 ID 얻기
      const receipts = await getBoardReceipt(boardId)

      // 영수증이 없는 경우 오류 발생
      if (!receipts || receipts.length === 0) {
        throw new Error('영수증 정보를 찾을 수 없습니다.')
      }

      // 첫 번째 영수증의 조립자 ID 사용
      const assemblerId = receipts[0].assemblerId

      // 2. 별점 제출 API 호출
      return ratingBoard(boardId, assemblerId, rating)
    },
    onSuccess: () => {
      // 성공 시 게시글 목록 갱신
      queryClient.invalidateQueries({ queryKey: myboardKeys.lists() })
    },
  })
}

// 별점 제출 여부 확인 훅
export const useCheckRatingExists = (boardId: number, enabled = true) => {
  return useQuery<boolean>({
    queryKey: [...myboardKeys.all, 'rating', boardId],
    queryFn: async () => {
      try {
        // 별점 제출 여부 확인 API (없는 경우 아래 로직으로 대체)
        // 실제 API가 없는 경우 영수증 API를 활용하여 간접적으로 확인

        // const receipts = await getBoardReceipt(boardId)

        // 별점 확인 로직 (이 부분은 API에 따라 조정 필요)
        // 현재는 영수증이 있고 상태가 COMPLETED면 별점 제출 가능으로 간주
        return false // 기본값으로 false 반환하여 별점 버튼 표시
      } catch (error) {
        console.error('별점 제출 여부 확인 실패:', error)
        return false
      }
    },
    enabled: enabled, // COMPLETED 상태인 경우에만 쿼리 활성화
  })
}
