import RandomKeyPad from '@/features/pay/components/RandomKeyPad'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { useDealAcceptStore } from '@/stores/chatStore'
import { useState } from 'react'
import { useVerifyPassword } from '../../hooks/useVerifyPassword'
import { useUserStore } from '@/stores/userStore'
import { useAcceptTrade } from '../../hooks/trades/useAcceptTrade'
import { updateBoardState } from '../../sevices/dealService'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden px-4 justify-center
`

export default function PasswordScreen() {
  const myId = useUserStore((state) => state.userId)
  const setStep = useDealAcceptStore((state) => state.setStep)
  const receipt = useDealAcceptStore((state) => state.receipt)
  const [password, setPasswordInput] = useState('')
  const [showError, setShowError] = useState(false)

  const { mutate: verifyPassword } = useVerifyPassword()
  const { mutate: acceptTrade } = useAcceptTrade()

  const handleKeyPress = (key: string) => {
    if (password.length < 6) {
      const newPassword = password + key
      setPasswordInput(newPassword)

      if (newPassword.length === 6 && myId !== null) {
        verifyPassword(
          { userId: myId, rawPassword: newPassword },
          {
            onSuccess: (res) => {
              if (res.matched) {
                setShowError(false)
                // 거래 수락 api 호출
                acceptTrade(
                  {
                    escrowTransactionId: receipt.receiptId,
                    paymentPassword: newPassword,
                  },
                  {
                    onSuccess: () => {
                      console.log('거래 수락 성공')
                      if (receipt?.boardId) {
                        console.log('상태 변경 요청')
                        updateBoardState({
                          boardId: receipt.boardId,
                          dealState: 'IN_PROGRESS',
                        })
                          .then(() => {
                            console.log('게시글 상태 변경 완료')
                          })
                          .catch((err) => {
                            console.error('게시글 상태 변경 실패', err)
                          })
                      }
                      setStep(4)
                    },
                    onError: (err) => {
                      console.error('거래 수락 오류', err)
                    },
                  },
                )
              } else {
                setShowError(true)
                setPasswordInput('')
              }
            },
            onError: (err) => {
              console.error('비밀번호 검증 실패', err)
              setShowError(true)
              setPasswordInput('')
            },
          },
        )
      }
    }
  }

  const handleDelete = () => {
    setPasswordInput(password.slice(0, -1))
    if (showError) setShowError(false)
  }

  const handleAllDelete = () => {
    setPasswordInput('')
    if (showError) setShowError(false)
  }

  return (
    <>
      <Container>
        {/* SECTION - 설명 */}
        <div className="text-center leading-5 mb-2">
          <Text variant="body1" weight="bold" color="black">
            간편 비밀번호를
            <br />
            입력해 주세요
          </Text>
        </div>

        {/* SECTION - 입력 표시 */}
        <div className="flex space-x-2 my-4 justify-center">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className={`w-4 h-4 rounded-full ${i < password.length ? 'bg-kiwi' : 'bg-littleGray'}`}
            />
          ))}
        </div>

        {/* 오류 메시지 */}
        {showError && (
          <div className="text-center mt-2 text-red-500">
            <Text variant="caption1" weight="regular">
              비밀번호가 틀렸습니다.
            </Text>
          </div>
        )}
      </Container>

      {/* SECTION - 키패드 */}
      <RandomKeyPad
        onKeyPress={handleKeyPress}
        onDelete={handleDelete}
        onAllDelete={handleAllDelete}
        passwordLength={password.length}
      />
    </>
  )
}
