import tw from 'twin.macro'
import styled from '@emotion/styled'
import CompleteBtn from '@/features/login/components/CompleteBtn'
import CompleteContent from '@/features/login/components/CompleteContent'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'
import LoadingMessage from '@/components/message/LoadingMessage'

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

const ContentWrapper = tw.div`
  flex flex-col items-center justify-center h-screen
`

export default function LoginCompletePage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, initialized } = useAuthStore()

  // 인증이 안 된 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    if (initialized && !isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, initialized, navigate])

  if (isLoading || !initialized) {
    return <LoadingMessage />
  }

  return (
    <Container>
      <ContentWrapper>
        <CompleteContent />
      </ContentWrapper>
      <CompleteBtn />
    </Container>
  )
}
