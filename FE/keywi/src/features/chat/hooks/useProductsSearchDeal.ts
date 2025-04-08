import { useQuery } from '@tanstack/react-query'
import { BoardItemUsingInfo } from '@/interfaces/BoardInterface'
import { searchProductsDeal } from '../sevices/dealService'

export const useProductSearchDeal = (
  categoryId: number,
  searchTerm: string,
  enabled: boolean,
) => {
  return useQuery<BoardItemUsingInfo[]>({
    queryKey: ['productSearchDeal', categoryId, searchTerm],
    queryFn: () => searchProductsDeal(categoryId, searchTerm),
    enabled: enabled && !!searchTerm.trim(), // 빈 문자열에서는 쿼리 비활성화
    staleTime: 1000 * 60, // 1분간 캐시
  })
}
