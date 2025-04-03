import { BoardItem } from '@/interfaces/BoardInterface'
import { create } from 'zustand'

interface BoardProductStore {
  selectedProducts: Record<string, BoardItem> // key가 카테고리 이름, value가 BoardItem(상품 정보)
  title: string
  content: string
  images: string[]
  setSelectedProducts: (products: Record<string, BoardItem>) => void
  setTitle: (title: string) => void
  setContent: (content: string) => void
  setImages: (images: string[]) => void
  resetState: () => void
}

export const useBoardProductStore = create<BoardProductStore>((set) => ({
  selectedProducts: {},
  title: '',
  content: '',
  images: [],
  setSelectedProducts: (products) => set({ selectedProducts: products }),
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setImages: (images) => set({ images }),
  resetState: () =>
    set({ selectedProducts: {}, title: '', content: '', images: [] }),
}))
