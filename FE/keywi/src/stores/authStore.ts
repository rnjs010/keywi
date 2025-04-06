import { BASE_URL } from '@/config'
import { getCookie, removeCookie, setCookie } from '@/hooks/useCookieAuth'
import axios from 'axios'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const TOKEN_NAME = 'accessToken'
const REFRESH_TOKEN_NAME = 'refreshToken'

interface AuthState {
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  initialized: boolean

  setLoading: (isLoading: boolean) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  setError: (error: string | null) => void
  initialize: () => void
  login: (accessToken: string, refreshToken: string) => void
  logout: () => void
  checkAuth: () => boolean
  refreshTokens: () => Promise<string | null>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoading: false, // 기본값 false로 변경
      isAuthenticated: false,
      error: null,
      initialized: false, // 초기화 상태 추가

      setLoading: (isLoading) => set({ isLoading }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setError: (error) => set({ error }),

      initialize: () => {
        // 이미 초기화되었으면 아무것도 하지 않음
        if (get().initialized) return

        const isAuthenticated = get().checkAuth()
        set({
          initialized: true,
          isAuthenticated,
          isLoading: false,
        })
      },

      login: (accessToken, refreshToken) => {
        // 액세스 토큰 저장
        setCookie(TOKEN_NAME, accessToken, {
          path: '/',
          secure: window.location.protocol === 'https:',
          sameSite: window.location.protocol === 'https:' ? 'None' : 'Lax',
        })

        // 리프레시 토큰 저장
        setCookie(REFRESH_TOKEN_NAME, refreshToken, {
          path: '/',
          secure: window.location.protocol === 'https:',
          sameSite: window.location.protocol === 'https:' ? 'None' : 'Lax',
        })

        set({
          isAuthenticated: true,
          isLoading: false,
          error: null,
          initialized: true,
        })
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
          console.log('토큰 없음')
          return false
        }

        console.log('인증됨')
        return true
      },

      refreshTokens: async () => {
        try {
          set({ isLoading: true })

          const refreshToken = getCookie(REFRESH_TOKEN_NAME)

          if (!refreshToken) {
            get().logout()
            return null
          }

          const response = await axios.post(
            `${BASE_URL}/api/auth/refresh/jwt`,
            {
              refreshToken,
            },
          )

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data.token

          // 액세스 토큰 저장
          setCookie(TOKEN_NAME, accessToken, {
            path: '/',
            secure: window.location.protocol === 'https:',
            sameSite: window.location.protocol === 'https:' ? 'None' : 'Lax',
          })

          // 리프레시 토큰 저장
          if (newRefreshToken) {
            setCookie(REFRESH_TOKEN_NAME, newRefreshToken, {
              path: '/',
              secure: window.location.protocol === 'https:',
              sameSite: window.location.protocol === 'https:' ? 'None' : 'Lax',
            })
          }

          set({ isAuthenticated: true, isLoading: false, error: null })
          return accessToken
        } catch (error) {
          console.error('Token refresh failed', error)
          get().logout()
          return null
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    },
  ),
)

// 앱 시작 시 초기화
setTimeout(() => {
  useAuthStore.getState().initialize()
}, 0)
