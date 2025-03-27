import React, { useState, useEffect } from 'react'
import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { colors } from '@/styles/colors'

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
const HashTagContainer = tw.div`
  mt-1
  flex
  flex-wrap
  gap-1
`
const HashTagButton = tw.button`
  px-2
  border
  border-littleGray
  rounded-lg
`

const SelectedTagsContainer = tw.div`
  mt-4
  flex
  flex-wrap
`

const SelectedTag = tw.span`
  mr-1
`

const HashTagHelp = tw.div`
  mt-4
`

interface WriteTextProps {
  onTextChange: (text: string) => void
}

export default function WriteText({ onTextChange }: WriteTextProps) {
  const [text, setText] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // 샘플 해시태그 목록 - 실제 구현 시 API로 받아오기
  const hashTags = [
    '데스크테리어',
    '소음윤활',
    '오피스',
    '알루미늄',
    '조립품',
    '저소음축',
    '몽글몽글',
    '조약돌',
    '화이트테리어',
  ]

  // 해시태그 클릭 핸들러
  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // 이미 선택된 태그면 제거
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      // 선택되지 않은 태그면 추가
      setSelectedTags([...selectedTags, tag])
    }
  }

  // 텍스트 변경 핸들러
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  // 텍스트 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    onTextChange(text)
  }, [text, onTextChange])

  return (
    <Container>
      <TextArea
        placeholder="나만의 키보드와 스타일을 자랑해보세요..."
        value={text}
        onChange={handleTextChange}
      />

      {/* 선택된 해시태그 표시 */}
      {selectedTags.length > 0 ? (
        <SelectedTagsContainer>
          {selectedTags.map((tag) => (
            <SelectedTag key={tag}>
              <Text variant="caption2" color="kiwi">
                #{tag}
              </Text>
            </SelectedTag>
          ))}
        </SelectedTagsContainer>
      ) : (
        <HashTagHelp>
          <Text variant="caption2" color="littleGray">
            다양한 #해시태그도 추가할 수 있어요...
          </Text>
        </HashTagHelp>
      )}

      {/* 해시태그 버튼 */}
      <HashTagContainer>
        {hashTags.map((tag) => (
          <HashTagButton
            key={tag}
            onClick={() => handleTagClick(tag)}
            style={{
              color: selectedTags.includes(tag) ? colors.kiwi : colors.black,
            }}
          >
            <Text variant="caption2" weight="bold" className="align-text-top">
              #{tag}
            </Text>
          </HashTagButton>
        ))}
      </HashTagContainer>
    </Container>
  )
}
