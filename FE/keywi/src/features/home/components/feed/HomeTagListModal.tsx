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
const BookmarkButton = tw.button`
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
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({})

  const handleBookmark = (tagId: number) => {
    setBookmarks((prev) => ({
      ...prev,
      [tagId]: !prev[tagId],
    }))
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
                <ProductNameContainer>
                  <Text variant="caption1">{truncateText(tag.name, 45)}</Text>
                </ProductNameContainer>
                <div>
                  <Text variant="caption1" weight="bold">
                    {tag.price}
                  </Text>
                </div>
              </ProductInfo>
              <BookmarkButton onClick={() => handleBookmark(tag.id)}>
                {bookmarks[tag.id] ? (
                  <StarSolid height={22} width={22} color={colors.kiwi} />
                ) : (
                  <Star height={22} width={22} strokeWidth={1.5} color={colors.gray} />
                )}
              </BookmarkButton>
            </TagItemContainer>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
