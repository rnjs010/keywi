import tw from 'twin.macro'
import styled from '@emotion/styled'
import { Text } from '@/styles/typography'
import { Link } from 'react-router-dom'
import { StarSolid } from 'iconoir-react'
import { colors } from '@/styles/colors'
import { useZzimProducts } from '../../hooks/useFavoriteProducts'
import LoadingMessage from '@/components/message/LoadingMessage'

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
const EmptyState = tw.div`
  flex
  flex-col
  items-center
  justify-center
  w-full
  py-16
  px-4
  text-center
`

export default function FavoriteProductList() {
  const {
    favoriteProducts: favoriteProducts,
    isLoading: isFavLoading,
    toggleFavorite,
    isToggling,
  } = useZzimProducts()

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  if (isFavLoading) {
    return <LoadingMessage />
  }

  if (favoriteProducts.length === 0) {
    return (
      <EmptyState>
        <Text variant="body1" color="darkGray">
          찜한 상품이 없습니다.
        </Text>
        <Text variant="caption1" color="gray">
          관심있는 상품을 찜해보세요!
        </Text>
      </EmptyState>
    )
  }

  return (
    <GridContainer>
      {favoriteProducts.map((product) => (
        <ProductItem
          key={product.productId}
          to={`/product/detail/${product.productId}`}
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
              disabled={isToggling[product.productId] || false}
            >
              <StarSolid width="1.5rem" height="1.5rem" color={colors.kiwi} />
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
