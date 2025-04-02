import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Text } from '@/styles/typography'
import { Link } from 'react-router-dom'

const GridContainer = tw.div`
  grid grid-cols-2 gap-2 px-2 py-2
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
const ProductName = tw.div`
  mb-1
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
  productId: number
  thumbnailUrl: string
  manufacturer: string
  productName: string
  price: number
}

interface SearchProductProps {
  products: Product[]
}

export default function SearchProduct({ products }: SearchProductProps) {
  if (!products || products.length === 0) {
    return (
      <EmptyContainer>
        <p className="text-gray">검색 결과가 없습니다.</p>
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
        <ProductItem
          key={product.productId}
          to={`/product/${product.productId}`}
        >
          <ProductImage src={product.thumbnailUrl} alt={product.productName} />
          <ProductInfo>
            <Text variant="caption1" color="gray">
              {product.manufacturer}
            </Text>
            <ProductName>
              <Text variant="body1">{product.productName}</Text>
            </ProductName>
            <Text variant="body2" weight="bold">
              {formatPrice(product.price)}
            </Text>
          </ProductInfo>
        </ProductItem>
      ))}
    </GridContainer>
  )
}
