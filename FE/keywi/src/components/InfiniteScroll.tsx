import { ReactNode, useEffect, useState } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

interface InfiniteScrollProps {
  onLoadMore: () => void
  hasNextPage: boolean | undefined
  isLoading: boolean
  loadingComponent?: ReactNode
  children: ReactNode
  threshold?: number // 관찰 임계값 (0-1)
  rootMargin?: string // 루트 요소의 여백
}

export default function InfiniteScroll({
  onLoadMore,
  hasNextPage,
  isLoading,
  loadingComponent = <div className="py-4 text-center">로딩 중...</div>,
  children,
  threshold = 0.1,
  rootMargin = '0px 0px 300px 0px', // 스크롤 하기 전에 더 미리 로드
}: InfiniteScrollProps) {
  const [attemptedLoad, setAttemptedLoad] = useState(false)

  // 사용자 정의 훅 사용
  const { ref, inView } = useIntersectionObserver({
    rootMargin,
    threshold,
  })

  // 디버깅용 로그 추가
  useEffect(() => {
    console.log('InfiniteScroll 상태:', {
      inView,
      hasNextPage,
      isLoading,
      attemptedLoad,
    })
  }, [inView, hasNextPage, isLoading, attemptedLoad])

  // 스크롤이 감지되면 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage && !isLoading && !attemptedLoad) {
      console.log('다음 페이지 로드 시도')
      setAttemptedLoad(true)
      onLoadMore()
    }
  }, [inView, hasNextPage, isLoading, onLoadMore, attemptedLoad])

  // 로딩이 완료되면 다시 로드 시도 가능하도록 설정
  useEffect(() => {
    if (!isLoading && attemptedLoad) {
      setAttemptedLoad(false)
    }
  }, [isLoading])

  return (
    <>
      {children}

      {/* 로드 더보기 감지 지점 */}
      <div ref={ref} className="w-full" style={{ minHeight: '10px' }}>
        {isLoading && loadingComponent}

        {/* 디버깅용 숨겨진 상태 표시 (개발 중에만 사용) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray opacity-50 text-center">
            {hasNextPage
              ? '더 불러올 페이지가 있습니다'
              : '더 이상 페이지가 없습니다'}
          </div>
        )}
      </div>
    </>
  )
}
