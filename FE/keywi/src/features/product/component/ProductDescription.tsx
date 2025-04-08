import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Text } from '@/styles/typography'
import { ShareIos, Star, StarSolid } from 'iconoir-react'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import apiRequester from '@/services/api'
import { ApiResponse } from '@/interfaces/ApiResponse'
import { useFavorite } from '@/features/product/hooks/useFavorite'
import LinkPreview from '@/features/product/component/LinkPreview'
// useNavigate
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
  p-2
`

const ViewStoreButton = styled.a`
  ${tw`
    py-1.5
    mt-3
    mx-4
    rounded-lg
    border
    border-littleGray
    text-center
  `}
  display: block;
  text-decoration: none;
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
// const DescImg = tw.img`
// `

export default function ProductDescription() {
  const { productId } = useParams<{ productId: string }>()
  // const navigate = useNavigate()
  const [productDetails, setProductDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const {
    isFavorite,
    loading: favoriteLoading,
    toggleFavorite,
  } = useFavorite(Number(productId), productDetails?.isFavorite || false)

  const fetchProductDetails = async () => {
    setLoading(true)
    try {
      const response = await apiRequester.get<ApiResponse<any>>(
        `/api/product/detail/${productId}`,
      )
      if (response.data.status === 'success') {
        setProductDetails({
          ...response.data.data,
          isFavorite: response.data.data.isFavorite ?? false,
        })
      }
    } catch (error) {
      console.error('상품 상세 정보 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard
      .writeText(url)
      .then(() => alert('링크가 클립보드에 복사되었습니다!'))
      .catch((err) => console.error('링크 복사 실패:', err))
  }

  useEffect(() => {
    if (productId) fetchProductDetails()
  }, [productId])

  if (loading) {
    return (
      <ContentContainer>
        <Text variant="body1">로딩 중...</Text>
      </ContentContainer>
    )
  }

  if (!productDetails) {
    return (
      <ContentContainer>
        <Text variant="body1">상품 정보를 불러올 수 없습니다.</Text>
      </ContentContainer>
    )
  }

  return (
    <ContentContainer>
      {/* 상품 이미지 */}
      <ProductImage
        src={productDetails.productImage}
        alt={productDetails.productName}
      />

      {/* 상품 기본 정보 */}
      <ProductInfoSection>
        <Text variant="caption2" color="gray">
          {productDetails.manufacturer}
        </Text>
        <Text variant="body2" weight="bold">
          {productDetails.productName}
        </Text>

        <PriceRow>
          <Text variant="title3" weight="bold">
            {productDetails.price.toLocaleString()}원
          </Text>
          <ActionButtons>
            {/* 찜 버튼 */}
            <IconButton onClick={toggleFavorite} disabled={favoriteLoading}>
              {isFavorite ? (
                <StarSolid width={24} height={24} color="#70C400" />
              ) : (
                <Star width={24} height={24} color="#D6E8BE" />
              )}
            </IconButton>
            {/* 공유 버튼 */}
            <IconButton onClick={handleShare}>
              <ShareIos width={24} height={24} />
            </IconButton>
          </ActionButtons>
        </PriceRow>
      </ProductInfoSection>

      {/* 상점 보기 버튼 */}
      {productDetails.productUrl && (
        <ViewStoreButton
          href={productDetails.productUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text variant="caption1" color="darkGray">
            상품 사이트로 보러가기
          </Text>
        </ViewStoreButton>
      )}

      {/* 상품 설명 렌더링 */}
      <ProductDescSection>
        <SectionTitle>
          <Text variant="body1" weight="bold" color="darkKiwi">
            상품 상세 정보
          </Text>
        </SectionTitle>
        {productDetails.descriptions?.map((desc: any) => (
          <DescriptionRenderer
            key={desc.productDescriptionId}
            description={desc}
          />
        ))}
      </ProductDescSection>
    </ContentContainer>
  )
}

function DescriptionRenderer({ description }: { description: any }) {
  switch (description.contentType) {
    case 'text':
      return (
        <div className="my-2">
          {description.description
            .split('\n')
            .map((line: string, index: number) =>
              line.trim() === '' ? (
                <br key={index} />
              ) : (
                <p key={index} className="text-gray-800 text-sm">
                  {line}
                </p>
              ),
            )}
        </div>
      )
    case 'image':
      return (
        <div className="my-4">
          {description.hyperlink ? (
            <a
              href={description.hyperlink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={description.description}
                alt="상품 이미지"
                className="w-full rounded-md"
              />
            </a>
          ) : (
            <img
              src={description.description}
              alt="상품 이미지"
              className="w-full rounded-md"
            />
          )}
        </div>
      )
    case 'link':
      return (
        <a
          href={description.description}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline my-2"
        >
          <LinkPreview url={description.description} />
        </a>
      )
    case 'hr':
      return (
        <hr
          className={`my-4 ${
            description.description === 'long' ? 'border-t-2' : 'border-t'
          }`}
        />
      )
    case 'embed':
      return (
        <div className="my-4 aspect-video">
          <iframe
            src={description.description}
            title="임베드 콘텐츠"
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      )
    case 'gif':
      return (
        <video className="my-4 w-full" autoPlay loop muted playsInline>
          <source src={description.description} type="video/mp4" />
        </video>
      )
    default:
      return null
  }
}
