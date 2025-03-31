import { BASE_URL } from '@/config'
import { getCookie } from '@/hooks/useCookieAuth'
import { useAuthStore } from '@/stores/authStore'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

const TOKEN_NAME = 'accessToken'

// axios 인스턴스 생성
const apiRequester: AxiosInstance = axios.create({
  baseURL: BASE_URL as string,
  timeout: 5000,
})

// 요청 인터셉터
apiRequester.interceptors.request.use(
  (config) => {
    const accessToken = getCookie(TOKEN_NAME)

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터
apiRequester.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    // 401 에러이고 토큰 만료이며 이미 재시도 하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const newAccessToken = await useAuthStore.getState().refreshTokens()

        // 리프레시 토큰 없으면 로그아웃
        if (!newAccessToken) {
          return Promise.reject(error)
        }

        // 원래 요청 재시도
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        }
        return axios(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

export default apiRequester
