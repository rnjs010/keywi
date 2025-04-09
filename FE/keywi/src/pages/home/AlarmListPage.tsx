import DetailHeader from '@/components/DetailHeader'
import tw from 'twin.macro'
import styled from '@emotion/styled'

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
    justify-end
  `}

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
`

export function AlarmListPage() {
  return (
    <Container>
      <HeaderWrapper>
        <DetailHeader title={`찜`} />
      </HeaderWrapper>
      <ContentArea></ContentArea>
    </Container>
  )
}
