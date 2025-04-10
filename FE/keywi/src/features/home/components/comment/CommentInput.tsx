import tw from 'twin.macro'
import { useState, useEffect } from 'react'
import { CommentInputProps } from '@/interfaces/HomeInterfaces'
import { Text } from '@/styles/typography'

const Container = tw.div`
  sticky
  bottom-0
  left-0
  right-0
  bg-white
  border-t
  border-littleGray
  px-4
  pt-4
  max-w-screen-sm
  z-10
`
const InputWrapper = tw.div`
  flex
  justify-between
  bg-white
  border
  rounded-full
  py-2
  px-4
`
const Input = tw.input`
  flex
  border-none
  bg-transparent
  outline-none
  placeholder:text-gray
`
const SendButton = tw.button`
  flex-shrink-0
  whitespace-nowrap
  text-center
  justify-center
`

export default function CommentInput({ onCommentSubmit }: CommentInputProps) {
  const [comment, setComment] = useState('')
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  // 키보드 표시 여부 감지
  useEffect(() => {
    // iOS
    const handleFocus = () => setIsKeyboardVisible(true)
    const handleBlur = () => setIsKeyboardVisible(false)

    // 가상 키보드 열림/닫힘 감지 (iOS)
    window.addEventListener('focusin', handleFocus)
    window.addEventListener('focusout', handleBlur)

    // Android (resize 이벤트 사용)
    const initialHeight = window.innerHeight
    const handleResize = () => {
      // 화면 높이가 줄어들면 키보드가 표시되었다고 판단
      const isKeyboardOpen = window.innerHeight < initialHeight * 0.75
      setIsKeyboardVisible(isKeyboardOpen)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('focusin', handleFocus)
      window.removeEventListener('focusout', handleBlur)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // input 요소에 포커스가 갈 때 스크롤 조정
  const handleFocus = () => {
    // 짧은 시간 지연 후 스크롤 조정 (키보드가 완전히 올라온 후)
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      })
    }, 300)
  }

  const handleSubmit = () => {
    if (comment.trim()) {
      onCommentSubmit(comment)
      setComment('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && comment.trim()) {
      handleSubmit()
    }
  }

  // 명시적으로 HTMLInputElement로 타입 캐스팅
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.currentTarget.value)
  }

  const hasContent = comment.trim().length > 0

  return (
    <Container
      style={{
        position: isKeyboardVisible ? 'relative' : 'sticky',
        paddingBottom: isKeyboardVisible ? '0.75rem' : '1rem',
      }}
    >
      <InputWrapper>
        <Input
          placeholder="댓글을 입력해주세요"
          value={comment}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
        />
        <SendButton onClick={handleSubmit} disabled={!comment.trim()}>
          <Text variant="body2" color={hasContent ? 'kiwi' : 'littleGray'}>
            등록
          </Text>
        </SendButton>
      </InputWrapper>
    </Container>
  )
}
