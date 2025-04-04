import { FeedSearchProduct } from '@/interfaces/HomeInterfaces'
import { useQuery } from '@tanstack/react-query'
import { getSearchProducts } from '../services/feedProductService'

export const useFeedProductSearch = (searchTerm: string, enabled: boolean) => {
  return useQuery<FeedSearchProduct[]>({
    queryKey: ['FeedProductSearch', searchTerm],
    queryFn: () => getSearchProducts(searchTerm),
    enabled: enabled && !!searchTerm.trim(), // 빈문자열에서는 쿼리 비활성화
    staleTime: 1000 * 60, // 1분간 캐시
  })
}
