import { BoardItem } from '@/interfaces/BoardInterface'
import { create } from 'zustand'

// 채팅
interface ChatStore {
  showImage: boolean
  setShowImage: (showImage: boolean) => void
  resetState: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  showImage: false,
  setShowImage: (showImage) => set({ showImage }),
  resetState: () => set({ showImage: false }),
}))

// 거래 요청
interface DealRequestStore {
  step: number
  selectedProducts: Record<string, BoardItem>
  etcCategoryCount: number
  totalPrice: number
  setStep: (step: number) => void
  setSelectedProducts: (products: Record<string, BoardItem>) => void
  increaseCategory: () => void
  setTotalPrice: (total: number) => void
  resetState: () => void
}

export const useDealRequestStore = create<DealRequestStore>((set) => ({
  step: 1,
  selectedProducts: {},
  etcCategoryCount: 1,
  totalPrice: 0,
  setStep: (step) => set({ step }),
  setSelectedProducts: (products) => set({ selectedProducts: products }),
  increaseCategory: () =>
    set((state) => ({ etcCategoryCount: state.etcCategoryCount + 1 })),
  setTotalPrice: (total) => set({ totalPrice: total }),
  resetState: () =>
    set({ step: 1, selectedProducts: {}, etcCategoryCount: 1, totalPrice: 0 }),
}))

// 거래 수락
interface DealAcceptStore {
  step: number
  totalPrice: number
  setStep: (step: number) => void
  setTotalPrice: (total: number) => void
  resetState: () => void
}

export const useDealAcceptStore = create<DealAcceptStore>((set) => ({
  step: 1,
  totalPrice: 0,
  setStep: (step) => set({ step }),
  setTotalPrice: (total) => set({ totalPrice: total }),
  resetState: () => set({ step: 1, totalPrice: 0 }),
}))
