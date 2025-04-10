import { useMutation } from '@tanstack/react-query'
import { completeTrade, CompleteTradeRequest } from '../../sevices/tradeService'

export const useCompleteTrade = () => {
  return useMutation({
    mutationFn: (payload: CompleteTradeRequest) => completeTrade(payload),
  })
}
