import { useQuery } from '@tanstack/react-query'
import { getFavoriteProducts } from '../services/boardService'
import { BoardItemUsingInfo } from '@/interfaces/BoardInterface'

export const useFavoriteProducts = (categoryId: number, categoryName: string) =>
  useQuery<BoardItemUsingInfo[]>({
    queryKey: ['favorite-products', categoryId],
    queryFn: async () => {
      const products = await getFavoriteProducts(categoryId)
      return products.map((p) => ({ ...p, categoryName }))
    },
    enabled: !!categoryId,
  })
