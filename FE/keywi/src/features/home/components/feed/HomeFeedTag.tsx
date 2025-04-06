import { Fragment } from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Text } from '@/styles/typography'
import { ProductTag } from '@/interfaces/HomeInterfaces'
import { NavArrowRight } from 'iconoir-react'
import truncateText from '@/utils/truncateText'
import { useNavigate } from 'react-router-dom'

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
// 상품 정보 박스 - 위치 로직 수정
const ProductInfoBox = styled.div<{
  $x: number
  $y: number
  $isLeftAligned: boolean
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
`
const ProductThumbnail = tw.img`
  w-8
  h-8
  object-cover
  rounded
`
const ProductInfo = tw.div`
  flex
  flex-col
`
const ProductPageBtn = tw.button`
  h-8
  cursor-pointer
  flex
  items-center
  justify-center
`

interface HomeFeedTagProps {
  productTags?: ProductTag[]
  showTags: boolean // 태그 표시 여부 (상위 컴포넌트에서 제어)
}

export default function HomeFeedTag({
  productTags,
  showTags,
}: HomeFeedTagProps) {
  // 표시할 태그가 있는지 확인
  const hasProductTags = productTags && productTags.length > 0

  const navigate = useNavigate()

  // 태그가 없으면 아무것도 렌더링하지 않음
  if (!hasProductTags) {
    return null
  }

  // 상품 페이지로 이동하는 함수
  const handleProductClick = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation() // 이벤트 버블링 방지
    console.log(`상품 ID: ${productId}로 이동합니다.`)
    navigate(`/product/${productId}`)
  }

  return (
    <>
      {productTags.map((tag) => (
        <Fragment key={tag.id}>
          {/* 포인트 항상 보이게게 */}
          <ProductTagPoint $x={tag.x} $y={tag.y} />

          {/* 정보 박스는 showTags가 true일 때만 보이게 함 */}
          {showTags && (
            <ProductInfoBox
              $x={tag.x}
              $y={tag.y}
              $isLeftAligned={tag.x > 70} // x 좌표가 70% 이상이면 왼쪽 정렬
            >
              {tag.thumbnail && (
                <ProductThumbnail src={tag.thumbnail} alt={tag.name} />
              )}
              <ProductInfo>
                <Text variant="caption3" weight="bold" color="white">
                  {truncateText(tag.name, 8)}
                </Text>
                <Text variant="caption3" color="white">
                  {tag.price}
                </Text>
              </ProductInfo>
              <ProductPageBtn
                onClick={(e: React.MouseEvent) => handleProductClick(e, tag.id)}
              >
                <NavArrowRight
                  width={14}
                  height={14}
                  color="white"
                  strokeWidth={2}
                />
              </ProductPageBtn>
            </ProductInfoBox>
          )}
        </Fragment>
      ))}
    </>
  )
}
