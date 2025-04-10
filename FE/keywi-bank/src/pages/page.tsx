'use client'

import { useEffect, useState } from 'react'
import { UserTypeSelector } from '@/components/user-type-selector'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BalanceCard } from '@/components/balance-card'
import { TransactionHistory } from '@/components/transaction-history'
import { UserType } from '@/types/banking'
import { fetchTransactions, Transaction } from '@/api/transactions'
import { fetchAccountBalance } from '@/api/accountBal'
import { fetchBankAccount } from '@/api/getAccount'

export default function BankPage() {
  // 거래 내역
  const [transactions, setTransactions] = useState<Transaction[]>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTransactions({
          userId: 4,
          accountNo: '0203887137825809',
        })
        setTransactions(data.REC.list)
      } catch (err) {
        console.error('거래 내역 불러오기 실패', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // 잔액
  const [balance, setBalance] = useState<string | null>(null)
  const [isBalLoading, setIsBalLoading] = useState(true)

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const data = await fetchAccountBalance({
          userId: 4,
          accountNo: '0203887137825809',
        })
        setBalance(data.REC.accountBalance)
      } catch (err) {
        console.error('계좌 잔액 조회 실패', err)
      } finally {
        setIsBalLoading(false)
      }
    }

    loadBalance()
  }, [])

  // 계좌번호 은행
  const [accountInfo, setAccountInfo] = useState<{
    accountNo: string
    bankCode: string
  } | null>(null)

  const [isAccLoading, setIsAccLoading] = useState(true)

  useEffect(() => {
    const loadAccountInfo = async () => {
      try {
        const data = await fetchBankAccount(4) // 예시 userId: 1
        setAccountInfo(data)
      } catch (err) {
        console.error('계좌 정보 조회 실패', err)
      } finally {
        setIsAccLoading(false)
      }
    }

    loadAccountInfo()
  }, [])

  // if (isAccLoading) return <div>Loading...</div>
  // if (!accountInfo) return <div>계좌 정보가 없습니다.</div>
  // if (isLoading) return <div>Loading...</div>
  // if (isBalLoading) return <div>Loading...</div>

  const [userType, setUserType] = useState<UserType>('assembler')

  // USD to KRW conversion rate
  const usdToKrwRate = 1350 // Example rate: 1 USD = 1,350 KRW

  // Mock data for balance and transactions
  const balances = {
    assembler: 5280.42,
    buyer: 12450.89,
    corporation: 87650.32,
  }

  return (
    <>
      <div className="p-4 border rounded bg-white shadow">
        <h2 className="text-lg font-semibold mb-2">계좌 정보</h2>
        <p className="text-blue-800">계좌번호: {accountInfo?.accountNo}</p>
        <p className="text-blue-800">은행코드: {accountInfo?.bankCode}</p>
      </div>

      <div className="p-4 border rounded bg-white shadow">
        <h2 className="text-lg font-semibold mb-2">계좌 잔액</h2>
        <p className="text-xl text-blue-800 font-bold">
          ₩{parseInt(balance ?? '0').toLocaleString('ko-KR')}
        </p>
      </div>

      <h2 className="text-lg font-semibold mb-4">거래 내역</h2>
      <ul className="space-y-2">
        {transactions &&
          transactions.map((tx: any) => (
            <li key={tx.transactionUniqueNo} className="border p-4 rounded">
              <div className="font-bold">{tx.transactionTypeName}</div>
              <div>
                {tx.transactionDate} {tx.transactionTime}
              </div>
              <div>
                금액: ₩{parseInt(tx.transactionBalance).toLocaleString('ko-KR')}
              </div>
              <div>메모: {tx.transactionSummary}</div>
            </li>
          ))}
      </ul>
    </>
  )
}
