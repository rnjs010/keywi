import { useState, Fragment } from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Text } from '@/styles/typography'
import { ProductTag } from '@/interfaces/HomeInterfaces'

// 상품 태그 포인트
const ProductTagPoint = styled.div<{ $x: number; $y: number }>`
  ${tw`
    absolute
    w-3
    h-3
    rounded-full
    bg-white
    border
    border-white
    z-20
    cursor-pointer
    transition-transform
    duration-200
    hover:scale-125
  `}
  left: ${(props) => props.$x}%;
  top: ${(props) => props.$y}%;
  transform: translate(-50%, -50%);
`

// 상품 정보 박스
const ProductInfoBox = styled.div<{ $x: number; $y: number }>`
  ${tw`
    absolute
    bg-white
    rounded-md
    shadow-md
    p-2
    z-30
    flex
    items-center
    gap-2
    max-w-[200px]
    pointer-events-none
  `}
  left: ${(props) => {
    // 화면 오른쪽으로 넘어가는 것 방지
    const baseX = props.$x
    return baseX > 70 ? `calc(${baseX}% - 180px)` : `${baseX}%`
  }};
  top: ${(props) => {
    // 화면 아래로 넘어가는 것 방지
    const baseY = props.$y
    return baseY > 70 ? `calc(${baseY}% - 60px)` : `${baseY}%`
  }};
  transform: translate(-10px, -50%);
`

const ProductThumbnail = tw.img`
  w-10
  h-10
  object-cover
  rounded
`

const ProductInfo = tw.div`
  flex
  flex-col
`

interface HomeFeedTagProps {
  productTags?: ProductTag[]
  showTags: boolean // 태그 표시 여부 (상위 컴포넌트에서 제어)
}

export default function HomeFeedTag({
  productTags,
  showTags,
}: HomeFeedTagProps) {
  const [activeTag, setActiveTag] = useState<number | null>(null)

  // 표시할 태그가 있는지 확인
  const hasProductTags = productTags && productTags.length > 0

  if (!hasProductTags || !showTags) {
    return null
  }

  const handleTagClick = (tagId: number) => {
    if (activeTag === tagId) {
      setActiveTag(null)
    } else {
      setActiveTag(tagId)
    }
  }

  return (
    <>
      {productTags.map((tag) => (
        <Fragment key={tag.id}>
          <ProductTagPoint
            $x={tag.x}
            $y={tag.y}
            onClick={() => handleTagClick(tag.id)}
          />

          {activeTag === tag.id && (
            <ProductInfoBox $x={tag.x} $y={tag.y}>
              {tag.thumbnail && (
                <ProductThumbnail src={tag.thumbnail} alt={tag.name} />
              )}
              <ProductInfo>
                <Text variant="caption2" weight="bold">
                  {tag.name}
                </Text>
                <Text variant="caption2">{tag.price}</Text>
              </ProductInfo>
            </ProductInfoBox>
          )}
        </Fragment>
      ))}
    </>
  )
}
