//SECTION - 상품 태그 드래그 관련 함수
import useImageStore from '@/stores/homeStore'
import { useState, useRef, useEffect } from 'react'
import { ProductTag } from '@/interfaces/HomeInterfaces'

export default function useTagDragDrop() {
  const { productTags, setProductTags } = useImageStore()
  const [draggedTag, setDraggedTag] = useState<ProductTag | null>(null)
  const [dragging, setDragging] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  // 태그 드래그 시작 (포인트와 박스 공통 사용)
  const handleDragStart = (
    e:
      | React.MouseEvent<HTMLDivElement>
      | { clientX: number; clientY: number; preventDefault: () => void },
    tag: ProductTag,
  ) => {
    e.preventDefault()
    setDraggedTag(tag)
    setDragging(true)
  }

  // 태그 드래그 중
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || !draggedTag || !imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    // 이미지 내에서의 상대적 위치 계산 (%)
    const x = Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
    )
    const y = Math.max(
      0,
      Math.min(100, ((e.clientY - rect.top) / rect.height) * 100),
    )

    // draggedTag 업데이트
    setDraggedTag({
      ...draggedTag,
      x,
      y,
    })
  }

  // 터치 이동 핸들러
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dragging || !draggedTag || !imageRef.current) return

    const touch = e.touches[0]
    const rect = imageRef.current.getBoundingClientRect()
    const x = Math.max(
      0,
      Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100),
    )
    const y = Math.max(
      0,
      Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100),
    )

    setDraggedTag({ ...draggedTag, x, y })
  }

  // 드래그 종료
  const handleDragEnd = () => {
    if (!dragging || !draggedTag) return

    // 태그 위치 업데이트
    const updatedTags = productTags.map((tag) =>
      tag.id === draggedTag.id
        ? { ...tag, x: draggedTag.x, y: draggedTag.y }
        : tag,
    )

    setProductTags(updatedTags)
    setDragging(false)
    setDraggedTag(null)
  }

  // 이미지 영역 밖으로 마우스가 나가면 드래그 종료
  const handleMouseLeave = () => {
    if (dragging) {
      handleDragEnd()
    }
  }

  // 터치 이벤트 핸들러
  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    tag: ProductTag,
  ) => {
    const touch = e.touches[0]
    const syntheticEvent = {
      preventDefault: () => e.preventDefault(),
      clientX: touch.clientX,
      clientY: touch.clientY,
    }
    handleDragStart(syntheticEvent, tag)
  }

  // 이미지 컨테이너에서 마우스 버튼 놓으면 드래그 종료
  useEffect(() => {
    const handleMouseUp = () => {
      if (dragging) {
        handleDragEnd()
      }
    }

    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchend', handleMouseUp)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [dragging, draggedTag])

  return {
    draggedTag,
    dragging,
    imageRef,
    handleDragStart,
    handleMouseMove,
    handleTouchMove,
    handleDragEnd,
    handleMouseLeave,
    handleTouchStart,
  }
}
