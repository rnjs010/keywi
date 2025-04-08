import MainButton from '@/components/MainButton'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'

const BtnWrapper = tw.div`
  mt-auto
  mb-16
  w-full
`

const ErrorMessage = tw.div`
  text-center mb-4
`

interface ActionButtonProps {
  text: string
  onClick: () => Promise<void> | void
  disabled: boolean
  error?: string | null
  isLoading?: boolean
}

export default function ProfileNextBtn({
  text,
  onClick,
  disabled,
  error,
  isLoading = false,
}: ActionButtonProps) {
  return (
    <BtnWrapper>
      {error && (
        <ErrorMessage>
          <Text variant="caption1" style={{ color: 'red' }}>
            {error}
          </Text>
        </ErrorMessage>
      )}
      <MainButton
        text={text}
        disabled={disabled || isLoading}
        onClick={onClick}
      />
    </BtnWrapper>
  )
}
