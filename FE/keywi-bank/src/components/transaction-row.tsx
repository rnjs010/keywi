import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import type { Transaction } from '@/types/banking'

interface TransactionRowProps {
  transaction: Transaction
  usdToKrwRate: number
}

export function TransactionRow({
  transaction,
  usdToKrwRate,
}: TransactionRowProps) {
  const isDeposit = transaction.amount > 0
  const formattedAmount = Math.round(
    Math.abs(transaction.amount) * usdToKrwRate,
  ).toLocaleString('ko-KR')

  return (
    <tr className="hover:bg-blue-50">
      <td className="px-4 py-3 text-sm text-gray-700">{transaction.date}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{transaction.name}</td>
      <td className="px-4 py-3 text-sm text-right font-medium flex justify-end items-center">
        {isDeposit ? (
          <>
            <ArrowDownIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+₩{formattedAmount}</span>
          </>
        ) : (
          <>
            <ArrowUpIcon className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-red-600">-₩{formattedAmount}</span>
          </>
        )}
      </td>
    </tr>
  )
}
