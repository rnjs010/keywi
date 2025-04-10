import { useMutation } from '@tanstack/react-query'
import { connectAccount, ConnectAccountRequest } from '../services/payService'

export const useConnectAccount = () => {
  return useMutation<unknown, Error, ConnectAccountRequest>({
    mutationFn: connectAccount,
  })
}
