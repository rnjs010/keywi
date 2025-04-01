import { BoardItem } from '@/interfaces/BoardInterface'
import { create } from 'zustand'

interface DealProductStore {
  step: number
  selectedProducts: Record<string, BoardItem>
  etcCategoryCount: number
  setStep: (step: number) => void
  setSelectedProducts: (products: Record<string, BoardItem>) => void
  increaseCategory: () => void
  resetState: () => void
}

export const useDealProductStore = create<DealProductStore>((set) => ({
  step: 1,
  selectedProducts: {},
  etcCategoryCount: 1,
  setStep: (step) => set({ step }),
  setSelectedProducts: (products) => set({ selectedProducts: products }),
  increaseCategory: () =>
    set((state) => ({ etcCategoryCount: state.etcCategoryCount + 1 })),
  resetState: () => set({ step: 1, selectedProducts: {}, etcCategoryCount: 1 }),
}))
