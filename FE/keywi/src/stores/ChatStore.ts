import { BoardItem } from '@/interfaces/BoardInterface'
import { create } from 'zustand'

interface DealProductStore {
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

export const useDealProductStore = create<DealProductStore>((set) => ({
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
