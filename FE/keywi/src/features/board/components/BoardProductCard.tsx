import { Text } from '@/styles/typography'
import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { NavArrowRight } from 'iconoir-react'
import { LuPencil } from 'react-icons/lu'
import { BoardItem } from '@/interfaces/BoardInterface'

const CardContainer = tw.div`
  flex items-center content-center justify-between bg-pay pl-4 py-4 pr-1 rounded-lg my-2
`

const ThumbnailImage = tw.img`
  w-[3rem] h-[3rem] rounded-md object-cover self-start
`

export default function BoardProductCard({
  data,
  mode,
}: {
  data: BoardItem
  mode: 'edit' | 'view' | 'move'
}) {
  return (
    <CardContainer>
      {/* 왼쪽 상품 정보 */}
      <div className="flex flex-col">
        <div className="flex flex-row items-center gap-2">
          <Text variant="body1" weight="bold" color="darkKiwi">
            {data.categoryName}
          </Text>
          {mode === 'edit' && <LuPencil color={colors.darkKiwi} />}
        </div>
        <Text variant="caption1" weight="regular">
          {data.itemName}
        </Text>
        <Text variant="caption1" weight="bold">
          {data.price.toLocaleString()}원
        </Text>
      </div>

      {/* 오른쪽 이미지 및 아이콘 */}
      <div className="flex flex-row items-center gap-1">
        {data.imageUrl && (
          <ThumbnailImage src={data.imageUrl} alt="thumbnail" />
        )}
        {mode === 'move' && <NavArrowRight color={colors.darkKiwi} />}
      </div>
    </CardContainer>
  )
}
