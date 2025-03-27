import React, { useState, useRef, useEffect } from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Text } from '@/styles/typography'
import { NavArrowRight } from 'iconoir-react'
import useImageStore from '@/stores/homeStore'
import TagProductModal from './TagProductModal'
import { ProductItem, ProductTag } from '@/interfaces/HomeInterfaces'
import { dummyProducts } from '../services/homeDummyData'
import truncateText from '@/utils/truncateText'

const Container = tw.div`
  flex
  flex-col
  h-full
  overflow-hidden
`
const MainImgContainer = tw.div`
  w-full
  relative 
  overflow-hidden
  mt-3
  aspect-square
  touch-none
`
const MainImg = tw.img`
  w-full
  h-full
  object-cover
`
const TagButton = tw.button`
  w-full
  flex
  items-center
  justify-center
  py-2
  px-4
  rounded-md
  border
  border-littleGray
  mt-4
`

// 상품 태그 포인트 - 드래그 가능하게 수정
const ProductTagPoint = styled.div<{
  $x: number
  $y: number
  $dragging?: boolean
}>`
  ${tw`
    absolute
    w-3
    h-3
    rounded-full
    bg-white
    border
    border-white
    z-20
    cursor-move
    transition-transform
    duration-200
    hover:scale-125
  `}
  left: ${(props) => props.$x}%;
  top: ${(props) => props.$y}%;
  transform: translate(-50%, -50%);
  opacity: ${(props) => (props.$dragging ? '0.7' : '1')};
`

// 상품 정보 박스 - 드래그에 따라 위치 업데이트 & 드래그 가능하게 수정
const ProductInfoBox = styled.div<{
  $x: number
  $y: number
  $isLeftAligned: boolean
  $dragging?: boolean
}>`
  ${tw`
    absolute
    bg-modal
    rounded-md
    shadow-md
    p-2
    z-30
    flex
    items-center
    gap-2
    max-w-[200px]
    cursor-move
  `}
  // 오른쪽 또는 왼쪽에 위치하도록 설정
  ${(props) => {
    if (props.$isLeftAligned) {
      return `
        left: calc(${props.$x}% - 145px);
        transform: translate(0, -50%);
      `
    } else {
      return `
        left: calc(${props.$x}% + 12px);
        transform: translate(0, -50%);
      `
    }
  }}
  top: ${(props) => props.$y}%;
  opacity: ${(props) => (props.$dragging ? '0.7' : '1')};
  user-select: none;
`
const ProductThumbnail = tw.img`
  w-8
  h-8
  object-cover
  rounded
  pointer-events-none
`
const ProductInfo = tw.div`
  flex
  flex-col
  pointer-events-none
`
const ContentContainer = tw.div`
  px-4
  flex
  flex-col
  flex-1
  overflow-hidden
`
const TaggedProductsContainer = tw.div`
  mt-4
  overflow-y-auto
`
const TaggedProductItem = tw.div`
  flex
  items-center
  justify-between
  p-2
`
const TaggedProductContent = tw.div`
  flex
  items-center
  gap-2
`
const ProductItemThumbnail = tw.img`
  w-14
  h-14
  object-cover
  rounded-md
`
const RemoveButton = tw.button`
  text-gray
`

// 아이콘에도 pointer-events-none 추가
const NavArrowIcon = styled(NavArrowRight)`
  pointer-events: none;
`

export default function TagProductImg() {
  const {
    images,
    productTags,
    addProductTag,
    removeProductTag,
    setProductTags,
  } = useImageStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [draggedTag, setDraggedTag] = useState<ProductTag | null>(null)
  const [dragging, setDragging] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  // 상품태그 추가 버튼 클릭
  const handleTagButtonClick = () => {
    setIsModalOpen(true)
  }

  // 상품 선택 핸들러
  const handleSelectProduct = (product: ProductItem) => {
    // 중앙에 새 태그 추가
    const newTag: ProductTag = {
      id: Date.now(),
      name: product.itemName,
      price: `${product.price.toLocaleString()}원`,
      x: 50, // 중앙에 위치
      y: 50, // 중앙에 위치
      thumbnail: product.imageUrl,
    }

    addProductTag(newTag)
    setIsModalOpen(false)
  }

  // 태그 드래그 시작 (포인트와 박스 공통 사용)
  const handleDragStart = (
    e: React.MouseEvent<HTMLDivElement>,
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

  // 태그 제거 핸들러
  const handleRemoveTag = (id: number) => {
    removeProductTag(id)
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

  // 이미지 영역 밖으로 마우스가 나가면 드래그 종료
  const handleMouseLeave = () => {
    if (dragging) {
      handleDragEnd()
    }
  }

  // 터치 이벤트 핸들러 (for ProductInfoBox)
  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    tag: ProductTag,
  ) => {
    const touch = e.touches[0]
    const syntheticEvent = {
      preventDefault: () => e.preventDefault(),
      clientX: touch.clientX,
      clientY: touch.clientY,
    } as unknown as React.MouseEvent<HTMLDivElement>
    handleDragStart(syntheticEvent, tag)
  }

  return (
    <Container>
      <MainImgContainer
        ref={imageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={(e: React.TouchEvent<HTMLDivElement>) => {
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
        }}
      >
        <MainImg src={images[0]} alt="상품 태그 추가할 메인 이미지" />

        {/* 태그 포인트와 정보 박스 */}
        {productTags.map((tag) => {
          const isBeingDragged = draggedTag?.id === tag.id
          // 드래그 중인 태그는 draggedTag 위치를 사용, 아니면 원래 태그 위치 사용
          const tagX = isBeingDragged ? draggedTag.x : tag.x
          const tagY = isBeingDragged ? draggedTag.y : tag.y
          const isLeftAligned = tagX > 70 // x 좌표가 70% 이상이면 왼쪽 정렬

          return (
            <React.Fragment key={tag.id}>
              {/* 태그 포인트 */}
              <ProductTagPoint
                $x={tagX}
                $y={tagY}
                $dragging={isBeingDragged}
                onMouseDown={(e) => handleDragStart(e, tag)}
                onTouchStart={(e) => {
                  const touch = e.touches[0]
                  const syntheticEvent = {
                    preventDefault: () => e.preventDefault(),
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                  } as unknown as React.MouseEvent<HTMLDivElement>
                  handleDragStart(syntheticEvent, tag)
                }}
              />

              {/* 정보 박스 - 이제 드래그 가능 */}
              <ProductInfoBox
                $x={tagX}
                $y={tagY}
                $isLeftAligned={isLeftAligned}
                $dragging={isBeingDragged}
                onMouseDown={(e) => handleDragStart(e, tag)}
                onTouchStart={(e) => handleTouchStart(e, tag)}
              >
                {tag.thumbnail && (
                  <ProductThumbnail src={tag.thumbnail} alt={tag.name} />
                )}
                <ProductInfo>
                  <Text
                    variant="caption3"
                    weight="bold"
                    color="white"
                    className="pointer-events-none"
                  >
                    {truncateText(tag.name, 8)}
                  </Text>
                  <Text
                    variant="caption3"
                    color="white"
                    className="pointer-events-none"
                  >
                    {tag.price}
                  </Text>
                </ProductInfo>
                <NavArrowIcon
                  width={14}
                  height={14}
                  color="white"
                  strokeWidth={2}
                />
              </ProductInfoBox>
            </React.Fragment>
          )
        })}
      </MainImgContainer>

      <ContentContainer>
        {/* 태그 추가 버튼 */}
        <TagButton onClick={handleTagButtonClick}>
          <Text>상품태그 추가</Text>
        </TagButton>

        {/* 태그된 상품 목록 */}
        {productTags.length > 0 && (
          <TaggedProductsContainer>
            {productTags.map((tag) => (
              <TaggedProductItem key={tag.id}>
                <TaggedProductContent>
                  <ProductItemThumbnail
                    src={
                      tag.thumbnail ||
                      `https://picsum.photos/100?random=${tag.id}`
                    }
                    alt={tag.name}
                  />
                  <ProductInfo>
                    <Text variant="caption1">{tag.name}</Text>
                    <Text variant="caption1" weight="bold">
                      {tag.price}
                    </Text>
                  </ProductInfo>
                </TaggedProductContent>
                <RemoveButton onClick={() => handleRemoveTag(tag.id)}>
                  <Text variant="caption1" color="gray">
                    삭제
                  </Text>
                </RemoveButton>
              </TaggedProductItem>
            ))}
          </TaggedProductsContainer>
        )}
      </ContentContainer>

      {/* 상품 선택 모달 */}
      <TagProductModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="상품태그 추가"
        trigger={<div></div>}
        products={dummyProducts}
        onSelectProduct={handleSelectProduct}
      />
    </Container>
  )
}
