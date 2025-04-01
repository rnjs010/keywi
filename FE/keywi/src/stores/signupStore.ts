import { create } from 'zustand'
import apiRequester from '@/services/api'

interface SignupState {
  // 상태
  nickname: string
  profileImage: string | null
  isLoading: boolean
  error: string | null

  // 액션
  setNickname: (nickname: string) => void
  setProfileImage: (image: string | null) => void
  checkNickname: (nickname: string) => Promise<boolean>
  signup: () => Promise<boolean>
}

export const useSignupStore = create<SignupState>((set, get) => ({
  // 초기 상태
  nickname: '',
  profileImage: null,
  isLoading: false,
  error: null,

  // 액션 메서드
  setNickname: (nickname) => set({ nickname }),
  setProfileImage: (profileImage) => set({ profileImage }),

  // 닉네임 중복 체크
  checkNickname: async (nickname) => {
    if (nickname.length < 2) {
      return false
    }

    try {
      set({ isLoading: true })
      const response = await apiRequester.get(
        `/api/auth/check-nickname/${nickname}`,
      )
      console.log(response.data.data.available)
      return response.data.data.available
    } catch (error) {
      return false
    } finally {
      set({ isLoading: false })
    }
  },

  // 회원가입
  signup: async () => {
    const { nickname, profileImage } = get()

    if (nickname.length < 2) {
      set({ error: '닉네임은 2자 이상이어야 합니다.' })
      return false
    }

    // 닉네임 중복 체크
    const isAvailable = await get().checkNickname(nickname)
    if (!isAvailable) {
      set({ error: '이미 사용중인 닉네임입니다.' })
      return false
    }

    // FormData 생성
    const formData = new FormData()
    formData.append('userNickname', nickname)

    // 프로필 이미지가 있는 경우 추가
    if (profileImage) {
      try {
        const imageResponse = await fetch(profileImage)
        const imageBlob = await imageResponse.blob()
        formData.append('profileImage', imageBlob, 'profile.jpg')
      } catch (error) {
        set({ error: '이미지 처리 중 오류가 발생했습니다.' })
        return false
      }
    }

    // 회원가입 API 요청
    try {
      set({ isLoading: true, error: null })
      const response = await apiRequester.post('/api/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      return response.data.success
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || '회원가입 중 오류가 발생했습니다.',
      })
      return false
    } finally {
      set({ isLoading: false })
    }
  },
}))
