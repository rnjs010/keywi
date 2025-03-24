import MainButton from '@/components/MainButton'
import { useNavigate } from 'react-router-dom'
import tw from 'twin.macro'

const BtnWrapper = tw.div`
  mt-auto
  mb-16
  w-full
`

export default function CompleteBtn() {
  const navigate = useNavigate()

  return (
    <BtnWrapper>
      <MainButton
        text="키위 시작하기"
        disabled={false}
        onClick={() => navigate('/home')}
      />
    </BtnWrapper>
  )
}
