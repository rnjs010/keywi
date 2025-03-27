// 업로드 이미지를 임시저장하기 위한 store
import { create } from 'zustand'
import { ProductTag } from '@/interfaces/HomeInterfaces'

interface ImageState {
  images: string[]
  productTags: ProductTag[]
  setImages: (images: string[]) => void
  addProductTag: (tag: ProductTag) => void
  removeProductTag: (id: number) => void
  setProductTags: (tags: ProductTag[]) => void
  reset: () => void
}

const useImageStore = create<ImageState>((set) => ({
  images: [],
  productTags: [],

  setImages: (images) => set({ images }),

  addProductTag: (tag) =>
    set((state) => ({
      productTags: [...state.productTags, tag],
    })),

  removeProductTag: (id) =>
    set((state) => ({
      productTags: state.productTags.filter((tag) => tag.id !== id),
    })),

  setProductTags: (tags) => set({ productTags: tags }),

  reset: () => set({ images: [], productTags: [] }),
}))

export default useImageStore
