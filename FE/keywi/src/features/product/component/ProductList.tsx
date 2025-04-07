import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Text } from '@/styles/typography'
import { Link } from 'react-router-dom'
import { ProductProps } from '@/interfaces/ProductInterface'
import { useState } from 'react'
import { Star, StarSolid } from 'iconoir-react'
import { colors } from '@/styles/colors'
import apiRequester from '@/services/api'

const GridContainer = tw.div`
  grid 
  grid-cols-2 
  gap-2 
  px-2 
  py-2
  pb-20
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
  const [favoriteProducts, setFavoriteProducts] = useState<{
    [key: number]: boolean
  }>(() => {
    const initialFavorites: { [key: number]: boolean } = {}
    products.forEach((product) => {
      initialFavorites[product.productId] = product.isFavorite || false
    })
    return initialFavorites
  })

  const [loadingProducts, setLoadingProducts] = useState<{
    [key: number]: boolean
  }>({})

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  const toggleFavorite = async (productId: number) => {
    setLoadingProducts((prev) => ({ ...prev, [productId]: true }))
    const prevState = favoriteProducts[productId]

    try {
      setFavoriteProducts((prev) => ({ ...prev, [productId]: !prevState }))
      await apiRequester.post('/api/product/favorites', { productId })
    } catch (error) {
      setFavoriteProducts((prev) => ({ ...prev, [productId]: prevState }))
      console.error('찜 토글 실패:', error)
    } finally {
      setLoadingProducts((prev) => ({ ...prev, [productId]: false }))
    }
  }

  return (
    <GridContainer>
      {products.map((product) => (
        <ProductItem
          key={product.productId}
          to={`/product/detail/${product.productId}`}
          state={{
            category: location.pathname,
          }}
        >
          <ImageContainer>
            <ProductImage
              src={product.productImage}
              alt={product.productName}
            />
            <ZzimBtn
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                e.stopPropagation()
                toggleFavorite(product.productId)
              }}
              disabled={loadingProducts[product.productId] || false}
            >
              {favoriteProducts[product.productId] ? (
                <StarSolid width="1.5rem" height="1.5rem" color={colors.kiwi} />
              ) : (
                <Star width="1.5rem" height="1.5rem" color={colors.lightKiwi} />
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
