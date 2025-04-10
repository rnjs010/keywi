import { DollarSign } from 'lucide-react'

interface BalanceCardProps {
  balance: number
  usdToKrwRate: number
}

export function BalanceCard({ balance, usdToKrwRate }: BalanceCardProps) {
  const formattedBalance = Math.round(balance * usdToKrwRate).toLocaleString(
    'ko-KR',
  )

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4 text-blue-800">
        Current Balance
      </h2>
      <div className="bg-white rounded-lg p-6 border border-blue-200 shadow-sm">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium">
              Available Balance
            </p>
            <p className="text-3xl font-bold text-blue-800">
              ₩{formattedBalance}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
