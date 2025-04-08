// 상품 찜 등록/해재 훅
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleProductFavorite } from '../services/feedProductService'

export const useProductFavorite = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: toggleProductFavorite,
    onSuccess: () => {
      // 찜 관련 쿼리 무효화 (필요시)
      queryClient.invalidateQueries({ queryKey: ['products', 'favorites'] })
    },
  })

  return mutation
}
