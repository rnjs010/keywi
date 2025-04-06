import RandomKeyPad from '@/features/pay/components/RandomKeyPad'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { useDealAcceptStore } from '@/stores/ChatStore'
import { useState } from 'react'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden px-4 justify-center
`

export default function PasswordScreen() {
  const RealPw = '010213'
  const setStep = useDealAcceptStore((state) => state.setStep)
  const [password, setPasswordInput] = useState('')
  const [showError, setShowError] = useState(false)

  const handleDelete = () => {
    setPasswordInput(password.slice(0, -1))
    if (showError) setShowError(false)
  }

  const handleAllDelete = () => {
    setPasswordInput('')
    if (showError) setShowError(false)
  }

  const handleKeyPress = (key: string) => {
    if (password.length < 6) {
      setPasswordInput(password + key)
    }
    if (password.length === 5) {
      const newPassword = password + key
      if (newPassword === RealPw) {
        setStep(4)
      } else {
        setShowError(true)
        setPasswordInput('')
      }
    }
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
