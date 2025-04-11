import { Transaction } from '@/api/transactions'
import { TransactionRow } from './transaction-row'
import tw from 'twin.macro'

const Container = tw.div`mb-8`
const Label = tw.h2`mb-3 text-[30px] font-semibold text-blue-800 text-left`
const TableContainer = tw.div`rounded-lg border border-blue-200 h-80 overflow-y-auto`
const Table = tw.table`w-full text-left border-collapse`
const Thead = tw.thead`bg-blue-50`
const Th = tw.th`py-3 px-4 text-sm font-semibold text-blue-800`
const Tbody = tw.tbody`bg-white`

export function TransactionHistory({
  transactions,
}: {
  transactions: Transaction[]
}) {
  return (
    <Container>
      <Label>전체 입출금 내역</Label>
      <TableContainer>
        <Table>
          <Thead>
            <tr>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th>Content</Th>
              <Th>Amount</Th>
            </tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction) => (
              <TransactionRow
                key={transaction.transactionUniqueNo}
                transaction={transaction}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  )
}
