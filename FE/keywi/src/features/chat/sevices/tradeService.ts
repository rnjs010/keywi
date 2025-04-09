import apiRequester from '@/services/api'

// 거래 수락
export interface AcceptTradeRequest {
  escrowTransactionId: number
  paymentPassword: string
}

export const acceptTrade = async (
  payload: AcceptTradeRequest,
): Promise<any> => {
  const { data } = await apiRequester.post('/api/payment/accept', payload)
  return data
}

// 거래 완료
export interface CompleteTradeRequest {
  escrowTransactionId: number
}

export const completeTrade = async (
  payload: CompleteTradeRequest,
): Promise<any> => {
  const { data } = await apiRequester.post('/api/payment/complete', payload)
  return data
}
