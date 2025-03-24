import React from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Product } from '@/interfaces/BoardInterface'

interface ProductSelectorProps {
  label: string
  product?: Product
  onAdd?: () => void
  onEdit?: () => void
}

const Container = styled.div`
  ${tw`flex flex-col`}
`

const LabelRow = styled.div`
  ${tw`flex justify-between items-center mb-1`}
`

const Label = styled.label`
  ${tw`font-medium`}
`

const AddButton = styled.button`
  ${tw`text-xl text-green-500 font-bold`}
`

const ProductBox = styled.div`
  ${tw`p-3 border border-gray rounded-md mb-4`}
`

const ProductName = styled.div`
  ${tw`font-medium mb-2`}
`

const Price = styled.div`
  ${tw`text-gray`}
`

export default function ProductSelector({
  label,
  product,
  onAdd,
  onEdit,
}: ProductSelectorProps) {
  return (
    <Container>
      <LabelRow>
        <Label>{label}</Label>
        {product ? (
          <AddButton onClick={onEdit}>✏️</AddButton>
        ) : (
          <AddButton onClick={onAdd}>+</AddButton>
        )}
      </LabelRow>

      {product && (
        <ProductBox>
          <ProductName>{product.name}</ProductName>
          <Price>{product.price.toLocaleString()}원</Price>
        </ProductBox>
      )}
    </Container>
  )
}
