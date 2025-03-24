import tw from 'twin.macro'
import { Text } from '@/styles/typography'

const Container = tw.div`
    flex
    items-center
    justify-center
  `

export default function LoginHeader() {
  return (
    <Container>
      <Text variant="title3" weight="bold">
        프로필 입력
      </Text>
    </Container>
  )
}
