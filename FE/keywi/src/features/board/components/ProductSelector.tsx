import { Text } from '@/styles/typography'
import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { Plus } from 'iconoir-react'
import { BoardItemUsingInfo } from '@/interfaces/BoardInterface'
import BoardProductCard from './BoardProductCard'

const CategoryRow = tw.div`
  flex justify-between items-center pl-4 py-2 pr-1 rounded-lg mb-2 bg-pay
`

interface ProductSelectorProps {
  label: string
  product?: BoardItemUsingInfo
  onAdd?: () => void
  onDelete?: () => void
}

export default function ProductSelector({
  label,
  product,
  onAdd,
  onDelete,
}: ProductSelectorProps) {
  return (
    <>
      {product ? (
        <div className="mb-2">
          <BoardProductCard data={product} mode="edit" onDelete={onDelete} />
        </div>
      ) : (
        <CategoryRow>
          <Text variant="body1" weight="bold" color="darkKiwi">
            {label}
          </Text>
          <Plus color={colors.darkKiwi} onClick={onAdd} />
        </CategoryRow>
      )}
    </>
  )
}
