import { colors } from '@/styles/colors'
import { CheckCircleSolid } from 'iconoir-react'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'

const Container = tw.div`
  text-center
`

export default function CompleteContent() {
  return (
    <Container>
      <CheckCircleSolid color={colors.pressed} height={36} width={36} />
      <Text variant="title2" weight="bold" color="black">
        {}님 회원가입을 완료했어요!
      </Text>
    </Container>
  )
}
