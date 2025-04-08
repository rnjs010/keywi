// features/login/components/ProfileStatusInput.tsx
import tw from 'twin.macro'
import { Text } from '@/styles/typography'

const InputContainer = tw.div`
  flex flex-col w-full border-b border-gray mt-10
`

const StatusInput = tw.input`
  p-2 w-full rounded-md focus:outline-none focus:border-kiwi text-center
`

const InfoText = tw.div`
  mx-auto
  text-center
  w-3/5
`

interface ProfileStatusInputProps {
  statusMessage: string
  onStatusMessageChange: (value: string) => void
}

export default function ProfileStatusInput({
  statusMessage,
  onStatusMessageChange,
}: ProfileStatusInputProps) {
  return (
    <>
      <InputContainer>
        <StatusInput
          id="statusMessage"
          type="text"
          placeholder="상태 메시지를 입력하세요 (선택사항)"
          value={statusMessage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onStatusMessageChange(e.target.value)
          }
          maxLength={50}
        />
      </InputContainer>
      <InfoText>
        <Text variant="caption2">상태메세지는 20자 까지 작성 가능합니다</Text>
      </InfoText>
    </>
  )
}
