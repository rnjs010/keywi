//SECTION - 드래그 이미지 함수
import { DraggableImageItemProps } from '@/interfaces/HomeInterfaces'
import { useRef, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import type { Identifier } from 'dnd-core'
import { DragItem } from '@/interfaces/HomeInterfaces'
import styled from '@emotion/styled'
import tw from 'twin.macro'
import { XmarkCircleSolid } from 'iconoir-react'
import { colors } from '@/styles/colors'

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
const RemoveImageBtn = tw.div`
  absolute -top-2 -right-2 z-50 cursor-pointer bg-white rounded-full
`

export default function SelectDraggableImage({
  image,
  index,
  moveImage,
  removeImage,
}: DraggableImageItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  // 이미지 길게 누르면 컨텍스트 메뉴 방지
  useEffect(() => {
    const element = ref.current
    if (!element) return

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
