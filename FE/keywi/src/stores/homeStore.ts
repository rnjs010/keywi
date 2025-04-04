// 업로드 이미지를 임시저장하기 위한 store
import { create } from 'zustand'
import { ProductTag } from '@/interfaces/HomeInterfaces'

interface ImageState {
  images: string[] // 이미지 미리보기 URL
  imageFiles: File[] // 실제 이미지 파일
  productTags: ProductTag[] // 상품 태그 관련
  hashtags: string[] // 해시태그 목록
  content: string // 글 내용

  setImages: (images: string[]) => void
  setImageFiles: (files: File[]) => void
  addProductTag: (tag: ProductTag) => void
  removeProductTag: (id: number) => void
  setProductTags: (tags: ProductTag[]) => void
  setHashtags: (hashtags: string[]) => void
  addHashtag: (hashtag: string) => void
  removeHashtag: (hashtag: string) => void
  setContent: (content: string) => void
  reset: () => void
}

const useImageStore = create<ImageState>((set) => ({
  images: [],
  imageFiles: [],
  productTags: [],
  hashtags: [],
  content: '',

  setImages: (images) => set({ images }),

  setImageFiles: (files) => set({ imageFiles: files }),

  addProductTag: (tag) =>
    set((state) => ({
      productTags: [...state.productTags, tag],
    })),

  removeProductTag: (id) =>
    set((state) => ({
      productTags: state.productTags.filter((tag) => tag.id !== id),
    })),

  setProductTags: (tags) => set({ productTags: tags }),

  setHashtags: (hashtags) => set({ hashtags }),

  addHashtag: (hashtag) =>
    set((state) => ({
      hashtags: [...state.hashtags, hashtag],
    })),

  removeHashtag: (hashtag) =>
    set((state) => ({
      hashtags: state.hashtags.filter((tag) => tag !== hashtag),
    })),

  setContent: (content) => set({ content }),

  reset: () =>
    set({
      images: [],
      imageFiles: [],
      productTags: [],
      hashtags: [],
      content: '',
    }),
}))

export default useImageStore
