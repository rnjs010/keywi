import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  userId: number | null
  setUserId: (id: number) => void
  reset: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      setUserId: (id: number) => set({ userId: id }),
      reset: () => set({ userId: null }),
    }),
    {
      name: 'userId',
      partialize: (state) => ({ userId: state.userId }), // 저장할 상태 선택
    },
  ),
)
