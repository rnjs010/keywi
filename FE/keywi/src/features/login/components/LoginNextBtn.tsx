import MainButton from '@/components/MainButton'
import tw from 'twin.macro'
import { useLogin } from '../services/LoginContext'
import { useNavigate } from 'react-router-dom'

const BtnWrapper = tw.div`
  mt-auto
  mb-16
  w-full
`

export default function LoginNextBtn() {
  const { nickname } = useLogin()
  const isDisabled = nickname.length < 2
  const navigate = useNavigate()

  const handleNext = () => {
    if (!isDisabled) {
      navigate('/login/complete')
    }
  }

  return (
    <BtnWrapper>
      <MainButton text="다음" disabled={isDisabled} onClick={handleNext} />
    </BtnWrapper>
  )
}
