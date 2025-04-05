import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '@/config'
import { useAuthStore } from '@/stores/authStore'

const KakaoHandler = () => {
  const navigate = useNavigate()
  const { setLoading, setError, login } = useAuthStore()

  useEffect(() => {
    const handleKakaoLogin = async () => {
      try {
        // URL에서 인가 코드 추출
        const params = new URL(window.location.href).searchParams
        const code = params.get('code')

        console.log('인가 코드:', code)

        // 이미 처리된 코드인지 확인하는 로직 추가
        const isProcessed = sessionStorage.getItem('processed_code') === code

        if (!code || isProcessed) {
          if (!code) console.error('인가 코드가 없습니다')
          navigate('/')
          return
        }

        // 처리 중인 코드 표시
        sessionStorage.setItem('processed_code', code)

        setLoading(true)
        setError(null)

        // 백엔드 API 호출 - jwt access token, refresh token 발급
        const response = await axios.get(
          `${BASE_URL}/api/auth/callback/kakao?code=${code}`,
        )
        console.log('로그인 응답:', response)

        const { accessToken, refreshToken } = response.data.data.token
        const { newUser } = response.data.data

        // 토큰 저장 및 인증 상태 업데이트
        login(accessToken, refreshToken)

        console.log('쿠키 저장', accessToken, refreshToken)

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
        setError(error.response.data.message || '로그인 실패')
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

  // 로딩 중 표시
  return (
    <div className="flex items-center justify-center h-screen">
      <p>카카오 로그인 처리 중...</p>
    </div>
  )
}

export default KakaoHandler
