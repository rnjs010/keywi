import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Text } from '@/styles/typography'
import { Link } from 'react-router-dom'

const GridContainer = tw.div`
  grid grid-cols-2 gap-4 p-4
`

const ProductItem = styled(Link)`
  ${tw`
    flex
    flex-col
    pb-6
  `}
`

const ProductImage = tw.img`
  w-full
  aspect-square
  object-cover
  rounded-md
  mb-2
`

const ProductInfo = tw.div`
  flex
  flex-col
`

const Manufacturer = tw.span`
  text-xs
  text-gray
  mb-1
`

const ProductName = tw.div`
  font-medium
  text-sm
  mb-1
`

const Price = tw.div`
  font-bold
  text-sm
`

const EmptyContainer = tw.div`
  w-full 
  py-12
  flex 
  justify-center 
  items-center
`

// 제품 타입 정의
export interface Product {
  id: number
  imageUrl: string
  manufacturer: string
  name: string
  price: number
}

interface SearchProductProps {
  products: Product[]
}

export default function SearchProduct({ products }: SearchProductProps) {
  if (!products || products.length === 0) {
    return (
      <EmptyContainer>
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      </EmptyContainer>
    )
  }

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  return (
    <GridContainer>
      {products.map((product) => (
        <ProductItem key={product.id} to={`/product/${product.id}`}>
          <ProductImage src={product.imageUrl} alt={product.name} />
          <ProductInfo>
            <Manufacturer>{product.manufacturer}</Manufacturer>
            <ProductName>{product.name}</ProductName>
            <Price>{formatPrice(product.price)}</Price>
          </ProductInfo>
        </ProductItem>
      ))}
    </GridContainer>
  )
}
