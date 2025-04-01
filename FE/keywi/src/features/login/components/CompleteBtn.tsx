import MainButton from '@/components/MainButton'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import tw from 'twin.macro'

const BtnWrapper = tw.div`
  mt-auto
  mb-16
  w-full
`

export default function CompleteBtn() {
  const navigate = useNavigate()

  useEffect(() => {
    const authState = useAuthStore.getState()
    console.log('현재 인증 상태', authState.isAuthenticated)
  })

  return (
    <BtnWrapper>
      <MainButton
        text="키위 시작하기"
        disabled={false}
        onClick={() => navigate('/home')}
      />
    </BtnWrapper>
  )
}
