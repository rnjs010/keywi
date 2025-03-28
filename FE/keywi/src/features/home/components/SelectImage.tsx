//SECTION - 피드 작성시 처음 이미지 다중 선택하는 컴포넌트
import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { Camera } from 'iconoir-react'
import { colors } from '@/styles/colors'
import styled from '@emotion/styled'
import useImageStore from '@/stores/homeStore'
import useImageDragDrop from '../hooks/useImageDragDrop'
import SelectDndWrapper from './SelectDndWrapper'
import SelectDraggableImage from './SelectDraggableImage'

const Container = tw.div`
  flex flex-col
`
const ContentContainer = tw.div`
  mt-1
  px-3
`
const MainImgContainer = tw.div`
  w-full
  relative 
  overflow-hidden
  mt-3
  aspect-square
`
const MainImg = tw.img`
  w-full
  h-full
  object-cover
`
const NoImgPlaceholder = tw.div`
  w-full
  flex
  items-center
  mt-3
  justify-center
  bg-littleGray
  aspect-square
`
const ImageUploadBtn = tw.div`
  flex items-center justify-center min-w-[6rem] min-h-[6rem] rounded-md bg-pay cursor-pointer shrink-0
`
// 파일 입력 필드 (숨김)
const FileInput = tw.input`
  hidden
`

// 썸네일 이미지들 컨테이너
const ThumbnailsContainer = styled.div`
  ${tw`
    flex 
    flex-row 
    items-center 
    gap-2 
    pt-3 
    overflow-x-auto
    pb-4
  `}

  /* 스크롤바 항상 표시 */
  overflow-y: hidden;
  overflow-x: scroll;

  /* iOS 스크롤 부드럽게 */
  -webkit-overflow-scrolling: touch;

  /* 스크롤바 스타일링 (웹킷 기반 브라우저용) */
  &::-webkit-scrollbar {
    height: 0.5rem; /* 스크롤바 두께 */
    display: block; /* 항상 표시 */
  }

  /* 스크롤바 트랙(배경) */
  &::-webkit-scrollbar-track {
    ${tw`bg-transparent rounded-full`}
  }

  /* 스크롤바 핸들(움직이는 부분) */
  &::-webkit-scrollbar-thumb {
    ${tw`bg-darkKiwi rounded-full`}
  }

  /* 스크롤바 핸들 호버 시 */
  &::-webkit-scrollbar-thumb:hover {
    ${tw`bg-darkKiwi`}
  }

  /* 모든 브라우저에서 스크롤바 동작 개선 */
  scroll-behavior: smooth;
`

export default function SelectImage() {
  const { images } = useImageStore()
  const {
    showLimitWarning,
    fileInputRef,
    isMobile,
    handleImageUploadClick,
    handleFileChange,
    removeImage,
    moveImage,
  } = useImageDragDrop(5)

  // 이미지 제거 핸들러
  const handleRemoveImage = (index: number) => {
    removeImage(index)
  }

  // 이미지 순서 변경 핸들러
  const handleMoveImage = (dragIndex: number, hoverIndex: number) => {
    moveImage(dragIndex, hoverIndex)
  }

  return (
    <SelectDndWrapper isMobile={isMobile()}>
      <Container>
        {/* 메인 이미지 (첫 번째 이미지) */}
        {images.length > 0 ? (
          <MainImgContainer>
            <MainImg src={images[0]} alt="main-image" />
          </MainImgContainer>
        ) : (
          <NoImgPlaceholder>
            <Text color="darkGray">메인 사진을 선택해주세요</Text>
          </NoImgPlaceholder>
        )}
        <ContentContainer>
          <Text variant="caption1" color="darkGray" className="mt-2">
            메인 사진에만 상품 태그 가능합니다.
          </Text>
          {/* 썸네일 컨테이너 */}
          <ThumbnailsContainer>
            {/* 이미지 추가 버튼 (5개 미만일 때만 표시) */}
            <ImageUploadBtn
              onClick={handleImageUploadClick}
              className={
                images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
              }
            >
              <Camera
                width={'2rem'}
                height={'2rem'}
                strokeWidth={1.5}
                color={colors.kiwi}
              />
            </ImageUploadBtn>
            {/* 이미지 썸네일 (드래그 가능) */}
            {images.map((image, index) => (
              <SelectDraggableImage
                key={`image-${index}`}
                image={image}
                index={index}
                moveImage={handleMoveImage}
                removeImage={handleRemoveImage}
              />
            ))}
          </ThumbnailsContainer>
          <FileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          <Text variant="caption1" color="gray" className="mt-2">
            사진을 드래그하여 순서를 변경할 수 있습니다.
          </Text>
          <br />
          {/* Alert 뜨는거로 바꾸기 */}
          {showLimitWarning && images.length >= 5 && (
            <Text variant="body1" color="darkKiwi">
              최대 5개 사진까지 선택할 수 있습니다.
            </Text>
          )}
        </ContentContainer>
      </Container>
    </SelectDndWrapper>
  )
}
