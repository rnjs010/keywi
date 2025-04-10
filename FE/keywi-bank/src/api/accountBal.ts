import axios from 'axios'

interface BalanceRequest {
  userId: number
  accountNo: string
}

interface BalanceResponse {
  Header: {
    responseCode: string
    responseMessage: string
  }
  REC: {
    bankCode: string
    accountNo: string
    accountBalance: string
    accountCreatedDate: string
    accountExpiryDate: string
    lastTransactionDate: string
    currency: string
  }
}

export const fetchAccountBalance = async (
  payload: BalanceRequest,
): Promise<BalanceResponse> => {
  const response = await axios.post<BalanceResponse>(
    'https://j12e202.p.ssafy.io/api/financial/account/balance',
    payload,
  )
  return response.data
}
