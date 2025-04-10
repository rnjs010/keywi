import { useMutation } from '@tanstack/react-query'
import { acceptTrade, AcceptTradeRequest } from '../../sevices/tradeService'

export const useAcceptTrade = () => {
  return useMutation<unknown, Error, AcceptTradeRequest>({
    mutationFn: acceptTrade,
  })
}
