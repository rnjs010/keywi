import { Text } from '@/styles/typography'
import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { NavArrowRight, Xmark } from 'iconoir-react'
import { BoardItemUsingInfo } from '@/interfaces/BoardInterface'
import truncateText from '@/utils/truncateText'

const CardContainer = tw.div`
  flex items-center content-center justify-between bg-pay pl-4 py-3 pr-1 rounded-lg my-0.5
`

const ThumbnailImage = tw.img`
  w-[3rem] h-[3rem] rounded-md object-cover self-start
`

export default function BoardProductCard({
  data,
  mode,
  onDelete,
}: {
  data: BoardItemUsingInfo
  mode: 'edit' | 'view' | 'move'
  onDelete?: () => void
}) {
  return (
    <CardContainer>
      {/* 왼쪽 상품 정보 */}
      <div className="flex flex-col">
        <Text variant="body1" weight="bold" color="darkKiwi">
          {data.categoryName}
        </Text>
        <Text variant="caption1" weight="regular">
          {truncateText(data.productName, 20)}
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
        {mode === 'edit' && (
          <div
            onClick={(e) => {
              e.stopPropagation()
              onDelete && onDelete()
            }}
          >
            <Xmark color={colors.darkKiwi} />
          </div>
        )}
        {mode === 'view' && <div className="w-2 h-6"></div>}
      </div>
    </CardContainer>
  )
}
