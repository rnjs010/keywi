import { create } from 'zustand'

// 검색 후 상태 인터페이스
interface SearchState {
  query: string
  currentTab: 'feeds' | 'products' | 'users'

  // 액션
  setQuery: (query: string) => void
  setCurrentTab: (tab: 'feeds' | 'products' | 'users') => void
}

export const useSearchStore = create<SearchState>((set) => ({
  // 초기 상태
  query: '',
  currentTab: 'feeds',

  // 액션
  setQuery: (query) => set({ query }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
}))
