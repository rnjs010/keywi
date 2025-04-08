import tw from 'twin.macro'
import { Text } from '@/styles/typography'

const Container = tw.div`
  flex
  items-center
  justify-center
`

interface HeaderTextProps {
  title: string
}

export default function HeaderText({ title }: HeaderTextProps) {
  return (
    <Container>
      <Text variant="title3" weight="bold">
        {title}
      </Text>
    </Container>
  )
}
