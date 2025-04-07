//NOTE - 피드 태그용 상품 검색
import { useQuery } from '@tanstack/react-query'
import { getSearchProducts } from '../services/feedProductService'
import { FeedSearchProduct } from '@/interfaces/HomeInterfaces'

export const useFeedProductSearch = (searchTerm: string, enabled: boolean) => {
  return useQuery<FeedSearchProduct[]>({
    queryKey: ['FeedProductSearch', searchTerm],
    queryFn: () => getSearchProducts(searchTerm),
    enabled: enabled && searchTerm.trim().length > 0,
    staleTime: 1000 * 60, // 1분간 캐시
    retry: 1, // 실패 시 한 번만 재시도
  })
}
