import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import MainButton from '@/components/MainButton'

const Container = tw.div`
  rounded-xl overflow-hidden border border-gray w-56
`

const TopBox = tw.div`
  bg-lightKiwi p-3 flex flex-col justify-between
`

const BottomBox = tw.div`
  bg-white p-3
`

export default function DealMessage() {
  return (
    <Container>
      <TopBox>
        <div className="flex flex-row justify-between mb-4">
          <Text variant="body1" weight="bold" color="black">
            거래요청
          </Text>
          <div className="text-[#99cd93] opacity-70">
            <Text variant="caption1" weight="regular">
              pay
            </Text>
          </div>
        </div>
        <div className="flex justify-end">
          <img src="/chatIcons/salary.png" alt="Money bag" />
        </div>
      </TopBox>
      <BottomBox>
        <Text variant="caption1" weight="regular" color="black">
          텐저린님이 우리 5459(권규*)로
          <br />
          523,000원을 송금 요청했어요.
        </Text>
        <MainButton text="거래 진행하기" className="mt-3" />
      </BottomBox>
    </Container>
  )
}
