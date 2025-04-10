import type { Transaction } from '@/types/banking'
import { TransactionRow } from './transaction-row'

interface TransactionHistoryProps {
  transactions: Transaction[]
  usdToKrwRate: number
}

export function TransactionHistory({
  transactions,
  usdToKrwRate,
}: TransactionHistoryProps) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4 text-blue-800">
        Transaction History
      </h2>
      <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-blue-800">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-blue-800">
                  Name
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-blue-800">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  usdToKrwRate={usdToKrwRate}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
