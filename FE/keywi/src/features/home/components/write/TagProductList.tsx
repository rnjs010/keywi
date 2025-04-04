//SECTION - 태그된 상품 목록 컴포넌트
import { ProductTag } from '@/interfaces/HomeInterfaces'
import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import truncateText from '@/utils/truncateText'

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
const ProductInfo = tw.div`
  flex
  flex-col
  pointer-events-none
`

interface TaggedProductListProps {
  productTags: ProductTag[]
  onRemoveTag: (id: number) => void
}

export default function TagProductList({
  productTags,
  onRemoveTag,
}: TaggedProductListProps) {
  // 태그된 상품 목록이 없을시
  if (productTags.length === 0) return null

  return (
    <TaggedProductsContainer>
      {productTags.map((tag) => (
        <TaggedProductItem key={tag.id}>
          <TaggedProductContent>
            <ProductItemThumbnail
              src={
                tag.thumbnail || `https://picsum.photos/100?random=${tag.id}`
              }
              alt={tag.name}
            />
            <ProductInfo>
              <Text variant="caption1">{truncateText(tag.name, 27)}</Text>
              <Text variant="caption1" weight="bold">
                {tag.price}
              </Text>
            </ProductInfo>
          </TaggedProductContent>
          <RemoveButton onClick={() => onRemoveTag(tag.id)}>
            <Text variant="caption1" color="gray">
              삭제
            </Text>
          </RemoveButton>
        </TaggedProductItem>
      ))}
    </TaggedProductsContainer>
  )
}
