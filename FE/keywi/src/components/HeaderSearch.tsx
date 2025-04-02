//SECTION - Header에 있는 검색창
import { Search } from 'iconoir-react'
import tw from 'twin.macro'
import styled from '@emotion/styled'

// Props 타입 정의
interface HeaderSearchProps {
  height?: string
  placeholder?: string
}

// 커스텀 높이를 적용할 수 있는 styled 컴포넌트
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
const SearchInput = tw.input`
  placeholder:text-darkGray 
  border-none 
  bg-input
  w-full
  text-sm
  outline-none
`

export default function HeaderSearch({
  height,
  placeholder = '키위 통합검색',
}: HeaderSearchProps) {
  return (
    <Container $height={height}>
      <SearchIcon>
        <Search
          height={'1.3rem'}
          width={'1.3rem'}
          name="search"
          strokeWidth={2}
        />
      </SearchIcon>
      <SearchInput placeholder={placeholder} />
    </Container>
  )
}
