import DealListScreen from '@/features/chat/components/DealAccept/DealListScreen'
import PasswordScreen from '@/features/chat/components/DealAccept/PasswordScreen'
import AcceptCompleteScreen from '@/features/chat/components/DealAccept/AcceptCompleteScreen'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { Xmark } from 'iconoir-react'
import { useDealAcceptStore } from '@/stores/chatStore'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import SafePaymentScreen from '@/features/chat/components/DealAccept/SafePaymentScreen'
import { useDealReceipt } from '@/features/chat/hooks/useDealReceipt'
import { useContext } from 'react'
import LoadingMessage from '@/components/message/LoadingMessage'
import ErrorMessage from '@/components/message/ErrorMessage'
import { WebSocketContext } from '@/services/WebSocketProvider'
import { useChatSubscription } from '@/features/chat/hooks/useChatSub'
import { useUserStore } from '@/stores/userStore'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden
`

const HeaderContainer = tw.div`
  relative flex justify-center items-center p-4
`

export default function DealAcceptPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { messageId } = location.state || {}
  const { roomId } = useParams()
  const step = useDealAcceptStore((state) => state.step)
  const setReceipt = useDealAcceptStore((state) => state.setReceipt)
  const resetState = useDealAcceptStore((state) => state.resetState)
  const headerText = ['거래 진행', '안심 결제', '안심 결제', ''][step - 1]
  const { data, isLoading, isError } = useDealReceipt(messageId)
  const { client } = useContext(WebSocketContext)
  const myId = useUserStore((state) => state.userId)

  if (data) {
    // resetState()
    setReceipt(data)
  }

  useChatSubscription({
    roomId: roomId!,
  })

  const handleClick = () => {
    const messageBody = {
      roomId,
      messageType: 'DEALPROGRESS',
      content: '',
      items: null,
      senderId: myId,
    }

    if (client?.connected && roomId && myId) {
      client.publish({
        destination: '/app/chat/message',
        body: JSON.stringify(messageBody),
        headers: {
          'X-User-ID': myId?.toString() || '',
        },
      })
    }
    navigate(`/chat/${roomId}`)
  }

  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return <DealListScreen />
      case 2:
        return <SafePaymentScreen />
      case 3:
        return <PasswordScreen />
      case 4:
        return <AcceptCompleteScreen onConfirm={handleClick} />
      default:
        return null
    }
  }

  const handleClose = () => {
    resetState()
    navigate(`/chat/${roomId}`)
  }

  if (isLoading)
    return (
      <Container>
        <LoadingMessage />
      </Container>
    )
  if (isError)
    return (
      <Container>
        <ErrorMessage text="정보를 불러오지 못했습니다." />
      </Container>
    )

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
