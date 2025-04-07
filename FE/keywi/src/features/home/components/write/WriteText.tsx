import React from 'react'
import tw from 'twin.macro'
import useImageStore from '@/stores/homeStore'
import HashtagSelector from './HashtagSelector'

const Container = tw.div`
  w-full
  flex
  flex-col
  px-4
  py-1
`
const TextArea = tw.textarea`
    w-full
    resize-none
    outline-none
    border-0
    text-base
    leading-relaxed
    min-h-[12rem]
    placeholder:text-gray
`

interface WriteTextProps {
  onTextChange: (text: string) => void
}

export default function WriteText({ onTextChange }: WriteTextProps) {
  const { content, setContent, hashtags, setHashtags } = useImageStore()

  // 해시태그 변경 핸들러 - 전체 태그 배열을 받아서 처리
  const handleTagsChange = (newTags: string[]) => {
    setHashtags(newTags)
  }

  // 텍스트 변경 핸들러
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    onTextChange(newContent)
  }

  return (
    <Container>
      <TextArea
        placeholder="나만의 키보드와 스타일을 자랑해보세요..."
        value={content}
        onChange={handleTextChange}
      />
      <HashtagSelector selectedTags={hashtags} onChange={handleTagsChange} />
    </Container>
  )
}
