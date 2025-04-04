import NextHeader from '@/components/NextHeader'
import tw from 'twin.macro'
import WriteShowImg from '@/features/home/components/write/WriteShowImg'
import WriteText from '@/features/home/components/write/WriteText'
import useImageStore from '@/stores/homeStore'
import { useNavigate } from 'react-router-dom'
import { CreateFeedDTO, ProductPosition } from '@/interfaces/HomeInterfaces'
import { useFeedMutation } from '@/features/home/hooks/useFeedMutation'

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
  const { content, imageFiles, productTags, hashtags, reset } = useImageStore()
  const navigate = useNavigate()
  const feedMutation = useFeedMutation()

  const handleTextChange = (text: string) => {
    // WriteText 컴포넌트에서 이미 스토어를 업데이트합니다.
  }

  const handleSubmit = async () => {
    // 여기서 피드 게시 로직 구현
    if (feedMutation.isPending) return

    try {
      // 피드 정보 변환 (API 형식에 맞게)
      const products: ProductPosition[] = productTags.map((tag) => {
        const productId = tag.id // 양수 ID는 기존 상품, 음수 ID는 직접 입력 상품

        // 기본 위치 데이터
        const productPosition: ProductPosition = {
          productId,
          imageOrder: 0, // 모든 태그는 첫 번째(메인) 이미지에 추가
          positionX: tag.x, // 비율에 맞게 조정
          positionY: tag.y, // 비율에 맞게 조정
        }

        // 직접 입력 상품인 경우 (ID가 음수) productName 추가
        if (productId < 0) {
          productPosition.productName = tag.name
        }

        return productPosition
      })

      const feedData: CreateFeedDTO = {
        content,
        products,
        hashtags,
      }

      // TanStack Query mutation 실행
      await feedMutation.mutateAsync({
        feedData,
        files: imageFiles,
      })

      // 게시 후 스토어 초기화하고 홈 화면으로 이동
      reset()
      navigate('/home')
    } catch (error) {
      console.error('게시물 작성 에러:', error)
    }
  }

  // 텍스트가 있을 때만 올리기 버튼 활성화
  const isSubmitEnabled = content.trim().length > 0 && !feedMutation.isPending

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
