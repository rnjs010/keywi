import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Text } from '@/styles/typography'

const Container = styled.div`
  ${tw`
    flex
    items-center
    justify-center
    mt-10
  `}
  margin-top: min(25vh, 10rem);
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
