import tw from 'twin.macro'
import WriteHeader from '@/features/home/components/WriteHeader'

const Container = tw.div`
`

export default function HomeTagPage() {
  return (
    <Container>
      <WriteHeader title="상품태그 입력"></WriteHeader>
    </Container>
  )
}
