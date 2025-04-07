import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { fetchUserInfo } from '@/services/userIdServices'
import { useUserStore } from '@/stores/userStore'
import { processKakaoLogin } from '../services/authServices'
import LoadingMessage from '@/components/message/LoadingMessage'
import ErrorMessage from '@/components/message/ErrorMessage'

const KakaoHandler = () => {
  const navigate = useNavigate()
  const { setLoading, setError, login } = useAuthStore()
  const { setUserId } = useUserStore()
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>(
    'loading',
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const handleKakaoLogin = async () => {
      try {
        // URL에서 인가 코드 추출
        const params = new URL(window.location.href).searchParams
        const code = params.get('code')

        // 이미 처리된 코드인지 확인하는 로직 추가
        const isProcessed = sessionStorage.getItem('processed_code') === code

        if (!code || isProcessed) {
          if (!code) {
            setErrorMessage('인가 코드가 없습니다')
            setStatus('error')
          }
          navigate('/')
          return
        }

        // 처리 중인 코드 표시
        sessionStorage.setItem('processed_code', code)

        setLoading(true)
        setError(null)

        // 백엔드 API 호출 - jwt access token, refresh token 발급
        const response = await processKakaoLogin(code)

        const { accessToken, refreshToken } = response.data.token
        const { newUser } = response.data

        // 토큰 저장 및 인증 상태 업데이트
        login(accessToken, refreshToken)

        // userId 저장
        try {
          const userData = await fetchUserInfo()
          setUserId(userData.userId)
          console.log('userId 저장 완료:', userData.userId)
          setStatus('success')
        } catch (fetchError) {
          console.error('유저 정보 가져오기 실패:', fetchError)
          setError('유저 정보를 가져오는 데 실패했어요.')
          setErrorMessage('유저 정보를 가져오는 데 실패했어요.')
          setStatus('error')
        }

        // 사용자 상태에 따라 리디렉션
        if (newUser === false) {
          console.log('기존 사용자 -> 홈으로 이동')
          navigate('/home', { replace: true })
        } else {
          console.log('신규 사용자 -> 회원정보 입력 페이지로 이동')
          navigate('/login', { replace: true })
        }
      } catch (error: any) {
        console.error('로그인 에러:', error)
        const message = error.response?.data?.message || '로그인 실패'
        setError(message)
        setErrorMessage(message)
        setStatus('error')
        setLoading(false)
        navigate('/', { replace: true })
      }
    }

    handleKakaoLogin()

    // cleanup 함수
    return () => {
      setLoading(false)
    }
  }, [])

  // 상태에 따른 UI 렌더링
  if (status === 'loading') {
    return <LoadingMessage />
  }

  if (status === 'error') {
    return <ErrorMessage text={errorMessage || ''} />
  }

  return <LoadingMessage />
}

export default KakaoHandler
