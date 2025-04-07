import NextHeader from '@/components/NextHeader'
import SelectImage from '@/features/home/components/write/SelectImage'
import { useNavigate } from 'react-router-dom'
import useImageStore from '@/stores/homeStore'
import tw from 'twin.macro'

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

export default function HomeImgSelectPage() {
  const { images } = useImageStore()
  const navigate = useNavigate()

  const handleNextClick = () => {
    // 메인사진 상품태그 추가 페이지로 이동
    navigate('/home/tag')
  }

  return (
    <Container>
      <NextHeader
        startTitle="사진 선택"
        isNextEnabled={images.length > 0}
        onNextClick={handleNextClick}
        endTitle="다음"
      ></NextHeader>
      <ScrollContainer>
        <SelectImage />
      </ScrollContainer>
    </Container>
  )
}
