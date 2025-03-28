//SECTION - 상품 태그 포인트 박스 정보 컴포넌트
import styled from '@emotion/styled'
import tw from 'twin.macro'
import { TagPointAndInfoProps } from '@/interfaces/HomeInterfaces'
import React from 'react'
import { Text } from '@/styles/typography'
import truncateText from '@/utils/truncateText'
import { NavArrowRight } from 'iconoir-react'

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

export default function TagPointInfo({
  tag,
  isBeingDragged,
  tagX,
  tagY,
  onDragStart,
  onTouchStart,
}: TagPointAndInfoProps) {
  const isLeftAligned = tagX > 60

  return (
    <React.Fragment>
      {/* 태그 포인트 */}
      <ProductTagPoint
        $x={tagX}
        $y={tagY}
        $dragging={isBeingDragged}
        onMouseDown={(e) => onDragStart(e, tag)}
        onTouchStart={(e) => onTouchStart(e, tag)}
      />

      {/* 정보 박스 */}
      <ProductInfoBox
        $x={tagX}
        $y={tagY}
        $isLeftAligned={isLeftAligned}
        $dragging={isBeingDragged}
        onMouseDown={(e) => onDragStart(e, tag)}
        onTouchStart={(e) => onTouchStart(e, tag)}
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
        <NavArrowRight width={14} height={14} color="white" strokeWidth={2} />
      </ProductInfoBox>
    </React.Fragment>
  )
}
