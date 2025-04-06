import { SearchHeader } from '@/features/search/components/SearchHeader'
import SearchPopular from '@/features/search/components/SearchPopular'
import SearchRecent from '@/features/search/components/SearchRecent'
import SearchRecommend from '@/features/search/components/SearchRecommend'
import SearchSuggestions from '@/features/search/components/SearchSuggestions'
import { useAutocomplete } from '@/features/search/hooks/useAutocomplete'
import { useState } from 'react'
import tw from 'twin.macro'

const Container = tw.div`
  w-full 
  max-w-screen-sm 
  mx-auto 
  flex 
  flex-col 
  h-screen 
  box-border 
  overflow-x-hidden
`
const ContentContainer = tw.div`
  px-4
  py-4
  grid
  gap-8
`
export default function SearchingPage() {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const {
    query,
    suggestions,
    showSuggestions,
    handleInputChange,
    selectKeyword,
  } = useAutocomplete()

  // 검색창 포커스 핸들러
  const handleSearchFocus = () => {
    setIsSearchActive(true)
  }

  return (
    <Container>
      <SearchHeader
        height="2.5rem"
        onFocus={handleSearchFocus}
        value={query}
        onChange={(value) => handleInputChange(value)}
      />
      <ContentContainer>
        {/* 검색 활성화 && 검색어 있음 && 연관 검색어 보여주기 */}
        {isSearchActive && query && showSuggestions ? (
          <SearchSuggestions
            suggestions={suggestions}
            onSelectKeyword={selectKeyword}
          />
        ) : (
          // 메인 검색 페이지
          <>
            <SearchRecent />
            <SearchRecommend />
            <SearchPopular />
          </>
        )}
      </ContentContainer>
    </Container>
  )
}
