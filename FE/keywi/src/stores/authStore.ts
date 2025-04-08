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
      isLoading: false,
      isAuthenticated: false,
      error: null,
      initialized: false,

      setLoading: (isLoading) => set({ isLoading }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setError: (error) => set({ error }),

      initialize: async () => {
        // 이미 초기화되었으면 아무것도 하지 않음
        if (get().initialized) return

        set({ isLoading: true })

        try {
          // 토큰 유효성 체크 (필요시 리프레시 시도)
          const accessToken = getCookie(TOKEN_NAME)
          const refreshToken = getCookie(REFRESH_TOKEN_NAME)

          let isAuth = false

          if (accessToken || refreshToken) {
            // 토큰이 있으면 유효성을 한번 체크
            try {
              // 액세스 토큰이 만료되었다면 리프레시 시도
              if (!accessToken && refreshToken) {
                await get().refreshTokens()
              }
              isAuth = true
            } catch (error) {
              console.error('Auth check failed:', error)
              // 리프레시 실패시 로그아웃
              get().logout()
              isAuth = false
            }
          }

          set({
            initialized: true,
            isAuthenticated: isAuth,
            isLoading: false,
          })
        } catch (error) {
          console.error('Initialization error:', error)
          set({
            initialized: true,
            isAuthenticated: false,
            isLoading: false,
          })
        }
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
