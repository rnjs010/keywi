import { useMutation } from '@tanstack/react-query'
import { verifyPaymentPassword } from '@/features/chat/sevices/dealService'

export const useVerifyPassword = () => {
  return useMutation({
    mutationFn: verifyPaymentPassword,
  })
}
