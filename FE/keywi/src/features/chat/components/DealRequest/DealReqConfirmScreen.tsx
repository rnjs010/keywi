import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import MainButton from '@/components/MainButton'
import { useDealRequestStore } from '@/stores/chatStore'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext } from 'react'
import { useUserStore } from '@/stores/userStore'
import { WebSocketContext } from '@/services/WebSocketProvider'
import { useAccount } from '../../hooks/useAccount'
import { getBankLogoPath, getBankName } from '@/utils/bankCodeMapper'

const TextContainer = tw.div`
  flex flex-row justify-center mt-8
`

const AccountBadge = tw.div`
  w-fit flex items-center gap-2 bg-littleGray bg-opacity-50 rounded-full px-3 py-1.5 my-4
`

const BankLogo = tw.img`
  w-8 h-8
`

const BottomContainer = tw.div`
  mt-auto mb-8 flex flex-col items-center gap-4
`

export default function DealReqConfirmScreen() {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const totalPrice = useDealRequestStore((state) => state.totalPrice)
  const selectedProducts = useDealRequestStore(
    (state) => state.selectedProducts,
  )
  const resetState = useDealRequestStore((state) => state.resetState)
  const userId = useUserStore((state) => state.userId)

  const { data } = useAccount()
  const { client } = useContext(WebSocketContext)

  const handleNext = () => {
    console.log('거래 내역', selectedProducts)

    const messageBody = {
      roomId,
      messageType: 'DEALREQUEST',
      content: totalPrice.toString().trim(),
      items: JSON.stringify({
        products: selectedProducts,
      }),
      senderId: userId,
    }

    if (client?.connected && roomId && userId) {
      client.publish({
        destination: '/app/chat/message',
        body: JSON.stringify(messageBody),
        headers: {
          'X-User-ID': userId?.toString() || '',
        },
      })
    }

    resetState()
    navigate(`/chat/${roomId}`)
  }

  return (
    <>
      <div className="flex flex-col items-center py-44">
        <img src={`/chatIcons/money-get.png`}></img>

        <TextContainer>
          <Text variant="body2" weight="bold" color="kiwi">
            {totalPrice.toLocaleString()}원
          </Text>
          <Text variant="body2" weight="bold">
            을 아래 계좌로 받을까요?
          </Text>
        </TextContainer>

        <AccountBadge>
          <BankLogo src={getBankLogoPath(data?.bankCode || '')}></BankLogo>
          <Text variant="body1" weight="bold">
            {getBankNameWithoutSuffix(getBankName(data?.bankCode || ''))}{' '}
            {data?.accountNo}
          </Text>
        </AccountBadge>
      </div>

      {/* 확인 버튼 */}
      <BottomContainer>
        <Text variant="caption2" weight="bold" color="gray">
          계좌 변경은 마이페이지의 설정에서 가능합니다
        </Text>
        <MainButton text="확인" onClick={handleNext} />
      </BottomContainer>
    </>
  )
}

// 이름에서 '은행' 제거
const getBankNameWithoutSuffix = (name: string) => {
  return name.endsWith('은행') ? name.slice(0, -2) : name
}
