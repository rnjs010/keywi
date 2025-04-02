import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Text } from '@/styles/typography'
import { Link } from 'react-router-dom'
import { ProductProps } from '@/interfaces/ProductInterface'
import { useState } from 'react'
import { Star, StarSolid } from 'iconoir-react'
import { colors } from '@/styles/colors'

const GridContainer = tw.div`
  grid 
  grid-cols-2 
  gap-2 
  px-2 
  py-2
`
const ProductItem = styled(Link)`
  ${tw`
    flex
    flex-col
    pb-6
  `}
`
const ImageContainer = tw.div`
  relative
  w-full
  aspect-square
`
const ZzimBtn = tw.button`
  absolute
  top-2
  right-2
  p-1
  rounded-full
  z-10
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

interface SearchProductProps {
  products: ProductProps[]
}

export default function ProductList({ products }: SearchProductProps) {
  // 로컬 상태로 찜 상태 관리 (초기값은 prop에서 받은 isFavorite) - 추후 zustand 활용해도 됨
  const [favoriteProducts, setFavoriteProducts] = useState<{
    [key: number]: boolean
  }>(() => {
    const initialFavorites: { [key: number]: boolean } = {}
    products.forEach((product) => {
      initialFavorites[product.productId] = product.isFavorite || false
    })
    return initialFavorites
  })

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  // 찜하기/취소 기능
  const toggleFavorite = (e: React.MouseEvent, productId: number) => {
    e.preventDefault() // 링크 이동 방지
    e.stopPropagation() // 이벤트 버블링 방지

    setFavoriteProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  return (
    <GridContainer>
      {products.map((product) => (
        <ProductItem
          key={product.productId}
          to={`/product/${product.productId}`}
        >
          <ImageContainer>
            <ProductImage
              src={product.thumbnailUrl}
              alt={product.productName}
            />
            <ZzimBtn
              onClick={(e: React.MouseEvent) =>
                toggleFavorite(e, product.productId)
              }
            >
              {favoriteProducts[product.productId] ? (
                <StarSolid
                  width={'1.5rem'}
                  height={'1.5rem'}
                  color={colors.kiwi}
                />
              ) : (
                <Star
                  width={'1.5rem'}
                  height={'1.5rem'}
                  color={colors.lightKiwi}
                />
              )}
            </ZzimBtn>
          </ImageContainer>
          <ProductInfo>
            <Text variant="caption2" color="gray">
              {product.manufacturer}
            </Text>
            <ProductName>
              <Text variant="caption1">{product.productName}</Text>
            </ProductName>
            <Text variant="body1" weight="bold">
              {formatPrice(product.price)}
            </Text>
          </ProductInfo>
        </ProductItem>
      ))}
    </GridContainer>
  )
}
