import { BASE_URL } from '@/config'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function useAuth() {
  const navigate = useNavigate()
  const {
    isLoading,
    isAuthenticated,
    error,
    setLoading,
    setError,
    login,
    logout,
    checkAuth,
  } = useAuthStore()

  // 카카오 로그인 처리
  useEffect(() => {
    // 인가코드 발생 확인 후 백에서 jwt 받아오기

    setLoading(true)
    setError(null)

    axios
      .get(`${BASE_URL}/api/auth/refresh/kakao`)
      .then((res) => {
        console.log(res.data)
        const { accessToken, refreshToken } = res.data.data.token
        const { newUser } = res.data.data

        // 토큰 저장 및 인증 상태 업데이트
        login(accessToken, refreshToken)

        // 로그인 성공
        if (newUser === false) {
          console.log('기존사용자')
          navigate('/home')
        }
        // 회원정보 입력
        else {
          console.log('신규사용자')
          navigate('/login')
        }
      })
      .catch((error) => {
        console.log('Login error', error)
        setError(error.response.data.message || '로그인 실패')
        setLoading(false)
        navigate('/')
      })

    // 인가 코드 없으면 기존 인증 상태 확인
    checkAuth()
  }, [])

  return {
    isLoading,
    isAuthenticated,
    error,
    logout,
  }
}

export default useAuth
