import MainButton from '@/components/MainButton'
import tw from 'twin.macro'
import { useLogin } from '../services/LoginContext'

const BtnWrapper = tw.div`
  mt-auto
  mb-16
  w-full
`

export default function LoginNextBtn() {
  const { nickname } = useLogin()
  const isDisabled = nickname.length < 2

  const handleNext = () => {
    if (!isDisabled) {
      // 다음 단계 진행 로직
    }
  }

  return (
    <BtnWrapper>
      <MainButton text="다음" disabled={isDisabled} onClick={handleNext} />
    </BtnWrapper>
  )
}
