import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { Xmark } from 'iconoir-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDealProductStore } from '@/stores/ChatStore'
import DealRequestForm from '@/features/chat/components/DealRequestForm'
import DealRequestConfirm from '@/features/chat/components/DealRequestConfirm'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden px-4
`

const HeaderContainer = tw.div`
  relative flex justify-center items-center py-4
`

export default function DealRequestPage() {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const step = useDealProductStore((state) => state.step)
  const resetState = useDealProductStore((state) => state.resetState)

  const handleClose = () => {
    resetState()
    navigate(`/chat/${roomId}`)
  }

  return (
    <Container>
      <HeaderContainer>
        <div className="absolute left-0">
          <Xmark onClick={handleClose} />
        </div>
        <Text variant="title3" weight="bold" color="black">
          거래 요청
        </Text>
      </HeaderContainer>

      {step === 1 ? <DealRequestForm /> : <DealRequestConfirm />}
    </Container>
  )
}
