import WriteHeader from '@/features/home/components/WriteHeader'
import WriteSelectImage from '@/features/home/components/WriteSelectImage'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import tw from 'twin.macro'

const Container = tw.div`
`

export default function HomeImgSelectPage() {
  const [images, setImages] = useState<string[]>([])
  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages)
  }
  const navigate = useNavigate()

  const handleNextClick = () => {
    // 다음 단계로 이동하는 로직 (예: 태그 추가 페이지)
    navigate('/home/tag')
  }

  return (
    <Container>
      <WriteHeader
        title="사진 선택"
        isNextEnabled={images.length > 0}
        onNextClick={handleNextClick}
      ></WriteHeader>
      <WriteSelectImage onImagesChange={handleImagesChange}></WriteSelectImage>
    </Container>
  )
}
