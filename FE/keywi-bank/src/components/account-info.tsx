import tw from 'twin.macro'

const Container = tw.div`mb-8`
const Label = tw.h2`mb-3 text-[30px] font-semibold text-blue-800 text-left`
const Card = tw.div`rounded-lg border border-blue-400 px-6 py-4`
const CardContent = tw.div`flex items-center gap-2`
const BalanceAmount = tw.p`text-[20px] font-extrabold text-blue-900 my-2`
const TextContent = tw.div`flex flex-col justify-start items-start`

export function AccountInfo({
  account,
  code,
}: {
  account: string
  code: string
}) {
  return (
    <Container>
      <Label>계좌 정보</Label>
      <Card>
        <CardContent>
          <TextContent>
            <BalanceAmount>계좌 번호 : {account}</BalanceAmount>
            <BalanceAmount>은행 코드 : {code}</BalanceAmount>
          </TextContent>
        </CardContent>
      </Card>
    </Container>
  )
}
