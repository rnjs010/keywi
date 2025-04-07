import HeaderIcons from '@/components/HeaderIcons'
import HeaderSearch from '@/components/HeaderSearch'
import { useNavigate } from 'react-router-dom'
import tw from 'twin.macro'

const Container = tw.div`
  flex
  justify-between
  items-center
  w-full
  px-4
  py-4
`
const SearchContainer = tw.button`
  flex-1
  max-w-[68%]
`
const IconsContainer = tw.div`
  flex
  items-center
`

export default function HomeHeader() {
  const navigate = useNavigate()
  return (
    <Container>
      <SearchContainer
        onClick={() => {
          navigate('/search')
        }}
      >
        <HeaderSearch />
      </SearchContainer>
      <IconsContainer>
        <HeaderIcons />
      </IconsContainer>
    </Container>
  )
}
