import { SearchHeader } from '@/features/search/components/SearchHeader'
import SearchPopular from '@/features/search/components/SearchPopular'
import SearchRecent from '@/features/search/components/SearchRecent'
import SearchRecommend from '@/features/search/components/SearchRecommend'
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
  return (
    <Container>
      <SearchHeader />
      <ContentContainer>
        <SearchRecent />
        <SearchRecommend />
        <SearchPopular />
      </ContentContainer>
    </Container>
  )
}
