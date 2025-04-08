import MainLoginBtn from '@/features/login/components/MainLoginBtn'
import MainTopSection from '@/features/login/components/MainTopSection'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

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
  const { isAuthenticated, isLoading } = useAuthStore()
  const navigate = useNavigate()

  // 이미 인증된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/home', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  return (
    <Container>
      <MainTopSection />
      <MainLoginBtn />
    </Container>
  )
}
