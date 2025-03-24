import { colors } from '@/styles/colors'
import { CheckCircleSolid } from 'iconoir-react'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { useLogin } from '../services/LoginContext'

const TextWrapper = tw.div`
  flex flex-col items-center text-center gap-1
`

const ContentWrapper = tw.div`
  flex flex-col items-center gap-6
`

export default function CompleteContent() {
  const { nickname } = useLogin()

  return (
    <ContentWrapper>
      <CheckCircleSolid
        color={colors.pressed}
        height={56}
        width={56}
        className="mb-6"
      />
      <TextWrapper>
        <Text variant="title2" weight="bold" color="black">
          {nickname}님
        </Text>
        <Text variant="title2" weight="bold" color="black">
          회원가입을 완료했어요!
        </Text>
      </TextWrapper>
    </ContentWrapper>
  )
}
