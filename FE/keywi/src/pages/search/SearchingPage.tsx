import HeaderSearch from '@/components/HeaderSearch'
import SearchPopular from '@/features/search/components/SearchPopular'
import SearchRecent from '@/features/search/components/SearchRecent'
import SearchRecommend from '@/features/search/components/SearchRecommend'
import { ArrowLeft } from 'iconoir-react'
import { useNavigate } from 'react-router-dom'
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
const HeaderContainer = tw.div`
  flex 
  items-center
  px-4
  z-10
  w-full
  py-4
`
const ContentContainer = tw.div`
  px-4
  py-4
  grid
  gap-8
`
const BackBtn = tw.button`
  pr-4
  py-2
`

export default function SearchingPage() {
  const navigate = useNavigate()

  // 뒤로가기
  const handleBack = () => navigate(-1)

  return (
    <Container>
      <HeaderContainer>
        <BackBtn onClick={handleBack}>
          <ArrowLeft width={'1.3rem'} height={'1.3rem'} />
        </BackBtn>
        <HeaderSearch height={'2.5rem'} />
      </HeaderContainer>
      <ContentContainer>
        <SearchRecent />
        <SearchRecommend />
        <SearchPopular />
      </ContentContainer>
    </Container>
  )
}
