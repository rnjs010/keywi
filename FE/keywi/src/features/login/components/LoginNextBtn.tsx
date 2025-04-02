import MainButton from '@/components/MainButton'
import { useSignupStore } from '@/stores/signupStore'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { useNavigate } from 'react-router-dom'

const BtnWrapper = tw.div`
  mt-auto
  mb-16
  w-full
`

const ErrorMessage = tw.div`
  text-center mb-4
`

export default function LoginNextBtn() {
  const { nickname, isLoading, error, signup } = useSignupStore()
  const navigate = useNavigate()

  const isDisabled = nickname.length < 2 || isLoading

  const handleSignup = async () => {
    if (isDisabled) return

    try {
      const success = await signup()

      if (success) {
        navigate('/login/complete')
      }
    } finally {
    }
  }

  return (
    <BtnWrapper>
      {error && (
        <ErrorMessage>
          <Text variant="caption1" style={{ color: 'red' }}>
            {error}
          </Text>
        </ErrorMessage>
      )}
      <MainButton text="다음" disabled={isDisabled} onClick={handleSignup} />
    </BtnWrapper>
  )
}
