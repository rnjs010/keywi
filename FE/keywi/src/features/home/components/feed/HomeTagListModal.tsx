import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ProductTag } from '@/interfaces/HomeInterfaces'
import { Text } from '@/styles/typography'
import tw from 'twin.macro'
import { Star, StarSolid } from 'iconoir-react'
import { useState } from 'react'
import { colors } from '@/styles/colors'
import styled from '@emotion/styled'
import truncateText from '@/utils/truncateText'
import { useNavigate } from 'react-router-dom'
import { useProductFavorite } from '../../hooks/useProductFavorite'

const TagItemContainer = tw.div`
  flex
  items-center
  px-5
  py-2
`
const ProductImage = tw.img`
  w-16
  h-16
  object-cover
  rounded
`
const ProductInfo = tw.div`
  flex-1
  mx-4
`
const ZzimButton = tw.button`
`
// 줄 간격을 줄인 제품명 컨테이너
const ProductNameContainer = styled.div`
  line-height: 1.2; // 줄 간격 줄이기
  margin-bottom: 2px; // 가격과의 간격
`

interface HomeTagListModalProps {
  productTags?: ProductTag[]
  triggerComponent?: React.ReactNode
}

export default function HomeTagListModal({
  productTags = [],
  triggerComponent,
}: HomeTagListModalProps) {
  const navigate = useNavigate()
  const [zzims, setZzims] = useState<Record<number, boolean>>(() => {
    const initialZzims: Record<number, boolean> = {}
    productTags.forEach((tag) => {
      initialZzims[tag.id] = tag.isFavorite || false
    })
    return initialZzims
  })

  const favoritesMutation = useProductFavorite()

  const handleZzim = async (tagId: number, e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지

    try {
      // API 호출
      const result = await favoritesMutation.mutateAsync(tagId)

      // 결과에 따라 상태 업데이트
      setZzims((prev) => ({
        ...prev,
        [tagId]: result.data, // API 응답에 따라 찜 상태 설정
      }))
    } catch (error) {
      console.error('찜 토글 실패:', error)
    }
  }

  // 상품 페이지로 이동하는 함수
  const handleProductClick = (e: React.MouseEvent, productId: number) => {
    if (productId > 0) {
      e.stopPropagation() // 이벤트 버블링 방지
      console.log(`상품 ID: ${productId}로 이동합니다.`)
      navigate(`/product/detail/${productId}`)
    }
  }

  return (
    <Drawer>
      {triggerComponent && (
        <DrawerTrigger asChild>{triggerComponent}</DrawerTrigger>
      )}

      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="relative">
          <DrawerTitle>
            <Text variant="body2" weight="bold" color="darkKiwi">
              태그 상품 {productTags.length}
            </Text>
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-1 pb-12">
          {productTags.map((tag) => (
            <TagItemContainer key={tag.id}>
              <ProductImage
                src={tag.thumbnail || '/default/default_product.png'}
                alt={tag.name}
              />
              <ProductInfo>
                <ProductNameContainer
                  onClick={(e) => handleProductClick(e, tag.id)}
                >
                  <Text variant="caption1">{truncateText(tag.name, 50)}</Text>
                </ProductNameContainer>
                <div>
                  <Text variant="caption1" weight="bold">
                    {tag.price}
                  </Text>
                </div>
              </ProductInfo>
              <ZzimButton
                onClick={(e: React.MouseEvent) => handleZzim(tag.id, e)}
              >
                {zzims[tag.id] ? (
                  <StarSolid height={22} width={22} color={colors.kiwi} />
                ) : (
                  <Star
                    height={22}
                    width={22}
                    strokeWidth={1.5}
                    color={colors.gray}
                  />
                )}
              </ZzimButton>
            </TagItemContainer>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
