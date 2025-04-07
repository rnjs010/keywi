import React, { useState, useEffect, useRef } from 'react'
import tw from 'twin.macro'
import { Text } from '@/styles/typography'
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
  rounded-lg
  py-2
`

const HashtagInput = tw.input`
  w-full
  outline-none
  bg-transparent
  text-base
  placeholder:text-gray
`

const SuggestionsContainer = tw.div`
  mt-2
  flex
  flex-wrap
  gap-2
`

const SuggestionTag = tw.button`
  px-1
  border-kiwi
  text-kiwi
  whitespace-nowrap
  items-center
  flex

`

const SelectedTagsContainer = tw.div`
  mt-3
  flex
  flex-wrap
  gap-1.5
`

const SelectedTag = tw.div`
  px-2
  py-0.5
  rounded-full
  border
  border-kiwi
  items-center
  flex
  gap-1
`

const RemoveButton = tw.button`
  items-center
  flex
  px-1
  py-0.5
  hover:text-gray
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
      // 입력값이 없으면 인기 해시태그 10개 보여주고 시작
      const popularTags = hashtags.slice(0, 10)
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
      .slice(0, 10) // 최대 10개만 표시

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
      {/* 입력 필드 */}
      <InputContainer>
        <HashtagInput
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="다양한 #해시태그도 추가할 수 있어요..."
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
              <Text variant="caption1" weight="bold">
                #{tag.name}
              </Text>
            </SuggestionTag>
          ))}
        </SuggestionsContainer>
      )}

      {/* 선택된 해시태그 표시 */}
      {selectedTags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-lightGray">
          <Text variant="caption1" weight="bold" color="darkGray">
            선택된 해시태그
          </Text>
          <SelectedTagsContainer>
            {selectedTags.map((tag) => (
              <SelectedTag key={tag}>
                <Text variant="caption1" color="kiwi" weight="bold">
                  #{tag}
                </Text>
                <RemoveButton
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`Remove ${tag}`}
                >
                  <Text variant="caption2" color="kiwi" weight="bold">
                    x
                  </Text>
                </RemoveButton>
              </SelectedTag>
            ))}
          </SelectedTagsContainer>
        </div>
      )}
    </HashtagContainer>
  )
}
