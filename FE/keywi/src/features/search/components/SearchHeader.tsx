import tw from 'twin.macro'
import { ArrowLeft, Search, XmarkCircleSolid } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'
import { HeaderSearchProps } from '@/interfaces/SearchInterface'
import { useRef } from 'react'
import styled from '@emotion/styled'
import { colors } from '@/styles/colors'

const Container = styled.div<{ $height?: string }>`
  ${tw`
    flex
    bg-input
    rounded-lg
    items-center
    px-3
    w-full
  `}
  height: ${(props) => props.$height || '30px'};
`
const SearchIcon = tw.div`
  flex-shrink-0
  mr-2
`
const ClearButton = tw.button`
  flex-shrink-0
  ml-2
`
const SearchInput = tw.input`
  placeholder:text-darkGray 
  border-none 
  bg-input
  w-full
  text-sm
  outline-none
`

const HeaderContainer = tw.div`
  flex 
  items-center
  px-4
  z-10
  w-full
  py-4
`
const BackBtn = tw.button`
  pr-4
  py-2
`

export function SearchHeader({
  height,
  placeholder = '키위 통합검색',
  onFocus,
  value = '',
  onChange,
}: HeaderSearchProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  // 뒤로가기
  const handleBack = () => navigate(-1)

  // 포커스 핸들러
  const handleFocus = () => {
    if (onFocus) onFocus()
  }

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value)
  }

  // 검색 실행 핸들러
  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`)
    }
  }

  // 엔터 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(value)
    }
  }

  // 검색어 지우기
  const clearSearch = () => {
    if (onChange) onChange('')
    inputRef.current?.focus()
  }

  return (
    <HeaderContainer>
      <BackBtn onClick={handleBack}>
        <ArrowLeft width={'1.3rem'} height={'1.3rem'} />
      </BackBtn>
      <Container $height={height}>
        <SearchIcon>
          <Search
            height={'1.3rem'}
            width={'1.3rem'}
            name="search"
            strokeWidth={2}
          />
        </SearchIcon>
        <SearchInput
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        />
        {value && (
          <ClearButton onClick={clearSearch}>
            <XmarkCircleSolid
              height={'1.2rem'}
              width={'1.2rem'}
              strokeWidth={2}
              color={colors.darkGray}
            />
          </ClearButton>
        )}
      </Container>
    </HeaderContainer>
  )
}
