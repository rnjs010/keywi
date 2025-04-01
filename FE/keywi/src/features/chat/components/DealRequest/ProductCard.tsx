import { Text } from '@/styles/typography'
import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { Xmark } from 'iconoir-react'
import { BoardItem } from '@/interfaces/BoardInterface'

const CardContainer = tw.div`
  flex flex-col items-center justify-between bg-pay py-3 px-2 rounded-lg my-1
`

const FlexBox = tw.div`
  flex flex-row w-full items-center justify-between
`

export default function ProductCard({
  data,
  mode,
  onDelete,
}: {
  data: BoardItem
  mode: 'edit' | 'view'
  onDelete?: () => void
}) {
  return (
    <CardContainer>
      <FlexBox>
        <Text variant="body1" weight="bold" color="darkKiwi">
          {data.categoryName}
        </Text>
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
      </FlexBox>

      <FlexBox>
        <Text variant="caption1" weight="regular">
          {data.itemName}
        </Text>
        <Text variant="caption1" weight="bold">
          {data.price.toLocaleString()}원
        </Text>
      </FlexBox>
    </CardContainer>
  )
}
