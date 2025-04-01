import tw from 'twin.macro'
import styled from '@emotion/styled'
import { useState } from 'react'
import { Star, StarSolid } from 'iconoir-react'
import { colors } from '@/styles/colors'

const StarsContainer = tw.div`
  flex flex-col items-center justify-center gap-1 my-4
`
const StarsRow = tw.div`
  flex items-center justify-center gap-1
`

// 별 컨테이너 - 별 하나 전체를 감싸는 컨테이너
const StarWrapper = styled.div`
  ${tw`
    relative
    w-[3rem]
    h-[3rem]
  `}
  display: inline-block;
`

// 별의 왼쪽 영역
const LeftHalf = styled.div`
  ${tw`
    absolute
    top-0
    left-0
    z-10
  `}
  width: 50%;
  height: 100%;
  cursor: pointer;
`

// 별의 오른쪽 영역
const RightHalf = styled.div`
  ${tw`
    absolute
    top-0
    right-0
    z-10
  `}
  width: 50%;
  height: 100%;
  cursor: pointer;
`

// 실제 별 아이콘
const StarBackground = styled.div`
  ${tw`
    absolute
    top-0
    left-0
    w-full
    h-full
    flex
    items-center
    justify-center
    pointer-events-none
  `}
`

// 컬러 오버레이 - 반쪽 별 구현을 위한 컨테이너
const ColorOverlay = styled.div<{ $rating: number; $index: number }>`
  ${tw`
    absolute
    top-0
    left-0
    h-full
    overflow-hidden
    pointer-events-none
  `}

  // 별점에 따라 너비 계산
  width: ${({ $rating, $index }) => {
    const fullStarValue = $index + 1

    // 현재 별이 꽉 찬 경우
    if ($rating >= fullStarValue) return '100%'

    // 현재 별이 반쪽인 경우
    if ($rating >= fullStarValue - 0.5 && $rating < fullStarValue) return '50%'

    // 현재 별이 비어있는 경우
    return '0%'
  }};
`

export function ReviewStars() {
  // 별점 상태 관리
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  // 별점 변경 함수 (0.5점 단위)
  const handleRating = (starIndex: number, isLeftHalf: boolean) => {
    // isLeftHalf가 true면 해당 별의 0.5점, false면 1점
    const newRating = starIndex + (isLeftHalf ? 0.5 : 1)
    setRating(newRating)
  }

  // 호버 효과
  const handleMouseEnter = (starIndex: number, isLeftHalf: boolean) => {
    const hoverValue = starIndex + (isLeftHalf ? 0.5 : 1)
    setHoveredRating(hoverValue)
  }

  const handleMouseLeave = () => {
    setHoveredRating(0)
  }

  // 현재 표시할 별점 (호버 중이면 호버 값, 아니면 실제 별점)
  const displayRating = hoveredRating > 0 ? hoveredRating : rating

  // 별 5개 생성
  const stars = Array(5)
    .fill(0)
    .map((_, index) => (
      <StarWrapper key={index} onMouseLeave={handleMouseLeave}>
        {/* 별의 왼쪽 영역 (클릭 시 0.5점) */}
        <LeftHalf
          onClick={() => handleRating(index, true)}
          onMouseEnter={() => handleMouseEnter(index, true)}
        />

        {/* 별의 오른쪽 영역 (클릭 시 1점) */}
        <RightHalf
          onClick={() => handleRating(index, false)}
          onMouseEnter={() => handleMouseEnter(index, false)}
        />

        {/* 빈 별 */}
        <StarBackground>
          <Star width="3rem" height="3rem" color={colors.lightKiwi} />
        </StarBackground>

        {/* 채워진 별 */}
        <ColorOverlay $rating={displayRating} $index={index}>
          <StarSolid width="3rem" height="3rem" color={colors.kiwi} />
        </ColorOverlay>
      </StarWrapper>
    ))

  return (
    <StarsContainer>
      <StarsRow>{stars}</StarsRow>
      {/* 여기서 점수 보내주면 됨 */}
      {/* {rating > 0 && (
        <div className="text-sm text-gray-500 mt-2">{rating}점</div>
      )} */}
    </StarsContainer>
  )
}
