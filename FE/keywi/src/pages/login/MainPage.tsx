import KakaoLoginBtn from '@/features/login/components/KakaoLoginBtn'
import LoginTopSection from '@/features/login/components/MainTopSection'

import tw from 'twin.macro'
import styled from '@emotion/styled'

const Container = styled.div`
  ${tw`
    w-full 
    max-w-screen-sm 
    mx-auto 
    flex 
    flex-col 
    h-screen 
    p-4 
    box-border 
    overflow-x-hidden
  `}
`

export default function MainPage() {
  return (
    <Container>
      <LoginTopSection />
      <KakaoLoginBtn />
    </Container>
  )
}
