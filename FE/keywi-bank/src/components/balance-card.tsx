import tw from 'twin.macro'

const Container = tw.div`mb-8`
const Label = tw.h2`mb-3 text-[30px] font-semibold text-blue-800 text-left`
const Card = tw.div`rounded-lg border border-blue-400 px-6 py-4`
const CardContent = tw.div`flex items-center gap-2`
const BalanceAmount = tw.p`text-[20px] font-extrabold text-blue-900 my-2`

export function BalanceCard({ balance }: { balance: number }) {
  const formattedBalance = balance.toLocaleString('ko-KR')

  return (
    <Container>
      <Label>계좌 잔액</Label>
      <Card>
        <CardContent>
          <BalanceAmount>₩ {formattedBalance}</BalanceAmount>
        </CardContent>
      </Card>
    </Container>
  )
}
