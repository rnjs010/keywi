import { useMutation } from '@tanstack/react-query'
import {
  verifyTransferCode,
  VerifyTransferCodeRequest,
  VerifyTransferCodeResponse,
} from '../services/payService'

export const useVerifyTransferCode = () => {
  return useMutation<
    VerifyTransferCodeResponse,
    Error,
    VerifyTransferCodeRequest
  >({
    mutationFn: verifyTransferCode,
  })
}
