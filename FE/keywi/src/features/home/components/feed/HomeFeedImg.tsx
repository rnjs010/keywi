import { Text } from '@/styles/typography'
import { NavArrowRight } from 'iconoir-react'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { ProductTag } from '@/interfaces/HomeInterfaces'
import HomeFeedTag from './HomeFeedTag'
import HomeFeedTagBtn from './HomeFeedTagBtn'
import HomeTagListModal from './HomeTagListModal'

const Container = tw.div`
  w-full
  relative
`

const ImgContainer = tw.div`
  w-full
  relative
  pb-[100%]
`

const MainImg = tw.img`
  absolute
  top-0
  left-0
  w-full
  h-full
  object-cover
`

const TagBtnWrapper = tw.div`
  flex  
  justify-end
  py-3
  px-4
  w-full
`

const TagBtn = tw.button`
  flex
  items-center
`

const IndicatorContainer = tw.div`
  absolute
  bottom-3
  left-0
  right-0
  flex
  justify-center
  gap-1
  z-10
`

const Indicator = styled.div<{ $active: boolean }>`
  ${tw`
    h-1
    rounded-full
    transition-all
    duration-300
  `}
  width: ${(props) => (props.$active ? '16px' : '8px')};
  background-color: ${(props) =>
    props.$active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
`

// 임시로 picsum 이미지를 사용한 기본 이미지 배열 생성 - 없앨 것임
const createTempImages = (count: number = 3) => {
  return Array.from({ length: count }, (_, i) => {
    // 각 이미지마다 다른 ID 사용하여 캐싱 문제 방지
    return `https://picsum.photos/500?random=${i}`
  })
}

interface HomeFeedImgProps {
  mainImages?: string[]
  productTags?: ProductTag[]
}

export default function HomeFeedImg({
  mainImages,
  productTags,
}: HomeFeedImgProps) {
  // 전달된 이미지가 없으면 임시 이미지 사용
  const images =
    mainImages && mainImages.length > 0 ? mainImages : createTempImages(3)

  const hasMultipleImages = images.length > 1
  const [currentIndex, setCurrentIndex] = useState(0)
  const [api, setApi] = useState<any>(null)
  const [showTags, setShowTags] = useState(false)

  // 첫 번째 이미지에만 태그를 표시하기 위한 조건
  const shouldShowTagToggle =
    currentIndex === 0 && productTags && productTags.length > 0

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      const newIndex = api.selectedScrollSnap()
      setCurrentIndex(newIndex)

      // 첫 번째 이미지가 아니면 태그 숨기기
      if (newIndex !== 0) {
        setShowTags(false)
      }
    }

    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  const toggleTags = () => {
    setShowTags(!showTags)
  }

  const TagButtonTrigger = (
    <TagBtn>
      <Text variant="caption1">태그된 상품들 보러가기</Text>
      <NavArrowRight height={18} width={18} />
    </TagBtn>
  )

  return (
    <Container>
      {hasMultipleImages ? (
        <>
          <Carousel className="w-full" setApi={setApi}>
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <ImgContainer>
                    <MainImg src={image} alt={`피드 이미지 ${index + 1}`} />

                    {/* 첫 번째 이미지이고 태그 토글 버튼이 있어야 하는 경우 */}
                    {index === 0 && shouldShowTagToggle && (
                      <HomeFeedTagBtn onClick={toggleTags} />
                    )}

                    {/* 첫 번째 이미지에서만 태그가 나타나도록 */}
                    {index === 0 && productTags && productTags.length > 0 && (
                      <HomeFeedTag
                        productTags={productTags}
                        showTags={showTags}
                      />
                    )}
                  </ImgContainer>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* 인디케이터 */}
            <IndicatorContainer>
              {images.map((_, index) => (
                <Indicator key={index} $active={currentIndex === index} />
              ))}
            </IndicatorContainer>
          </Carousel>
        </>
      ) : (
        // 단일 이미지인 경우
        <ImgContainer>
          <MainImg src={images[0]} alt="피드 이미지" />

          {/* 태그 토글 버튼 */}
          {shouldShowTagToggle && <HomeFeedTagBtn onClick={toggleTags} />}

          {/* 태그 표시 */}
          <HomeFeedTag productTags={productTags} showTags={showTags} />
        </ImgContainer>
      )}

      <TagBtnWrapper>
        {/* 태그 모달 컴포넌트 */}
        <HomeTagListModal
          productTags={productTags}
          triggerComponent={TagButtonTrigger}
        />
      </TagBtnWrapper>
    </Container>
  )
}
