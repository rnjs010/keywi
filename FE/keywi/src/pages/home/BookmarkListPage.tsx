import DetailHeader from '@/components/DetailHeader'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import BookmarkedFeedGrid from '@/features/home/components/navbar/BookmarkedFeedGrid'

const Container = tw.div`
  w-full 
  max-w-screen-sm 
  mx-auto 
  flex 
  flex-col 
  h-screen
  pb-4
`
const HeaderWrapper = tw.div`
  sticky
  top-0
  z-10
  bg-white
  w-full
`
const ContentArea = styled.div`
  ${tw`
    flex
    flex-col
    flex-1
    overflow-y-auto
    h-[calc(100vh-60px)]
  `}

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
`

export function BookmarkListPage() {
  return (
    <Container>
      <HeaderWrapper>
        <DetailHeader title={`북마크`} />
      </HeaderWrapper>
      <ContentArea>
        <BookmarkedFeedGrid />
      </ContentArea>
    </Container>
  )
}
