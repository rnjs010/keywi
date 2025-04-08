import { useQuery } from '@tanstack/react-query'
import { BoardItemUsingInfo } from '@/interfaces/BoardInterface'
import { getCategoryAllProducts } from '../sevices/dealService'

export const useProductsAllDeal = (categoryId: number, categoryName: string) =>
  useQuery<BoardItemUsingInfo[]>({
    queryKey: ['all-products', categoryId],
    queryFn: async () => {
      const products = await getCategoryAllProducts(categoryId)
      return products.map((p) => ({ ...p, categoryName }))
    },
    enabled: !!categoryId,
  })
