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

// 회원가입
export const signup = async (userData: {
  userName: string
  profileImage?: File
}) => {
  const formData = new FormData()
  formData.append('userName', userData.userName)

  if (userData.profileImage) {
    formData.append('profileImage', userData.profileImage)
  }

  const response = await apiRequester.post('/api/auth/signup', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

// 회원정보 수정
export const updateProfile = async (userData: {
  userNickname: string
  profileImage?: File
  statusMessage: string
}) => {
  const formData = new FormData()
  formData.append('userNickname', userData.userNickname)

  if (userData.profileImage) {
    // 원본 파일명 유지 (확장자 포함)
    const originalFileName = userData.profileImage.name

    // 파일 객체를 직접 추가 (파일명 변경 없이)
    formData.append('profileImage', userData.profileImage, originalFileName)
  }

  if (userData.statusMessage) {
    formData.append('statusMessage', userData.statusMessage)
  }

  const response = await apiRequester.put('/api/auth/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  console.log('회원정보 수정', response.data)
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

// 회원탈퇴
export const deleteAccount = async () => {
  try {
    await apiRequester.delete('/api/auth/me')
    return true
  } catch (error) {
    console.error('Delete account failed:', error)
    return false
  }
}
