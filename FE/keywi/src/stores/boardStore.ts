import { BoardItem } from '@/interfaces/BoardInterface'
import { create } from 'zustand'

interface BoardProductStore {
  selectedProducts: Record<string, BoardItem>
  title: string
  content: string
  setSelectedProducts: (products: Record<string, BoardItem>) => void
  setTitle: (title: string) => void
  setContent: (content: string) => void
  resetState: () => void
}

export const useBoardProductStore = create<BoardProductStore>((set) => ({
  selectedProducts: {},
  title: '',
  content: '',
  setSelectedProducts: (products) => set({ selectedProducts: products }),
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  resetState: () => set({ selectedProducts: {}, title: '', content: '' }),
}))
