import React, { useState } from 'react'
import tw from 'twin.macro'
import ProductSelector from './ProductSelector'
import ProductModal from './ProductModal'
import styled from '@emotion/styled'
import { Product } from '@/interfaces/BoardInterface'

// 샘플 데이터
const initialProducts: Product[] = [
  { id: '1', category: '기본', name: '오스틴 샤지 키드', price: 140000 },
  {
    id: '2',
    category: '커버',
    name: '세라믹 마블 V2 키캡 Blue Cracked',
    price: 217000,
  },
  {
    id: '3',
    category: '케이블',
    name: '트렁키 코일 그라데이션 키캡 Purple',
    price: 14900,
  },
  {
    id: '4',
    category: '커버',
    name: '마블 V2 키캡 Blue Cracked',
    price: 217000,
  },
]

const Container = styled.div`
  ${tw`flex flex-col bg-white rounded-md w-full max-w-md mx-auto h-screen`}
`

const Header = styled.div`
  ${tw`p-4 bg-gray flex items-center`}
`

const Title = styled.h1`
  ${tw`text-lg font-medium text-center flex-1`}
`

const CloseButton = styled.button`
  ${tw`text-2xl`}
`

const Form = styled.div`
  ${tw`flex flex-col p-4 flex-1`}
`

const ProductTitle = styled.div`
  ${tw`flex items-center mb-4`}
`

const ProductName = styled.h2`
  ${tw`text-green-600 font-medium`}
`

const EditIcon = styled.span`
  ${tw`text-green-600 ml-1`}
`

const ProductList = styled.div`
  ${tw`flex flex-col gap-3`}
`

const SubmitButton = styled.button`
  ${tw`bg-green-500 text-white py-3 rounded-md mt-auto text-lg font-medium`}
`

export default function ProductForm() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, Product>
  >({
    기본: initialProducts[0],
  })
  const [currentCategory, setCurrentCategory] = useState<string>('')

  const handleAddProduct = (category: string) => {
    setCurrentCategory(category)
    setIsModalOpen(true)
  }

  const handleSelectProduct = (product: Product) => {
    if (selectedProducts[product.category]?.id === product.id) {
      // 이미 선택된 상품이면 선택 해제
      const updatedProducts = { ...selectedProducts }
      delete updatedProducts[product.category]
      setSelectedProducts(updatedProducts)
    } else {
      // 새로운 상품 선택
      setSelectedProducts({
        ...selectedProducts,
        [product.category]: product,
      })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const categories = [
    { id: 'cover', name: '커버' },
    { id: 'switch', name: '스위치' },
    { id: 'stabilizer', name: '스테빌라이저' },
    { id: 'keycap', name: '키캡' },
    { id: 'cable', name: '케이블' },
    { id: 'etc', name: '기타' },
  ]

  return (
    <Container>
      <Header>
        <CloseButton>×</CloseButton>
        <Title>견적 상품 선택</Title>
      </Header>

      <Form>
        <ProductTitle>
          <ProductName>Queen Keys' SIS0042-17K PINK</ProductName>
          <EditIcon>✏️</EditIcon>
        </ProductTitle>

        <ProductList>
          {Object.entries(selectedProducts).map(([category, product]) => (
            <ProductSelector
              key={category}
              label={category}
              product={product}
              onEdit={() => handleAddProduct(category)}
            />
          ))}

          {categories.map(
            (category) =>
              !selectedProducts[category.name] && (
                <ProductSelector
                  key={category.id}
                  label={category.name}
                  onAdd={() => handleAddProduct(category.name)}
                />
              ),
          )}
        </ProductList>

        <SubmitButton>확인</SubmitButton>
      </Form>

      {isModalOpen && (
        <ProductModal
          products={initialProducts.filter(
            (p) => !currentCategory || p.category === currentCategory,
          )}
          selectedProducts={selectedProducts}
          onSelect={handleSelectProduct}
          onClose={handleCloseModal}
        />
      )}
    </Container>
  )
}
