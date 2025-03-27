//SECTION - Header에 있는 검색창
import { Search } from 'iconoir-react'
import tw from 'twin.macro'

const Container = tw.div`
  flex
  h-9
  bg-input
  rounded-lg
  items-center
  px-3
  w-full
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

export default function HeaderSerach() {
  return (
    <Container>
      <SearchIcon>
        <Search height={20} width={20} name="search" strokeWidth={2} />
      </SearchIcon>
      <SearchInput placeholder="키위 통합검색" />
    </Container>
  )
}
