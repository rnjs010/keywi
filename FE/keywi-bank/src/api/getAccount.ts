import axios from 'axios'

interface BankAccountResponse {
  accountNo: string
  bankCode: string
}

export const fetchBankAccount = async (
  userId: number,
): Promise<BankAccountResponse> => {
  const response = await axios.get<BankAccountResponse>(
    `https://j12e202.p.ssafy.io/api/financial/account`,
    {
      params: { userId },
    },
  )
  return response.data
}
