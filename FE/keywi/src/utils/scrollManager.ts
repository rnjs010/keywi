// 스크롤 위치 저장
export const saveScrollPosition = (key: string, position: number): void => {
  try {
    localStorage.setItem(`scroll_${key}`, position.toString())
  } catch (error) {
    console.error('스크롤 위치 저장 실패:', error)
  }
}

// 스크롤 위치 가져오기
export const getScrollPosition = (key: string): number => {
  try {
    const positionStr = localStorage.getItem(`scroll_${key}`)
    if (positionStr) {
      return parseInt(positionStr, 10) || 0
    }
  } catch (error) {
    console.error('스크롤 위치 불러오기 실패:', error)
  }
  return 0
}

// 스크롤 이벤트 리스너 추가 - 리턴값은 cleanup 함수
export const addScrollListener = (
  element: HTMLElement | null,
  key: string,
): (() => void) => {
  if (!element) return () => {}

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const position = element.scrollTop
    if (position > 0) {
      saveScrollPosition(key, position)
    }
  }

  // 디바운스 처리된 핸들러
  let timer: number | null = null
  const debouncedHandler = () => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(handleScroll, 100)
  }

  // 이벤트 리스너 등록
  element.addEventListener('scroll', debouncedHandler)

  // 클린업 함수 반환
  return () => {
    element.removeEventListener('scroll', debouncedHandler)
    if (timer) window.clearTimeout(timer)
    handleScroll() // 마지막 위치 저장
  }
}
