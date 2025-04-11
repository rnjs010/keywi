import { Transaction } from '@/api/transactions'
import tw from 'twin.macro'
import styled from '@emotion/styled'

const Tr = tw.tr`border-t last:border-b`
const Td = tw.td`px-4 py-3 text-sm`
const NameCell = tw(Td)``
const DateCell = tw(Td)`text-blue-900`
const AmountCell = tw(Td)` font-semibold`
const AmountWrapper = styled.div(({ type }: { type: 'in' | 'out' }) => [
  tw`inline-flex items-center gap-1`,
  type === 'in' ? tw`text-green-600` : tw`text-red-600`,
])

function formatDate(dateString: string) {
  const year = dateString.slice(0, 4)
  const month = dateString.slice(4, 6)
  const day = dateString.slice(6, 8)
  return `${year}.${month}.${day}`
}

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isDeposit = transaction.transactionType === '1'
  const amount = Number(transaction.transactionBalance).toLocaleString()
  const formattedDate = formatDate(transaction.transactionDate)

  return (
    <Tr>
      <DateCell>{formattedDate}</DateCell>
      <NameCell>{transaction.transactionTypeName}</NameCell>
      <NameCell>{transaction.transactionSummary}</NameCell>
      <AmountCell>
        <AmountWrapper type={isDeposit ? 'in' : 'out'}>
          <span>{isDeposit ? `₩ ${amount}` : `₩ ${amount}`}</span>
        </AmountWrapper>
      </AmountCell>
    </Tr>
  )
}
