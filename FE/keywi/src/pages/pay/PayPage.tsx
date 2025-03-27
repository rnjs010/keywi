import { usePayStore } from '@/stores/payStore'
import { useNavigate } from 'react-router-dom'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { Xmark } from 'iconoir-react'
import Intro from '@/features/pay/components/Intro'
import InputAccount from '@/features/pay/components/InputAccount'
import AuthAccount from '@/features/pay/components/AuthAccount'
import Complete from '@/features/pay/components/Complete'
import RegistPassword from '@/features/pay/components/RegistPassword'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden
`

const HeaderContainer = tw.div`
  relative flex justify-center items-center p-4
`

export default function PayPage() {
  const navigate = useNavigate()
  const step = usePayStore((state) => state.step)
  const resetState = usePayStore((state) => state.resetState)

  const headerText = [
    '',
    '계좌 입력',
    '계좌 인증',
    '비밀번호 등록',
    '비밀번호 등록',
    '',
  ][step - 1]

  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return <Intro />
      case 2:
        return <InputAccount />
      case 3:
        return <AuthAccount />
      case 4:
        return <RegistPassword />
      case 5:
        return <RegistPassword />
      case 6:
        return <Complete />
      default:
        return null
    }
  }

  const handleClose = () => {
    resetState()
    navigate('/home')
  }

  return (
    <Container>
      {step !== 1 && step !== 6 && (
        <HeaderContainer>
          <div className="absolute left-4">
            <Xmark onClick={handleClose} />
          </div>
          <Text variant="title3" weight="bold" color="black">
            {headerText}
          </Text>
        </HeaderContainer>
      )}
      {renderStepComponent()}
    </Container>
  )
}
