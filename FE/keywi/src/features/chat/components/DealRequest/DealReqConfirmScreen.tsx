import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import MainButton from '@/components/MainButton'
import { useDealRequestStore } from '@/stores/chatStore'
import { useNavigate, useParams } from 'react-router-dom'

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

  // 내 계좌 정보 api 호출
  const bankName = '우리'
  const accountNumber = '1002039482304'

  const handleNext = () => {
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
          <BankLogo src={`/banks/${bankName}.png`}></BankLogo>
          <Text variant="body1" weight="bold">
            {bankName} {accountNumber}
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
