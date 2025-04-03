import { ReactNode, useEffect } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

interface InfiniteScrollProps {
  onLoadMore: () => void
  hasNextPage: boolean | undefined
  isLoading: boolean
  loadingComponent?: ReactNode
  children: ReactNode
}

export default function InfiniteScroll({
  onLoadMore,
  hasNextPage,
  isLoading,
  loadingComponent = <div className="py-4 text-center">로딩 중...</div>,
  children,
}: InfiniteScrollProps) {
  // 자체 구현한 훅 사용
  const { ref, inView } = useIntersectionObserver({
    rootMargin: '0px 0px 200px 0px', // 스크롤 하기 전에 미리 로드
    threshold: 0.1,
  })

  // 스크롤이 감지되면 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage && !isLoading) {
      onLoadMore()
    }
  }, [inView, hasNextPage, isLoading, onLoadMore])

  return (
    <>
      {children}

      {/* 로드 더보기 감지 지점 */}
      {(hasNextPage || isLoading) && (
        <div ref={ref} className="w-full">
          {isLoading && loadingComponent}
        </div>
      )}
    </>
  )
}
