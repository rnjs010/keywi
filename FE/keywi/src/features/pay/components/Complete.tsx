import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import MainButton from '@/components/MainButton'
import { colors } from '@/styles/colors'
import { CheckCircleSolid } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'
import { usePayStore } from '@/stores/payStore'

const Container = tw.div`
  flex flex-col items-center justify-center h-screen px-4
`

export default function Complete() {
  const navigate = useNavigate()
  const resetState = usePayStore((state) => state.resetState)
  const nickname = '규리몽땅'

  const handleNext = () => {
    resetState()
    navigate('/home')
  }

  return (
    <Container>
      <div className="flex flex-col items-center py-56 text-center">
        <CheckCircleSolid height={`5rem`} width={`5rem`} color={colors.kiwi} />
        <Text variant="title2" weight="bold" color="black">
          {nickname}님
          <br />
          계좌 연결을 완료했어요
        </Text>
      </div>

      <div className="w-full mt-auto mb-12">
        <MainButton text="확인" onClick={handleNext}></MainButton>
      </div>
    </Container>
  )
}
