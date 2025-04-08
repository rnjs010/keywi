import { Text } from '@/styles/typography'
import { colors } from '@/styles/colors'
import tw from 'twin.macro'
import { Plus } from 'iconoir-react'
import { BoardItemUsingInfo } from '@/interfaces/BoardInterface'
import ProductCard from './ProductCard'

const CategoryRow = tw.div`
  flex justify-between items-center px-2 py-2 rounded-lg mb-2 bg-pay
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
        <ProductCard data={product} mode="edit" onDelete={onDelete} />
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
