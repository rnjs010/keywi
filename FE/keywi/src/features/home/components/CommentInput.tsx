import tw from 'twin.macro'
import { useState } from 'react'
import { CommentInputProps } from '@/interfaces/HomeInterfaces'
import { Text } from '@/styles/typography'

const Container = tw.div`
  fixed
  bottom-0
  left-0
  right-0
  bg-white
  border-t
  border-gray
  p-2
  max-w-screen-sm
  mx-auto
`

const InputWrapper = tw.div`
  flex
  items-center
  bg-white
  border
  rounded-full
  px-4
  py-2
`

const Input = tw.input`
  flex-1
  border-none
  bg-transparent
  outline-none
  text-lg
  placeholder:text-gray
`

const SendButton = tw.button`
  ml-2
  flex
  items-center
  justify-center
`

export default function CommentInput({ onCommentSubmit }: CommentInputProps) {
  const [comment, setComment] = useState('')

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
    <Container>
      <InputWrapper>
        <Input
          placeholder="댓글을 입력해주세요"
          value={comment}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
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
