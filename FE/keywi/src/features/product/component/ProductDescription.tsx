import { Text } from '@/styles/typography'
import { ShareIos, Star } from 'iconoir-react'
import tw from 'twin.macro'
import styled from '@emotion/styled'

const ContentContainer = styled.div`
  ${tw`
  flex-1
  flex
  flex-col
  overflow-y-auto
  pb-16
  `}

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }

  /* iOS 스크롤 부드럽게 */
  -webkit-overflow-scrolling: touch;
`
const ProductImage = tw.img`
  w-full
  aspect-square
  object-cover
`
const ProductInfoSection = tw.div`
  p-4
  flex
  flex-col
`
const PriceRow = tw.div`
  flex
  justify-between
  items-center
  mt-3
`
const ActionButtons = tw.div`
  flex
  gap-4
`
const IconButton = tw.button`

`
const ViewStoreButton = tw.button`
  py-1.5
  mt-3
  mx-4
  rounded-lg
  border
  border-littleGray
  text-center
`
const ProductDescSection = tw.div`
  mt-7
  p-4
  border-t
  border-littleGray
`
const SectionTitle = tw.div`
  mb-3
`
const DescImg = tw.img`
`

export default function ProductDescription() {
  // 상품 상세 정보 (실제로는 API로 가져와야 함)
  const product = {
    id: 1,
    name: 'QK80MK2 WK PINK',
    manufacturer: 'Qwertykeys',
    price: 241000,
    image: 'https://picsum.photos/600/600?keyboard=1',
    description: 'https://picsum.photos/600/1200',
  }
  return (
    <ContentContainer>
      {/* 상품 이미지 */}
      <ProductImage src={product.image} alt={product.name} />

      {/* 상품 정보 */}
      <ProductInfoSection>
        <Text variant="caption2" color="gray">
          {product.manufacturer}
        </Text>
        <Text variant="body2" weight="bold">
          {product.name}
        </Text>

        <PriceRow>
          <Text variant="title3" weight="bold">
            {product.price.toLocaleString()}원
          </Text>
          <ActionButtons>
            <IconButton>
              <Star width={24} height={24} />
            </IconButton>
            <IconButton>
              <ShareIos width={24} height={24} />
            </IconButton>
          </ActionButtons>
        </PriceRow>
      </ProductInfoSection>

      {/* 상점 보기 버튼 */}
      <ViewStoreButton>
        <Text variant="caption1" color="darkGray">
          상품 사이트로 보러가기
        </Text>
      </ViewStoreButton>

      {/* 상품 설명 */}
      <ProductDescSection>
        <SectionTitle>
          <Text variant="body1" weight="bold" color="darkKiwi">
            상품 정보
          </Text>
        </SectionTitle>
        <DescImg src={product.description} />
      </ProductDescSection>
    </ContentContainer>
  )
}
