import tw from 'twin.macro'
import { Search } from 'iconoir-react'
import { Text } from '@/styles/typography'
import { useNavigate } from 'react-router-dom'

const Container = tw.div`
  w-full
`
const SuggestionsList = tw.ul`
  w-full
  flex
  flex-col
`
const SuggestionItem = tw.li`
  py-3
  px-2
  flex
  items-center
  gap-3
  cursor-pointer
  hover:bg-gray
  active:bg-darkGray
`
const IconWrapper = tw.div`
  flex-shrink-0
  text-darkGray
`

interface SearchSuggestionsProps {
  suggestions: string[]
  onSelectKeyword: (keyword: string) => void
}

export default function SearchSuggestions({
  suggestions,
  onSelectKeyword,
}: SearchSuggestionsProps) {
  const navigate = useNavigate()

  // 검색어 선택
  const handleSelect = (keyword: string) => {
    onSelectKeyword(keyword)
    navigate(`/search/${keyword}`)
  }

  // 검색어가 없는 경우
  if (suggestions.length === 0) {
    return (
      <Container>
        <Text variant="body2" color="darkGray" className="py-4 text-center">
          검색어 추천 결과가 없습니다
        </Text>
      </Container>
    )
  }

  return (
    <Container>
      <SuggestionsList>
        {suggestions.map((keyword) => (
          <SuggestionItem key={keyword} onClick={() => handleSelect(keyword)}>
            <IconWrapper>
              <Search width="1.2rem" height="1.2rem" />
            </IconWrapper>
            <Text variant="body2">{keyword}</Text>
          </SuggestionItem>
        ))}
      </SuggestionsList>
    </Container>
  )
}
