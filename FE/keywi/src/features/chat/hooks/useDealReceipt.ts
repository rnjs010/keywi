import { useQuery } from '@tanstack/react-query'
import { getDealReceipt } from '../sevices/dealService'
import { ReceiptData } from '@/interfaces/ChatInterfaces'

export const useDealReceipt = (messageId: string) => {
  return useQuery<ReceiptData>({
    queryKey: ['dealReceipt', messageId],
    queryFn: () => getDealReceipt(messageId),
    enabled: !!messageId, // messageId가 있을 때만 쿼리 실행
    staleTime: 1000 * 60, // 1분 동안은 stale 상태 아님
    retry: 1, // 실패 시 한 번만 재시도
    refetchOnWindowFocus: false, // 창 전환 시 재요청 안 함
  })
}
