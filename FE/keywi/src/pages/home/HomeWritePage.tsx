import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import tw from 'twin.macro'
import styled from '@emotion/styled'

interface ImageInfo {
  url: string
  name: string
  type: string
  size: number
}

interface ProductTag {
  id: string
  name: string
  price: number
  x: number
  y: number
}

interface LocationState {
  images?: ImageInfo[]
}

const Container = tw.div`
  w-full
  max-w-screen-sm
  mx-auto
  flex
  flex-col
  h-screen
  bg-white
`

const Header = tw.header`
  flex
  items-center
  justify-between
  p-4
  border-b
  border-gray
`

const BackButton = tw.button`
  text-xl
  font-bold
`

const PageTitle = tw.h1`
  text-lg
  font-bold
`

const NextButton = tw.button`
  text-primary
  font-bold
`

const PhotoContainer = styled.div`
  ${tw`
    w-full
    relative
  `}
  aspect-ratio: 1 / 1;
`

const MainPhoto = tw.img`
  w-full
  h-full
  object-cover
`

const TagMarker = styled.div<{ x: number; y: number }>`
  ${tw`
    absolute
    w-8
    h-8
    rounded-full
    bg-white
    bg-opacity-80
    flex
    items-center
    justify-center
    text-xl
    font-bold
    border
    border-black
    z-10
  `}
  transform: translate(-50%, -50%);
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
`

const ThumbnailsContainer = tw.div`
  p-4
`

const ThumbnailsRow = tw.div`
  flex
  overflow-x-auto
  mb-4
  pb-2
`

const ThumbnailWrapper = styled.div<{ selected: boolean }>`
  ${tw`
    relative
    rounded
    overflow-hidden
    mr-2
    cursor-pointer
  `}
  width: 70px;
  height: 70px;
  border: 2px solid ${(props) => (props.selected ? '#4CAF50' : 'transparent')};
`

const Thumbnail = tw.img`
  w-full
  h-full
  object-cover
`

const AddButton = tw.button`
  w-full
  p-3
  bg-gray
  rounded
  font-bold
  text-gray
`

const TagInputContainer = tw.div`
  absolute
  bottom-0
  left-0
  right-0
  bg-white
  p-4
  border-t
  border-gray
  z-20
`

const TagInputTitle = tw.h3`
  text-base
  font-bold
  mb-3
`

const ProductItem = tw.div`
  flex
  justify-between
  items-center
  p-3
  border
  border-gray
  rounded
  mb-2
  cursor-pointer
`

const ProductInfo = tw.div`
  flex
  flex-col
`

const ProductName = tw.span`
  text-sm
`

const ProductPrice = tw.span`
  text-sm
  text-primary
`

const CloseButton = tw.button`
  text-xl
`

const HomeWritePage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState

  const [photos, setPhotos] = useState<(ImageInfo & { tags: ProductTag[] })[]>(
    [],
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTagInput, setShowTagInput] = useState(false)
  const [tagPosition, setTagPosition] = useState({ x: 0, y: 0 })
  const photoRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 초기화 - 전달받은 이미지들 설정
  useEffect(() => {
    if (state?.images && state.images.length > 0) {
      const imagesWithTags = state.images.map((img) => ({
        ...img,
        tags: [] as ProductTag[],
      }))
      setPhotos(imagesWithTags)
    }
  }, [state])

  // 이미지가 없는 경우 홈으로 리다이렉트
  useEffect(() => {
    if (!state?.images || state.images.length === 0) {
      navigate('/home')
    }
  }, [state, navigate])

  const handlePhotoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!photoRef.current) return

    const rect = photoRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setTagPosition({ x, y })
    setShowTagInput(true)
  }

  const handleAddTag = (product: { name: string; price: number }) => {
    const newTag: ProductTag = {
      id: `tag-${Date.now()}`,
      name: product.name,
      price: product.price,
      x: tagPosition.x,
      y: tagPosition.y,
    }

    const updatedPhotos = [...photos]
    if (updatedPhotos[currentIndex]) {
      updatedPhotos[currentIndex] = {
        ...updatedPhotos[currentIndex],
        tags: [...updatedPhotos[currentIndex].tags, newTag],
      }
    }

    setPhotos(updatedPhotos)
    setShowTagInput(false)
  }

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // 최대 5개까지만 선택 가능
    const selectedFiles = Array.from(files).slice(0, 5)

    const newPhotos = selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
      tags: [] as ProductTag[],
    }))

    setPhotos(newPhotos)
    setCurrentIndex(0)
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>&lt;</BackButton>
        <PageTitle>상품태그 입력</PageTitle>
        <NextButton>다음</NextButton>
      </Header>

      {/* 파일 입력(숨김) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
      />

      {/* 메인 사진 영역 */}
      {photos.length > 0 && (
        <PhotoContainer ref={photoRef} onClick={handlePhotoClick}>
          <MainPhoto src={photos[currentIndex].url} alt="Selected" />

          {/* 태그 마커 렌더링 */}
          {photos[currentIndex].tags.map((tag) => (
            <TagMarker key={tag.id} x={tag.x} y={tag.y}>
              +
            </TagMarker>
          ))}
        </PhotoContainer>
      )}

      {/* 썸네일 목록 */}
      {photos.length > 0 && (
        <ThumbnailsContainer>
          <ThumbnailsRow>
            {photos.map((photo, index) => (
              <ThumbnailWrapper
                key={photo.url}
                selected={currentIndex === index}
                onClick={() => setCurrentIndex(index)}
              >
                <Thumbnail src={photo.url} alt={`Thumbnail ${index + 1}`} />
              </ThumbnailWrapper>
            ))}
          </ThumbnailsRow>
          <AddButton onClick={openFilePicker}>사진 추가/변경</AddButton>
        </ThumbnailsContainer>
      )}

      {/* 상품 태그 입력 UI */}
      {showTagInput && (
        <TagInputContainer>
          <TagInputTitle>상품태그 추가</TagInputTitle>
          <ProductItem
            onClick={() =>
              handleAddTag({
                name: '하이루 버디스굼푹 장장돌힙',
                price: 130000,
              })
            }
          >
            <ProductInfo>
              <ProductName>하이루 버디스굼푹 장장돌힙</ProductName>
              <ProductPrice>130원</ProductPrice>
            </ProductInfo>
            <CloseButton onClick={() => setShowTagInput(false)}>×</CloseButton>
          </ProductItem>
        </TagInputContainer>
      )}
    </Container>
  )
}

export default HomeWritePage
