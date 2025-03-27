import HeaderIcons from '@/components/HeaderIcons'
import HeaderSearch from '@/components/HeaderSearch'
import tw from 'twin.macro'

const Container = tw.div`
  flex
  justify-between
  items-center
  w-full
  py-2
`
//TODO - 버튼화 시켜서 검색창으로 이동하게 하기
const SearchContainer = tw.div`
  flex-1
  max-w-[68%]
`

const IconsContainer = tw.div`
  flex
  items-center
`

export default function HomeHeader() {
  return (
    <Container>
      <SearchContainer>
        <HeaderSearch />
      </SearchContainer>
      <IconsContainer>
        <HeaderIcons />
      </IconsContainer>
    </Container>
  )
}
