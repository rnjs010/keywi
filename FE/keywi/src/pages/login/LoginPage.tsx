import tw from 'twin.macro'
import styled from '@emotion/styled'
import LoginHeader from '@/features/login/components/LoginHeader'
import LoginImgBtn from '@/features/login/components/LoginImgBtn'
import LoginNameInput from '@/features/login/components/LoginNameInput'
import LoginNextBtn from '@/features/login/components/LoginNextBtn'

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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`

export default function LoginPage() {
  return (
    <Container>
      <LoginHeader />
      <LoginImgBtn />
      <LoginNameInput />
      <LoginNextBtn />
    </Container>
  )
}
