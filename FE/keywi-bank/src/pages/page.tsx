import { useEffect, useState } from 'react'
import { UserTypeSelector } from '@/components/user-type-selector'
import { BalanceCard } from '@/components/balance-card'
import { TransactionHistory } from '@/components/transaction-history'
import { fetchTransactions, Transaction } from '@/api/transactions'
import { fetchAccountBalance } from '@/api/accountBal'
import { fetchBankAccount } from '@/api/getAccount'
import tw from 'twin.macro'

const Container = tw.div`max-w-screen-md mx-auto p-6 bg-white rounded-2xl shadow-md`
const Header = tw.div`bg-blue-700 text-white rounded-t-2xl px-6 py-4`
const Title = tw.h1`text-2xl font-bold`
const Subtitle = tw.p`text-sm text-blue-100`
const Section = tw.div`mt-6`

const userTypeMap: Record<string, number> = {
  '구매자(규리)': 4,
  '조립자(혜원)': 1,
  '플랫폼(키위)': 5,
}

export default function BankPage() {
  const [userType, setUserType] = useState<string>('구매자(규리)')
  const [accountInfo, setAccountInfo] = useState<{
    accountNo: string
    bankCode: string
  } | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<Transaction[] | null>(null)

  useEffect(() => {
    const loadAllData = async () => {
      const userId = userTypeMap[userType]
      try {
        const accountData = await fetchBankAccount(userId)
        setAccountInfo(accountData)

        const { accountNo } = accountData

        const [balanceData, transactionData] = await Promise.all([
          fetchAccountBalance({ userId, accountNo }),
          fetchTransactions({ userId, accountNo }),
        ])

        setBalance(balanceData.REC.accountBalance)
        setTransactions(transactionData.REC.list)
      } catch (err) {
        console.error('전체 데이터 로딩 실패', err)
      }
    }

    loadAllData()
  }, [userType])

  return (
    <>
      <Container>
        <Header>
          <Title>Banking Dashboard</Title>
          <Subtitle>거래 여부를 쉽게 확인하기 위함</Subtitle>
        </Header>

        <Section>
          <UserTypeSelector userType={userType} setUserType={setUserType} />
        </Section>

        <Section>
          <BalanceCard balance={Number(balance)} />
        </Section>

        <Section>
          <TransactionHistory transactions={transactions ?? []} />
        </Section>
      </Container>
    </>
  )
}
