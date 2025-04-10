import apiRequester from '@/services/api'

// 1원 송금
export interface InitiateTransferRequest {
  accountNo: string
  bankCode: string
}

export interface InitiateTransferResponse {
  Header: {
    responseCode: string
    responseMessage: string
  }
  REC: {
    userKey: string
    accountNo: string
    bankCode: string
  } | null
}

export const initiateTransfer = async (
  payload: InitiateTransferRequest,
): Promise<InitiateTransferResponse> => {
  const { data } = await apiRequester.post<InitiateTransferResponse>(
    '/api/payment/transfer/initiate',
    payload,
  )
  return data
}

// 1원 송금 검증
export interface VerifyTransferCodeRequest {
  accountNo: string
  bankCode: string
  authCode: string
}

export interface VerifyTransferCodeResponse {
  Header: {
    responseCode: string
    responseMessage: string
  }
  REC: {
    status: string
    transactionUniqueNo: string
    accountNo: string
  }
}

export const verifyTransferCode = async (
  payload: VerifyTransferCodeRequest,
): Promise<VerifyTransferCodeResponse> => {
  const { data } = await apiRequester.post<VerifyTransferCodeResponse>(
    '/api/financial/transfer/onewon/verify',
    payload,
  )
  return data
}

// 계좌 등록
export interface ConnectAccountRequest {
  userId: number
  rawPassword: string
  accountNo: string
  bankCode: string
}

export const connectAccount = async (
  payload: ConnectAccountRequest,
): Promise<any> => {
  const { data } = await apiRequester.post('/api/payment/connect', payload)
  return data
}
