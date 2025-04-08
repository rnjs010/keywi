import { useEffect, useState, useRef } from 'react'
import styled from '@emotion/styled'
import tw from 'twin.macro'
import { keyframes, css } from '@emotion/react'
import { colors } from '@/styles/colors'

// 회전 애니메이션
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const PullContainer = styled.div<{ height: number; isDragging: boolean }>`
  ${tw`flex items-center justify-center overflow-hidden transition-all duration-300 w-full`}
  height: ${({ height }) => height}px;
  opacity: ${({ height }) => Math.min(height / 70, 1)};
  transform: translateY(
    ${({ isDragging, height }) => (isDragging ? height / 2 : 0)}px
  );
`
// 스피너 애니메이션 수정 - css로 감싸기
const RefreshIcon = styled.div<{ isRefreshing: boolean }>`
  ${tw`mx-auto flex items-center justify-center`}
  animation: ${({ isRefreshing }) =>
    isRefreshing
      ? css`
          ${rotate} 1s infinite linear
        `
      : 'none'};
  color: ${colors.kiwi};
`

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  scrollRef: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}

export default function PullToRefresh({
  onRefresh,
  scrollRef,
  children,
}: PullToRefreshProps) {
  const [pullHeight, setPullHeight] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef(0)
  const threshold = 70 // 당겨서 새로고침 시작 기준 높이

  // 터치 시작 이벤트 핸들러
  const handleTouchStart = (e: TouchEvent) => {
    // 스크롤이 맨 위에 있는 경우에만 작동
    if (scrollRef.current && scrollRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY
      setIsDragging(true)
    }
  }

  // 터치 이동 이벤트 핸들러
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return

    const currentY = e.touches[0].clientY
    const diff = currentY - startY.current

    // 아래로 당기는 경우만 처리 (diff > 0)
    if (diff > 0) {
      // 저항 효과를 위해 제곱근 사용
      const newHeight = Math.sqrt(diff) * 5
      setPullHeight(Math.min(newHeight, threshold * 1.5))
      e.preventDefault() // 스크롤 방지
    }
  }

  // 터치 종료 이벤트 핸들러
  const handleTouchEnd = async () => {
    if (!isDragging) return

    // 임계값을 넘었으면 새로고침 실행
    if (pullHeight >= threshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setTimeout(() => {
          setIsRefreshing(false)
          setPullHeight(0)
        }, 500) // 새로고침 애니메이션을 보여주기 위한 지연
      }
    } else {
      // 임계값에 못 미치면 바로 원래 상태로
      setPullHeight(0)
    }
    setIsDragging(false)
  }

  // 이벤트 리스너 등록
  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    element.addEventListener('touchstart', handleTouchStart)
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd)

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, pullHeight])

  return (
    <>
      <PullContainer height={pullHeight} isDragging={isDragging}>
        <RefreshIcon isRefreshing={isRefreshing}>
          {isRefreshing && <img src={'/spinner/loading.gif'} />}
        </RefreshIcon>
      </PullContainer>
      {children}
    </>
  )
}
