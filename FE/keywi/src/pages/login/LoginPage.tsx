import tw from 'twin.macro'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'
import LoadingMessage from '@/components/message/LoadingMessage'
import { useSignupStore } from '@/stores/signupStore'
import ProfileForm from '@/features/login/components/ProfileForm'
import HeaderText from '@/features/login/components/ProfileHeaderText'
import ProfileImageInput from '@/features/login/components/ProfileImageInput'
import ProfileNameInput from '@/features/login/components/ProfileNameInput'
import ProfileNextBtn from '@/features/login/components/ProfileNextBtn'

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
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, initialized } = useAuthStore()
  const {
    nickname,
    profileImage,
    isLoading: signupLoading,
    error,
    setNickname,
    setProfileImage,
    signup,
  } = useSignupStore()

  // 인증이 안 된 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    if (initialized && !isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, initialized, navigate])

  const handleSignup = async () => {
    if (nickname.length < 2 || signupLoading) return

    const success = await signup()
    if (success) {
      navigate('/login/complete')
    }
  }

  if (isLoading || !initialized) {
    return <LoadingMessage />
  }
  return (
    <Container>
      <ProfileForm
        header={<HeaderText title="프로필 입력" />}
        imageInput={
          <ProfileImageInput
            imageUrl={profileImage}
            onImageChange={setProfileImage}
          />
        }
        nameInput={
          <ProfileNameInput
            nickname={nickname}
            onNicknameChange={setNickname}
          />
        }
        actionButton={
          <ProfileNextBtn
            text="다음"
            onClick={handleSignup}
            disabled={nickname.length < 2}
            error={error}
            isLoading={signupLoading}
          />
        }
      />
    </Container>
  )
}
