import { useState } from 'react'
import NextHeader from '@/components/NextHeader'
import tw from 'twin.macro'
import WriteShowImg from '@/features/home/components/WriteShowImg'
import WriteText from '@/features/home/components/WriteText'
import useImageStore from '@/stores/homeStore'
import { useNavigate } from 'react-router-dom'

const Container = tw.div`
  flex
  flex-col
  h-screen
  overflow-hidden
`

const ContentContainer = tw.div`
  flex-1
  overflow-y-auto
  pb-4
  bg-white
`

export default function HomeWritePage() {
  const [postText, setPostText] = useState('')
  const { images, productTags, reset } = useImageStore()
  const navigate = useNavigate()

  const handleTextChange = (text: string) => {
    setPostText(text)
  }

  const handleSubmit = () => {
    // 여기서 피드 게시 로직 구현
    // 예: API 호출로 서버에 데이터 전송

    console.log('게시 데이터:', {
      text: postText,
      images,
      productTags,
    })

    // 게시 후 스토어 초기화하고 홈 화면으로 이동
    reset()
    navigate('/home')
  }

  // 텍스트가 있을 때만 올리기 버튼 활성화
  const isSubmitEnabled = postText.trim().length > 0

  return (
    <Container>
      <NextHeader
        startTitle="글 작성"
        endTitle="올리기"
        isNextEnabled={isSubmitEnabled}
        onNextClick={handleSubmit}
      />

      <ContentContainer>
        <WriteShowImg />
        <WriteText onTextChange={handleTextChange} />
      </ContentContainer>
    </Container>
  )
}
