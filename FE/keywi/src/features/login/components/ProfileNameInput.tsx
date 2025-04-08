import tw from 'twin.macro'
import { handleViewPortResize } from '@/features/login/hooks/handleViewPortResize'
import { Text } from '@/styles/typography'

const NicknameSection = tw.div`
  mt-10
  w-3/5
  border-b
  border-gray
  pb-1
  mx-auto
`

const TextInput = tw.input`
  w-full
  py-2
  bg-transparent
  outline-none
  text-center
  text-lg
`

const InfoText = tw.div`
  mx-auto
  text-center
  w-3/5
`

interface ProfileNameInputProps {
  nickname: string
  onNicknameChange: (nickname: string) => void
  placeholder?: string
  infoText?: string
}

export default function ProfileNameInput({
  nickname,
  onNicknameChange,
  placeholder = '닉네임을 입력하세요',
  infoText = '닉네임은 2자~8자 사용가능합니다',
}: ProfileNameInputProps) {
  handleViewPortResize()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNicknameChange(e.target.value)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.placeholder = ''
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.placeholder = placeholder
  }

  return (
    <>
      <NicknameSection>
        <TextInput
          placeholder={placeholder}
          name="nickname"
          type="text"
          maxLength={8} // 8자 제한
          value={nickname}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </NicknameSection>
      <InfoText>
        <Text variant="caption2">{infoText}</Text>
      </InfoText>
    </>
  )
}
