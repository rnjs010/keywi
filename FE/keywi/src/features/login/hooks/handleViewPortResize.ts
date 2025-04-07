import { useEffect } from 'react'

export const handleViewPortResize = () => {
  useEffect(() => {
    const handleFocus = () => {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY

      // 스크롤 이벤트 발생 시 원래 위치로 복원
      const handleScroll = () => {
        window.scrollTo(0, scrollY)
      }

      // 스크롤 이벤트 리스너 추가
      window.addEventListener('scroll', handleScroll)

      // 포커스가 해제되면 리스너 제거
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }

    // 입력 필드에 포커스 이벤트 리스너 추가
    const inputElement = document.querySelector('input[name="nickname"]')
    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus)

      return () => {
        inputElement.removeEventListener('focus', handleFocus)
      }
    }
  }, [])
}
