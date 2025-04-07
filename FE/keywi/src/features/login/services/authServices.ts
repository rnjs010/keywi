import apiRequester from '@/services/api'
import { BASE_URL } from '@/config'
import axios from 'axios'

interface KakaoLoginResponse {
  success: boolean
  message: string
  data: {
    token: {
      accessToken: string
      refreshToken: string
    }
    newUser: boolean
  }
}

interface RefreshTokenResponse {
  success: boolean
  message: string
  data: {
    token: {
      accessToken: string
      refreshToken?: string
    }
  }
}

// 카카오 로그인 코드 처리
export const processKakaoLogin = async (
  code: string,
): Promise<KakaoLoginResponse> => {
  const response = await axios.get<KakaoLoginResponse>(
    `${BASE_URL}/api/auth/callback/kakao?code=${code}`,
  )
  return response.data
}

// 토큰 갱신
export const refreshTokens = async (
  refreshToken: string,
): Promise<RefreshTokenResponse> => {
  const response = await axios.post<RefreshTokenResponse>(
    `${BASE_URL}/api/auth/refresh/jwt`,
    { refreshToken },
  )
  return response.data
}

// 회원가입 또는 프로필 업데이트
export const updateUserProfile = async (userData: {
  userName: string
  profileImage?: File
}) => {
  const formData = new FormData()
  formData.append('userName', userData.userName)

  if (userData.profileImage) {
    formData.append('profileImage', userData.profileImage)
  }

  const response = await apiRequester.post(
    '/api/auth/members/profile',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  return response.data
}

// 로그아웃
export const logout = async () => {
  try {
    await apiRequester.post('/api/auth/logout')
    return true
  } catch (error) {
    console.error('Logout failed:', error)
    return false
  }
}
