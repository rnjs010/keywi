import React, { useState } from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Product } from '@/interfaces/BoardInterface'

interface ProductModalProps {
  products: Product[]
  selectedProducts: Record<string, Product>
  onSelect: (product: Product) => void
  onClose: () => void
}

const Overlay = styled.div`
  ${tw`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
`

const ModalContainer = styled.div`
  ${tw`bg-white w-full h-full flex flex-col`}
`

const Header = styled.div`
  ${tw`p-4 bg-gray text-white flex items-center`}
`

const CloseButton = styled.button`
  ${tw`text-white text-xl mr-2`}
`

const Title = styled.h2`
  ${tw`flex-1 text-center`}
`

const Content = styled.div`
  ${tw`flex-1 overflow-y-auto p-4`}
`

const CategoryName = styled.h3`
  ${tw`font-medium mt-4 mb-2`}
`

const ProductList = styled.div`
  ${tw`flex flex-col gap-2`}
`

const ProductItem = styled.div<{ selected: boolean }>`
  ${tw`p-3 border border-gray rounded-md`}
  ${({ selected }) => selected && tw`bg-green-100`}
`

const ProductName = styled.div`
  ${tw`font-medium mb-1`}
`

const ProductPrice = styled.div`
  ${tw`text-gray`}
`

const Numpad = styled.div`
  ${tw`grid grid-cols-10 gap-2 p-4 bg-gray`}
`

const NumKey = styled.button`
  ${tw`p-2 bg-white rounded-md text-center`}
`

export default function ProductModal({
  products,
  selectedProducts,
  onSelect,
  onClose,
}: ProductModalProps) {
  const [searchValue, setSearchValue] = useState('')

  // 선택 여부 확인 함수
  const isSelected = (product: Product) => {
    return selectedProducts[product.category]?.id === product.id
  }

  // 카테고리별로 상품 그룹화
  const groupedProducts = products.reduce(
    (acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = []
      }
      acc[product.category].push(product)
      return acc
    },
    {} as Record<string, Product[]>,
  )

  // 검색어 필터링
  const filteredProducts = Object.entries(groupedProducts).reduce(
    (acc, [category, categoryProducts]) => {
      const filtered = categoryProducts.filter((product) =>
        product.name.toLowerCase().includes(searchValue.toLowerCase()),
      )
      if (filtered.length > 0) {
        acc[category] = filtered
      }
      return acc
    },
    {} as Record<string, Product[]>,
  )

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <CloseButton onClick={onClose}>×</CloseButton>
          <Title>견적 상품 선택</Title>
        </Header>

        <Content>
          {searchValue && <div tw="mb-2">검색어: {searchValue}</div>}

          {Object.entries(filteredProducts).map(([category, products]) => (
            <React.Fragment key={category}>
              <CategoryName>{category}</CategoryName>
              <ProductList>
                {products.map((product) => (
                  <ProductItem
                    key={product.id}
                    selected={isSelected(product)}
                    onClick={() => onSelect(product)}
                  >
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>
                      {product.price.toLocaleString()}원
                    </ProductPrice>
                  </ProductItem>
                ))}
              </ProductList>
            </React.Fragment>
          ))}
        </Content>

        {/* <Numpad>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <NumKey key={num} onClick={() => setSearchValue(searchValue + num)}>
              {num}
            </NumKey>
          ))}
          <NumKey onClick={() => setSearchValue('')} tw="col-span-2">
            취소
          </NumKey>
          {[
            'ㄱ',
            'ㄴ',
            'ㄷ',
            'ㄹ',
            'ㅁ',
            'ㅂ',
            'ㅅ',
            'ㅇ',
            'ㅈ',
            'ㅊ',
            'ㅋ',
            'ㅌ',
            'ㅍ',
            'ㅎ',
            'ㅏ',
          ].map((char) => (
            <NumKey
              key={char}
              onClick={() => setSearchValue(searchValue + char)}
            >
              {char}
            </NumKey>
          ))}
          <NumKey
            onClick={() => setSearchValue(searchValue.slice(0, -1))}
            tw="col-span-3"
          >
            <span>←</span>
          </NumKey>
        </Numpad> */}
      </ModalContainer>
    </Overlay>
  )
}
