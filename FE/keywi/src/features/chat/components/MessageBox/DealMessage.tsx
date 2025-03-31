import MainButton from '@/components/MainButton'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { DealMessageProps } from '@/interfaces/ChatInterfaces'

const Container = tw.div`
  rounded-xl overflow-hidden border border-gray w-56
`

const TopBox = tw.div`
  bg-lightKiwi p-3 flex flex-col justify-between
`

const BottomBox = tw.div`
  bg-white p-3
`

export default function DealMessage({
  messageType,
  content,
  isMine,
}: DealMessageProps) {
  let title = ''
  let imageSrc = ''
  let contentText = ''
  let buttonText = ''
  let showButton = false

  switch (messageType) {
    case 'DEALREQUEST':
      title = '거래요청'
      imageSrc = 'salary'
      contentText = isMine
        ? `조립자님이 ${content}원을 거래 요청했어요.`
        : `조립자님이 ${content}원을 송금 요청했어요.`
      buttonText = '거래 진행하기'
      showButton = !isMine // 내가 보낸 요청이 아닐 때만 버튼 표시
      break
    case 'DEALPROGRESS':
      title = '거래 진행중'
      imageSrc = 'money'
      contentText = isMine
        ? '거래를 수락했어요. 물품을 받으면 확인 후, 바로 거래완료를 눌러주세요.'
        : '거래를 수락했어요. 상대방이 구매를 확정하면 조립금을 전달드려요.\n구매자에게 물품을 전달한 후 거래완료를 요청해 주세요.'
      buttonText = isMine ? '거래 완료하기' : '거래완료 요청'
      showButton = true // 양쪽 다 버튼 표시 (텍스트만 다름)
      break
    case 'DEALCOMPLETE':
      title = '거래 완료'
      imageSrc = 'deal'
      contentText = isMine
        ? '거래를 완료해서 금액이 조립자에게 전달되었어요.'
        : `조립금이 계좌로 들어왔어요.\n■ 금액: ${content}원`
      showButton = false // 양쪽 다 버튼 없음
      break
    default:
      break
  }

  return (
    <Container>
      <TopBox>
        <div className="flex flex-row justify-between mb-4">
          <Text variant="body1" weight="bold" color="black">
            {title}
          </Text>
          <div className="text-[#99cd93] opacity-70">
            <Text variant="caption1" weight="regular">
              pay
            </Text>
          </div>
        </div>
        <div className="flex justify-end">
          <img src={`/chatIcons/${imageSrc}.png`} alt="Money bag" />
        </div>
      </TopBox>
      <BottomBox>
        <Text
          variant="caption1"
          weight="regular"
          color="black"
          style={{ whiteSpace: 'pre-line' }}
        >
          {contentText}
        </Text>
        {showButton && <MainButton text={buttonText} className="mt-3" />}
      </BottomBox>
    </Container>
  )
}
