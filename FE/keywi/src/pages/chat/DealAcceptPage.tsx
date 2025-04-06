import DealListScreen from '@/features/chat/components/DealAccept/DealListScreen'
import PasswordScreen from '@/features/chat/components/DealAccept/PasswordScreen'
import AcceptCompleteScreen from '@/features/chat/components/DealAccept/AcceptCompleteScreen'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { Xmark } from 'iconoir-react'
import { useDealAcceptStore } from '@/stores/chatStore'
import { useNavigate, useParams } from 'react-router-dom'
import SafePaymentScreen from '@/features/chat/components/DealAccept/SafePaymentScreen'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden
`

const HeaderContainer = tw.div`
  relative flex justify-center items-center p-4
`

export default function DealAcceptPage() {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const step = useDealAcceptStore((state) => state.step)
  const resetState = useDealAcceptStore((state) => state.resetState)

  const headerText = ['거래 진행', '안심 결제', '안심 결제', ''][step - 1]

  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return <DealListScreen />
      case 2:
        return <SafePaymentScreen />
      case 3:
        return <PasswordScreen />
      case 4:
        return <AcceptCompleteScreen />
      default:
        return null
    }
  }

  const handleClose = () => {
    resetState()
    navigate(`/chat/${roomId}`)
  }

  return (
    <Container>
      {step !== 4 && (
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
