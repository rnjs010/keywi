import { useQuery } from '@tanstack/react-query'
import { getFavoriteProducts } from '../services/feedProductService'
import { FavoriteProduct } from '@/interfaces/HomeInterfaces'

export const useFavoriteProducts = () => {
  return useQuery<FavoriteProduct[], Error>({
    queryKey: ['favoriteProducts'],
    queryFn: getFavoriteProducts,
    staleTime: 1000 * 60 * 5, // 5분동안 데이터 캐싱
    retry: 1,
  })
}
