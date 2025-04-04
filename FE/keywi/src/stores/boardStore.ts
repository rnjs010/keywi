import { BoardItemUsingInfo } from '@/interfaces/BoardInterface'
import { create } from 'zustand'

interface BoardProductStore {
  favoriteProducts: Record<string, BoardItemUsingInfo[]>
  selectedProducts: Record<string, BoardItemUsingInfo> // key가 카테고리 이름, value가 BoardItem(상품 정보)
  title: string
  content: string
  images: string[]
  setFavoriteProducts: (
    categoryName: string,
    products: BoardItemUsingInfo[],
  ) => void
  setSelectedProducts: (products: Record<string, BoardItemUsingInfo>) => void
  setTitle: (title: string) => void
  setContent: (content: string) => void
  setImages: (images: string[]) => void
  resetState: () => void
}

export const useBoardProductStore = create<BoardProductStore>((set) => ({
  favoriteProducts: {},
  selectedProducts: {},
  title: '',
  content: '',
  images: [],
  setFavoriteProducts: (categoryName, products) =>
    set((state) => ({
      favoriteProducts: { ...state.favoriteProducts, [categoryName]: products },
    })),
  setSelectedProducts: (products) => set({ selectedProducts: products }),
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setImages: (images) => set({ images }),
  resetState: () =>
    set({
      favoriteProducts: {},
      selectedProducts: {},
      title: '',
      content: '',
      images: [],
    }),
}))
