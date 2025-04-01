import { BoardItem } from '@/interfaces/BoardInterface'
import { create } from 'zustand'

interface DealProductStore {
  selectedProducts: Record<string, BoardItem>
  setSelectedProducts: (products: Record<string, BoardItem>) => void
  resetState: () => void
}

export const useDealProductStore = create<DealProductStore>((set) => ({
  selectedProducts: {},
  setSelectedProducts: (products) => set({ selectedProducts: products }),
  resetState: () => set({ selectedProducts: {} }),
}))
