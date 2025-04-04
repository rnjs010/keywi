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
import { Bookmark, BookmarkSolid } from 'iconoir-react'
import { useState } from 'react'
import { colors } from '@/styles/colors'

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
                src={
                  tag.thumbnail || `https://picsum.photos/100?random=${tag.id}`
                }
                alt={tag.name}
              />
              <ProductInfo>
                <Text variant="caption1">{tag.name}</Text>
                <div>
                  <Text variant="caption1" weight="bold">
                    {tag.price}
                  </Text>
                </div>
              </ProductInfo>
              <BookmarkButton onClick={() => handleBookmark(tag.id)}>
                {bookmarks[tag.id] ? (
                  <BookmarkSolid height={22} width={22} color={colors.kiwi} />
                ) : (
                  <Bookmark height={22} width={22} strokeWidth={1.5} />
                )}
              </BookmarkButton>
            </TagItemContainer>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
