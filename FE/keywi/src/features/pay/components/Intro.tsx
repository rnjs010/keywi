import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { PiggyBank } from 'iconoir-react'
import { usePayStore } from '@/stores/payStore'
import MainButton from '@/components/MainButton'
import { colors } from '@/styles/colors'

const Container = tw.div`
  flex flex-col items-center justify-center h-screen px-4
`

export default function Intro() {
  const setStep = usePayStore((state) => state.setStep)

  const handleNext = () => {
    setStep(2)
  }

  return (
    <Container>
      <div className="flex flex-col items-center py-56 text-center">
        <PiggyBank height={`10rem`} width={`10rem`} color={colors.darkKiwi} />
        <Text variant="title2" weight="bold" color="black">
          결제를 위해 가지고 계신
          <br />
          통장을 연결할게요
        </Text>
      </div>

      <div className="w-full mt-auto mb-12">
        <MainButton text="확인" onClick={handleNext}></MainButton>
      </div>
    </Container>
  )
}
