import { usePayStore } from '@/stores/payStore'
import { useState } from 'react'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import RandomKeyPad from './RandomKeyPad'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden px-4 justify-center
`

export default function RegistPassword() {
  const step = usePayStore((state) => state.step)
  const setPassword = usePayStore((state) => state.setPassword)
  const setStep = usePayStore((state) => state.setStep)
  const [password, setPasswordInput] = useState('')
  const [firstPassword, setFirstPassword] = useState('')
  const [showError, setShowError] = useState(false)

  const stepTexts = [
    '간편 비밀번호를\n입력해 주세요',
    '비밀번호를\n다시 한 번 입력해 주세요',
  ]

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
      if (step === 4) {
        setFirstPassword(newPassword)
        setPasswordInput('')
        setStep(5)
      } else if (step === 5) {
        if (newPassword === firstPassword) {
          setPassword(newPassword)
          setStep(6)
        } else {
          setShowError(true)
          setPasswordInput('')
        }
      }
    }
  }

  return (
    <>
      <Container>
        {/* SECTION - 설명 */}
        <div className="text-center leading-5 mb-2">
          <Text variant="body1" weight="bold" color="black">
            {stepTexts[step - 4]}
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
              비밀번호가 일치하지 않습니다. 다시 입력해 주세요.
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
