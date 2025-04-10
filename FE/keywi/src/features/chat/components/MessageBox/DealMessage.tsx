import MainButton from '@/components/MainButton'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { DealMessageProps } from '@/interfaces/ChatInterfaces'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useState } from 'react'
import TwoBtnModal from '@/components/TwoBtnModal'
import { WebSocketContext } from '@/services/WebSocketProvider'
import { useUserStore } from '@/stores/userStore'
import { useDealAcceptStore } from '@/stores/chatStore'
import { useCompleteTrade } from '../../hooks/trades/useCompleteTrade'
import { useAccount } from '../../hooks/useAccount'
import { updateBoardState } from '../../sevices/dealService'

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
  messageId,
  messageType,
  content,
  isMine,
}: DealMessageProps) {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const { client } = useContext(WebSocketContext)
  const { userId } = useUserStore()
  const { data } = useAccount()
  const receipt = useDealAcceptStore((state) => state.receipt)
  const resetState = useDealAcceptStore((state) => state.resetState)
  const { mutate: completeTradeMutate } = useCompleteTrade()

  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  let modalTitle = ''
  let modalContent = ''
  let modalActions: {
    cancel: string
    confirm: string
    onCancle: () => void
    onConfirm: () => void
  } = { cancel: '', confirm: '', onCancle: () => {}, onConfirm: () => {} }

  // 채팅 보내기
  const sendChatMessage = (type: string, message: string) => {
    if (!client?.connected || !roomId || !userId) return

    client.publish({
      destination: '/app/chat/message',
      body: JSON.stringify({
        roomId,
        messageType: type,
        content: message,
        items: null,
        senderId: userId,
      }),
      headers: {
        'X-User-ID': userId.toString(),
      },
    })
  }

  // 채팅 화면 구성
  let title = ''
  let imageSrc = ''
  let contentText = ''
  let buttonText = ''
  let showButton = false
  let onClickHandler: (() => void) | undefined = undefined

  switch (messageType) {
    case 'DEALREQUEST':
      title = '거래요청'
      imageSrc = 'salary'
      contentText = isMine
        ? `조립자님이 ${Number(content).toLocaleString()}원을 거래 요청했어요.`
        : `조립자님이 ${Number(content).toLocaleString()}원을 송금 요청했어요.`
      buttonText = '거래 진행하기'
      showButton = !isMine // 내가 보낸 요청이 아닐 때만 버튼 표시
      if (!data) {
        // 계좌 연결 안되어 있을 때
        onClickHandler = handleOpenModal
        modalTitle = '거래 진행 불가'
        modalContent =
          '거래 진행을 위해 계좌 연결이 필요해요\n계좌 연결하러 가시겠어요?'
        modalActions = {
          cancel: '닫기',
          confirm: '연결하러 가기',
          onCancle: handleCloseModal,
          onConfirm: () => {
            handleCloseModal()
            navigate('/pay')
          },
        }
      } else {
        // 계좌 연결 되어있을 때
        onClickHandler = () => {
          navigate(`/chat/${roomId}/dealaccept`, { state: { messageId } })
        }
      }
      break
    case 'DEALPROGRESS':
      title = '거래 진행중'
      imageSrc = 'money'
      contentText = isMine
        ? '거래를 수락했어요. 물품을 받으면 확인 후, 바로 거래완료를 눌러주세요.'
        : '거래를 수락했어요. 상대방이 구매를 확정하면 조립금을 전달드려요.\n구매자에게 물품을 전달한 후 거래완료를 요청해 주세요.'
      buttonText = isMine ? '거래 완료하기' : '거래완료 요청'
      showButton = true // 양쪽 다 버튼 표시 (텍스트만 다름)
      onClickHandler = handleOpenModal
      if (isMine) {
        modalTitle = '거래를 완료할까요?'
        modalContent =
          '거래 완료 후에는 거래 금액이 전달되고, 취소할 수 없어요.'
        modalActions = {
          cancel: '닫기',
          confirm: '확정하기',
          onCancle: handleCloseModal,
          onConfirm: () => {
            console.log(receipt?.receiptId)
            if (!receipt?.receiptId) return
            // 결제 완료 api 호출
            completeTradeMutate(
              { escrowTransactionId: receipt.receiptId },
              {
                onSuccess: () => {
                  console.log('결제 성공')
                  if (receipt?.boardId) {
                    console.log('상태 변경 요청')
                    updateBoardState({
                      boardId: receipt.boardId,
                      dealState: 'COMPLETED',
                    })
                      .then(() => {
                        console.log('게시글 상태 변경 완료')
                      })
                      .catch((err) => {
                        console.error('게시글 상태 변경 실패', err)
                      })
                  }

                  sendChatMessage('DEALCOMPLETE', receipt?.amount?.toString())
                  resetState()
                  handleCloseModal()
                },
                onError: (err) => {
                  console.error('거래 완료 실패', err)
                },
              },
            )
          },
        }
      } else {
        modalTitle = '거래 완료를 요청할까요?'
        modalContent = '구매자에게 물품을 전달하셨나요?'
        modalActions = {
          cancel: '닫기',
          confirm: '요청하기',
          onCancle: handleCloseModal,
          onConfirm: () => {
            sendChatMessage('TEXT', '거래 완료를 요청합니다.')
            handleCloseModal()
          },
        }
      }
      break
    case 'DEALCOMPLETE':
      title = '거래 완료'
      imageSrc = 'deal'
      contentText = isMine
        ? '거래를 완료해서 금액이 조립자에게 전달되었어요.'
        : `조립금이 계좌로 들어왔어요.\n■ 금액: ${Number(content).toLocaleString()}원`
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
        {showButton && (
          <>
            <MainButton
              text={buttonText}
              className="mt-3"
              onClick={onClickHandler}
            />

            {/* 모달 */}
            <TwoBtnModal
              isOpen={isModalOpen}
              onOpenChange={setIsModalOpen}
              title={modalTitle}
              content={modalContent}
              cancleText={modalActions.cancel}
              confirmText={modalActions.confirm}
              onCancle={handleCloseModal}
              onConfirm={modalActions.onConfirm}
            />
          </>
        )}
      </BottomBox>
    </Container>
  )
}
