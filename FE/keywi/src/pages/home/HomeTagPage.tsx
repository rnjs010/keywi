import tw from 'twin.macro'
import NextHeader from '@/components/NextHeader'
import TagProductImg from '@/features/home/components/write/TagProductImg'
import { useNavigate } from 'react-router-dom'

const Container = tw.div`
  flex
  flex-col
  h-screen
  overflow-hidden
`
const ScrollContainer = tw.div`
  flex-1
  overflow-y-auto
  pb-4
`

export default function HomeTagPage() {
  const navigate = useNavigate()

  const handleNextClick = () => {
    // 글 작성 페이지로 이동
    navigate('/home/write')
  }

  return (
    <Container>
      <NextHeader
        startTitle="상품태그 입력"
        isNextEnabled={true}
        onNextClick={handleNextClick}
        endTitle="다음"
      />
      <ScrollContainer>
        <TagProductImg />
      </ScrollContainer>
    </Container>
  )
}
