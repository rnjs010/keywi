import { BASE_URL } from '@/config'
import { getCookie, removeCookie, setCookie } from '@/hooks/useCookieAuth'
import axios from 'axios'
import { create } from 'zustand'

const TOKEN_NAME = 'accessToken'
const REFRESH_TOKEN_NAME = 'refreshToken'

interface AuthState {
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null

  setLoading: (isLoading: boolean) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  setError: (error: string | null) => void
  login: (accessToken: string, refreshToken: string) => void
  logout: () => void
  checkAuth: () => void
  refreshTokens: () => Promise<string | null>
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  isLoading: true,
  isAuthenticated: false,
  error: null,

  setLoading: (isLoading) => set({ isLoading }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setError: (error) => set({ error }),

  login: (accessToken, refreshToken) => {
    // 액세스 토큰 저장
    setCookie(TOKEN_NAME, accessToken, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    // 리프레시 토큰 저장
    setCookie(REFRESH_TOKEN_NAME, refreshToken, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    set({ isAuthenticated: true, isLoading: false, error: null })
  },

  logout: () => {
    removeCookie(TOKEN_NAME)
    removeCookie(REFRESH_TOKEN_NAME)
    set({ isAuthenticated: false, isLoading: false, error: null })
  },

  checkAuth: () => {
    const accessToken = getCookie(TOKEN_NAME)
    const refreshToken = getCookie(REFRESH_TOKEN_NAME)

    if (!accessToken && !refreshToken) {
      set({ isAuthenticated: false, isLoading: false, error: null })
      return
    }

    // 토큰이 있으면 인증됨으로 간주
    set({ isAuthenticated: true, isLoading: false })
  },

  refreshTokens: async () => {
    try {
      const refreshToken = getCookie(REFRESH_TOKEN_NAME)

      if (!refreshToken) {
        get().logout()
        return null
      }

      const response = await axios.post(`${BASE_URL}/api/auth/refresh/jwt`, {
        refreshToken,
      })

      const { accessToken, refreshToken: newRefreshToken } =
        response.data.data.token

      // 액세스 토큰 저장
      setCookie(TOKEN_NAME, accessToken, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })

      // 리프레시 토큰 저장
      if (newRefreshToken) {
        setCookie(REFRESH_TOKEN_NAME, refreshToken, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        })
      }

      set({ isAuthenticated: true, error: null })
      return accessToken
    } catch (error) {
      console.error('Token refresh failed', error)
      get().logout()
      return null
    }
  },
}))
