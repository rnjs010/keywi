import tw from 'twin.macro'
import styled from '@emotion/styled'
import useImageStore from '@/stores/homeStore'

const Container = tw.div`
  w-full
  py-4
`
const ImagesContainer = tw.div`
  flex
  flex-row
  items-center
  gap-2
  px-4
  overflow-x-auto
  pb-2
`
const ThumbnailContainer = styled.div`
  ${tw`
    relative
    w-28
    h-28
    overflow-hidden
    shrink-0
  `}

  /* iOS 스크롤 부드럽게 */
  -webkit-overflow-scrolling: touch;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
`
const ThumbnailImage = tw.img`
  w-full
  h-full
  object-cover
`
const MainImageIndicator = styled.div`
  ${tw`
    absolute
    left-0
    top-0
    w-full
    h-full
    border-2
    border-kiwi
  `}
`

export default function WriteShowImg() {
  const { images } = useImageStore()

  if (images.length === 0) {
    return null
  }

  return (
    <Container>
      <ImagesContainer>
        {images.map((image, index) => (
          <ThumbnailContainer key={index}>
            <ThumbnailImage src={image} alt={`이미지 ${index + 1}`} />
            {index === 0 && <MainImageIndicator />}
          </ThumbnailContainer>
        ))}
      </ImagesContainer>
    </Container>
  )
}
