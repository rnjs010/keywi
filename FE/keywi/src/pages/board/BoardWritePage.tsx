import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { Xmark } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'

const Container = tw.div`
  w-full max-w-screen-sm mx-auto flex flex-col h-screen box-border overflow-x-hidden
`

const HeaderContainer = tw.div`
  relative flex justify-center items-center py-4 px-4
`
export default function BoardDetailPage() {
  const navigate = useNavigate()

  return (
    <Container>
      <HeaderContainer>
        <Xmark className="absolute left-4" onClick={() => navigate('/board')} />
        <Text variant="title3" weight="bold" color="black">
          글쓰기
        </Text>
      </HeaderContainer>
    </Container>
  )
}
