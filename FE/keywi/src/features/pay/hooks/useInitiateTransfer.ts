import { useMutation } from '@tanstack/react-query'
import {
  initiateTransfer,
  InitiateTransferRequest,
  InitiateTransferResponse,
} from '../services/payService'

export const useInitiateTransfer = () => {
  return useMutation<InitiateTransferResponse, Error, InitiateTransferRequest>({
    mutationFn: initiateTransfer,
  })
}
