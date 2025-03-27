import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { Camera, XmarkCircleSolid } from 'iconoir-react'
import { colors } from '@/styles/colors'
import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import {
  DraggableImageItemProps,
  DragItem,
  WriteSelectImageProps,
} from '@/interfaces/HomeInterfaces'
import type { Identifier } from 'dnd-core'

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
  rounded-md
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

const RemoveImageBtn = tw.div`
  absolute -top-2 -right-2 z-50 cursor-pointer bg-white rounded-full
`

// 파일 입력 필드 (숨김)
const FileInput = tw.input`
  hidden
`

// 썸네일 이미지 컴포넌트
const ImagePreviewContainer = styled.div<{ isDragging: boolean }>`
  ${tw`relative w-[6rem] h-[6rem] rounded-md object-cover shrink-0 cursor-move`}
  opacity: ${(props) => (props.isDragging ? 0.4 : 1)};
  border: ${(props) => (props.isDragging ? '2px dashed #9ca3af' : 'none')};
  touch-action: none; /* 이 설정이 모바일에서 중요합니다 */
  -webkit-touch-callout: none; /* iOS에서 길게 터치시 메뉴 방지 */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version */
`

// 모바일 환경 감지
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )
}

// 드래그 함수
const DraggableImageItem = ({
  image,
  index,
  moveImage,
  removeImage,
}: DraggableImageItemProps) => {
  const ref = useRef<HTMLDivElement>(null)

  // 컴포넌트가 마운트될 때 이벤트 리스너 추가
  useEffect(() => {
    const element = ref.current
    if (!element) return

    // 이미지를 길게 누르면 컨텍스트 메뉴 방지
    const preventContextMenu = (e: Event) => {
      e.preventDefault()
      return false
    }

    element.addEventListener('contextmenu', preventContextMenu)

    // 클린업 함수
    return () => {
      element.removeEventListener('contextmenu', preventContextMenu)
    }
  }, [])

  interface DragCollectedProps {
    isDragging: boolean
  }

  const [{ isDragging }, drag] = useDrag<DragItem, unknown, DragCollectedProps>(
    {
      type: 'IMAGE_ITEM',
      item: () => {
        return { index, id: `image-${index}`, type: 'IMAGE_ITEM' }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    },
  )

  const [, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: 'IMAGE_ITEM',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item) {
      if (!ref.current) return

      const dragIndex = item.index
      const hoverIndex = index

      // 같은 아이템 위에 드랍하는 경우 무시
      if (dragIndex === hoverIndex) return

      // 위치 변경 실행
      moveImage(dragIndex, hoverIndex)

      // 드래그 인덱스 업데이트
      item.index = hoverIndex
    },
  })

  // ref를 드래그와 드롭 모두에 연결
  drag(drop(ref))

  return (
    <ImagePreviewContainer ref={ref} isDragging={isDragging}>
      <img
        src={image}
        alt={`thumbnail-${index}`}
        className="w-full h-full object-cover rounded-md"
      />
      <RemoveImageBtn
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation()
          removeImage(index)
        }}
      >
        <XmarkCircleSolid
          width="1.5rem"
          height="1.5rem"
          color={colors.darkGray}
        />
      </RemoveImageBtn>
    </ImagePreviewContainer>
  )
}

// 커스텀 DnD 프로바이더
const CustomDndProvider = ({ children }: { children: React.ReactNode }) => {
  // 모바일 여부 확인
  const mobile = isMobile()

  // 모바일이면 TouchBackend 사용, 아니면 HTML5Backend 사용
  return mobile ? (
    <DndProvider
      backend={TouchBackend}
      options={{
        enableMouseEvents: true,
        delayTouchStart: 0,
      }}
    >
      {children}
    </DndProvider>
  ) : (
    <DndProvider backend={HTML5Backend}>{children}</DndProvider>
  )
}

export default function WriteSelectImage({
  onImagesChange,
}: WriteSelectImageProps) {
  const [images, setImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showLimitText, setShowLimitText] = useState(false)

  // 이미지 업로드 버튼 클릭 핸들러
  const handleImageBtnClick = () => {
    if (images.length >= 5) {
      setShowLimitText(true)
      return
    } else {
      setShowLimitText(false)
    }

    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // 파일 선택 핸들러 (다중 선택)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages: string[] = []

      // 최대 5개 이미지까지 제한
      const filesToProcess = Math.min(files.length, 5 - images.length)

      // 파일이 없으면 함수 종료
      if (filesToProcess === 0) return

      let processedCount = 0

      // 최대 5개 이미지까지 제한
      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i]
        const reader = new FileReader()

        reader.onloadend = () => {
          newImages.push(reader.result as string)
          processedCount++

          // 모든 이미지 로드 완료 시 상태 업데이트
          if (processedCount === filesToProcess) {
            setImages((prev) => [...prev, ...newImages])
          }
        }

        reader.readAsDataURL(file)
      }
    }

    // 파일 입력 필드 초기화 (같은 파일 다시 선택 가능하도록)
    if (event.target) {
      event.target.value = ''
    }
  }

  // 이미지 제거 핸들러
  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  // 이미지 순서 변경 핸들러
  const moveImage = (dragIndex: number, hoverIndex: number) => {
    setImages((prevImages) => {
      const newImages = [...prevImages]
      const draggedImage = newImages[dragIndex]

      // 배열에서 드래그된 항목 제거
      newImages.splice(dragIndex, 1)

      // 새 위치에 드래그된 항목 삽입
      newImages.splice(hoverIndex, 0, draggedImage)

      return newImages
    })
  }

  // 브라우저에서 드래그 시 기본 동작 방지
  useEffect(() => {
    const preventDefaultDragOver = (e: DragEvent) => {
      e.preventDefault()
    }

    document.addEventListener('dragover', preventDefaultDragOver)

    return () => {
      document.removeEventListener('dragover', preventDefaultDragOver)
    }
  }, [])

  // useEffect를 사용하여 images 상태가 변경될 때마다 상위 컴포넌트에 알림
  useEffect(() => {
    if (onImagesChange) {
      onImagesChange(images)
    }
  }, [images, onImagesChange])

  return (
    <CustomDndProvider>
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
              onClick={handleImageBtnClick}
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
              <DraggableImageItem
                key={`image-${index}`}
                image={image}
                index={index}
                moveImage={moveImage}
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
          {showLimitText && images.length >= 5 && (
            <Text variant="body1" color="darkKiwi">
              최대 5개 사진까지 선택할 수 있습니다.
            </Text>
          )}
        </ContentContainer>
      </Container>
    </CustomDndProvider>
  )
}
