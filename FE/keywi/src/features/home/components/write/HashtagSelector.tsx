import React, { useState, useEffect, useRef } from 'react'
import tw from 'twin.macro'
import { Text } from '@/styles/typography'
import { colors } from '@/styles/colors'
import { useHashtags } from '@/features/home/hooks/useHashtags'
import { Hashtag } from '@/interfaces/HomeInterfaces'

const HashtagContainer = tw.div`
  mt-4
  relative
`

const InputContainer = tw.div`
  relative
  flex
  items-center
  border
  border-littleGray
  rounded-lg
  px-3
  py-2
`

const HashtagInput = tw.input`
  w-full
  outline-none
  bg-transparent
  text-sm
`

const SuggestionsContainer = tw.div`
  mt-2
  flex
  flex-wrap
  gap-2
`

const SuggestionTag = tw.button`
  px-2
  py-1
  rounded-full
  bg-gray
  text-xs
  hover:bg-gray
  whitespace-nowrap
`

const SelectedTagsContainer = tw.div`
  mt-3
  flex
  flex-wrap
  gap-1.5
`

const SelectedTag = tw.div`
  px-2
  py-1
  rounded-lg
  bg-gray
  text-kiwi
  flex
  items-center
  gap-1
`

const RemoveButton = tw.button`
  text-gray
  hover:text-gray
  ml-1
`

interface HashtagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
}

export default function HashtagSelector({
  selectedTags,
  onChange,
}: HashtagSelectorProps) {
  const { data: hashtags = [], isLoading } = useHashtags()
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<Hashtag[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // 입력값에 따른 추천 해시태그 업데이트
  useEffect(() => {
    if (!inputValue.trim()) {
      // 입력값이 없으면 인기 해시태그나 추천 해시태그를 보여줄 수 있음
      const popularTags = hashtags.slice(0, 10) // 예시: 처음 10개 태그를 인기 태그로 가정
      setSuggestions(popularTags)
      return
    }

    // 입력값에 따라 해시태그 필터링
    const filtered = hashtags
      .filter(
        (tag) =>
          tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.includes(tag.name),
      )
      .slice(0, 12) // 최대 12개만 표시

    setSuggestions(filtered)
  }, [inputValue, hashtags, selectedTags])

  // 해시태그 추가 처리
  const addTag = (tagName: string) => {
    if (!tagName.trim()) return

    // 이미 선택된 태그가 아닌 경우에만 추가
    if (!selectedTags.includes(tagName)) {
      const newTags = [...selectedTags, tagName]
      onChange(newTags)
    }

    setInputValue('') // 입력 필드 초기화
  }

  // 해시태그 제거 처리
  const handleRemoveTag = (tagName: string) => {
    const newTags = selectedTags.filter((t) => t !== tagName)
    onChange(newTags)
  }

  // 키 입력 핸들러 (Enter 키로 태그 추가)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault() // 폼 제출 방지
      addTag(inputValue)
    }
  }

  // 입력 필드 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // 추천 태그 클릭 핸들러
  const handleSuggestionClick = (tagName: string) => {
    addTag(tagName)
    inputRef.current?.focus() // 입력 필드에 포커스 유지
  }

  return (
    <HashtagContainer>
      <Text variant="body2" color="gray" className="mb-2">
        해시태그 입력
      </Text>

      {/* 입력 필드 */}
      <InputContainer>
        <Text variant="caption2" color="gray" className="mr-1">
          #
        </Text>
        <HashtagInput
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="해시태그를 입력하세요 (Enter로 추가)"
        />
      </InputContainer>

      {/* 추천 해시태그 */}
      {!isLoading && suggestions.length > 0 && (
        <SuggestionsContainer>
          {suggestions.map((tag) => (
            <SuggestionTag
              key={tag.id}
              onClick={() => handleSuggestionClick(tag.name)}
            >
              #{tag.name}
            </SuggestionTag>
          ))}
        </SuggestionsContainer>
      )}

      {/* 선택된 해시태그 표시 */}
      {selectedTags.length > 0 && (
        <>
          <Text variant="caption2" color="gray" className="mt-4 mb-1">
            선택된 해시태그
          </Text>
          <SelectedTagsContainer>
            {selectedTags.map((tag) => (
              <SelectedTag key={tag}>
                <Text variant="caption2" color="kiwi">
                  #{tag}
                </Text>
                <RemoveButton
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </RemoveButton>
              </SelectedTag>
            ))}
          </SelectedTagsContainer>
        </>
      )}
    </HashtagContainer>
  )
}
