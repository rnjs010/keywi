import { useQuery } from '@tanstack/react-query'
import { getPaymentAccount } from '../sevices/dealService'

export const useAccount = () => {
  return useQuery({
    queryKey: ['paymentAccount'],
    queryFn: getPaymentAccount,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  })
}
