import { useQuery } from '@tanstack/react-query'
import { searchProducts } from '../services/boardService'
import { BoardItemUsingInfo } from '@/interfaces/BoardInterface'

export const useProductSearch = (
  categoryId: number,
  searchTerm: string,
  enabled: boolean,
) => {
  return useQuery<BoardItemUsingInfo[]>({
    queryKey: ['productSearch', categoryId, searchTerm],
    queryFn: () => searchProducts(categoryId, searchTerm),
    enabled: enabled && !!searchTerm.trim(), // 빈 문자열에서는 쿼리 비활성화
    staleTime: 1000 * 60, // 1분간 캐시
  })
}
