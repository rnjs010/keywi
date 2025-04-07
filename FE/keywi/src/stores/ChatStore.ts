import { BoardItem } from '@/interfaces/BoardInterface'
import { create } from 'zustand'

// 채팅
interface ChatConnectStore {
  connected: boolean
  setConnected: (status: boolean) => void
}

export const useChatConnectStore = create<ChatConnectStore>((set) => ({
  connected: false,
  setConnected: (status) => set({ connected: status }),
}))

// 채팅 이미지 전송
interface ChatImageStore {
  showImage: boolean
  setShowImage: (showImage: boolean) => void
  selectedImage: string | null
  setSelectedImage: (image: string | null) => void
  resetState: () => void
}

export const useChatImageStore = create<ChatImageStore>((set) => ({
  showImage: false,
  setShowImage: (showImage) => set({ showImage }),
  selectedImage: null,
  setSelectedImage: (image) => set({ selectedImage: image }),
  resetState: () => set({ showImage: false, selectedImage: null }),
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
