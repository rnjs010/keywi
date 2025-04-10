import axios from 'axios'

interface TransactionRequest {
  userId: number
  accountNo: string
}

export interface Transaction {
  transactionUniqueNo: string
  transactionDate: string
  transactionTime: string
  transactionType: string
  transactionTypeName: string
  transactionAccountNo: string
  transactionBalance: string
  transactionAfterBalance: string
  transactionSummary: string
  transactionMemo: string
}

interface TransactionResponse {
  Header: {
    responseCode: string
    responseMessage: string
  }
  REC: {
    totalCount: string
    list: Transaction[]
  }
}

export const fetchTransactions = async (
  payload: TransactionRequest,
): Promise<TransactionResponse> => {
  const response = await axios.post<TransactionResponse>(
    'https://j12e202.p.ssafy.io/api/financial/account/transactions',
    payload,
  )
  return response.data
}
